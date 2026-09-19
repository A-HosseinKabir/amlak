import { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Property } from '../types/property';
import { MapPin, List, X, Search, View as View360 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Neshan Vector Map endpoint & settings helper
function sanitizeNeshanKey(rawKey: string): string {
  if (!rawKey) return '';
  const trimmed = rawKey.trim();
  
  // Find the last occurrence of 'web.' or 'service.' to bypass duplication or junk
  const webIndex = trimmed.lastIndexOf('web.');
  const serviceIndex = trimmed.lastIndexOf('service.');
  
  let keyToProcess = trimmed;
  let prefix = '';
  
  if (webIndex !== -1 && webIndex >= serviceIndex) {
    keyToProcess = trimmed.slice(webIndex);
    prefix = 'web.';
  } else if (serviceIndex !== -1) {
    keyToProcess = trimmed.slice(serviceIndex);
    prefix = 'service.';
  }
  
  // Extract strictly the hex part from key to process
  let hexPart = keyToProcess.replace(/^(web\.|service\.)/, '');
  
  // A standard key hex is exactly 32 chars long
  if (hexPart.length > 32) {
    const match = hexPart.match(/^[a-fA-F0-9]{32}/);
    if (match) {
      hexPart = match[0];
    } else {
      hexPart = hexPart.slice(0, 32);
    }
  }
  
  return prefix ? `${prefix}${hexPart}` : hexPart;
}

const RAW_API_KEY = import.meta.env.VITE_NESHAN_API_KEY || 'web.3d70186c9e104faa8b3270543e458f88';
const NESHAN_API_KEY = sanitizeNeshanKey(RAW_API_KEY);
const STYLE_URL = `https://api.neshan.org/v1/maps/publish/map/style?key=${NESHAN_API_KEY}`;

// Tabriz bounds to prevent user from exiting Tabriz city
const TABRIZ_BOUNDS: [[number, number], [number, number]] = [
  [46.12, 37.95], // South-West
  [46.48, 38.18], // North-East
];

// Simple, performant dynamic client-side clustering algorithm
function computeClusters(
  properties: Property[],
  zoom: number
): (Property & { isCluster?: boolean; clusterSize?: number; clusterProperties?: Property[] })[] {
  if (zoom >= 14.5) {
    // Show all individual markers at higher zoom levels
    return properties;
  }

  // Radius for clustering in coordinate degrees relative to zoom level
  const radius = 0.08 / Math.pow(2.2, zoom - 10);
  const clusters: any[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < properties.length; i++) {
    const p1 = properties[i];
    if (visited.has(p1.id)) continue;

    const clusterGroup: Property[] = [p1];
    visited.add(p1.id);

    for (let j = i + 1; j < properties.length; j++) {
      const p2 = properties[j];
      if (visited.has(p2.id)) continue;

      const dLng = p1.location.lng - p2.location.lng;
      const dLat = p1.location.lat - p2.location.lat;
      const distance = Math.sqrt(dLng * dLng + dLat * dLat);

      if (distance < radius) {
        clusterGroup.push(p2);
        visited.add(p2.id);
      }
    }

    if (clusterGroup.length > 1) {
      // Calculate geometric center of the cluster group
      let sumLng = 0;
      let sumLat = 0;
      clusterGroup.forEach((p) => {
        sumLng += p.location.lng;
        sumLat += p.location.lat;
      });
      const avgLng = sumLng / clusterGroup.length;
      const avgLat = sumLat / clusterGroup.length;

      // Group average price
      const avgPrice = clusterGroup.reduce((sum, p) => sum + p.price, 0) / clusterGroup.length;

      clusters.push({
        id: `cluster-${p1.id}`,
        title: `${clusterGroup.length.toLocaleString('fa-IR')} ملک در این محدوده`,
        description: 'بزرگ‌نمایی برای مشاهده جزئیات بیشتر آگهی‌ها',
        price: avgPrice,
        type: p1.type,
        location: {
          lat: avgLat,
          lng: avgLng,
          address: clusterGroup[0].location.address,
        },
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        images: clusterGroup[0].images,
        createdAt: clusterGroup[0].createdAt,
        ownerId: '',
        features: [],
        isCluster: true,
        clusterSize: clusterGroup.length,
        clusterProperties: clusterGroup,
      });
    } else {
      clusters.push(p1);
    }
  }

  return clusters;
}

interface PropertyMapProps {
  properties: Property[];
  onMarkerClick: (property: Property) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  showBoundsList?: boolean;
  isDark?: boolean;
}

export default function PropertyMap({
  properties,
  onMarkerClick,
  center,
  zoom,
  showBoundsList = false,
  isDark = false,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom || 12);
  const mapId = useMemo(() => Math.random().toString(36).substring(2, 9), []);

  // Compute active clusters dynamically when properties or map zoom level updates
  const activeClusters = useMemo(() => {
    return computeClusters(properties, currentZoom);
  }, [properties, currentZoom]);

  // Helper to re-evaluate visible properties inside the current dynamic viewport boundaries
  const updateVisibleProperties = () => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const bounds = map.getBounds();
      if (!bounds) return;

      const visible = properties.filter((p) => {
        const lng = p.location.lng;
        const lat = p.location.lat;
        return bounds.contains(new maplibregl.LngLat(lng, lat));
      });

      setVisibleProperties(visible);
    } catch (err) {
      console.error('Error tracking bounds of maplibre map:', err);
    }
  };

  // 1. Map Initialization (Centered on Tabriz & restricted bounds)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Centered specifically in Tabriz city (coor: 46.345, 38.072)
    const initialLng = center ? center.lng : 46.345;
    const initialLat = center ? center.lat : 38.072;
    const initialZoom = zoom || 12;

    const osmStyle = {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    let mapInstance: maplibregl.Map | null = null;
    let isCleanedUp = false;

    const initMapWithStyle = (style: any) => {
      if (isCleanedUp || !mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [initialLng, initialLat],
        zoom: initialZoom,
        maxBounds: TABRIZ_BOUNDS, // Strictly restrict user to Tabriz city boundaries
        trackResize: true,
        fadeDuration: 300,
      });

      mapRef.current = map;
      mapInstance = map;

      // Track bounding and zoom changes to compute dynamic clustering
      const handleBoundsChange = () => {
        setCurrentZoom(map.getZoom());
        updateVisibleProperties();
      };

      map.on('moveend', handleBoundsChange);
      map.on('zoomend', handleBoundsChange);
      map.on('load', () => {
        map.resize();
        updateVisibleProperties();
      });

      // Handle initial resize delays
      const timer = setTimeout(() => {
        if (!isCleanedUp && mapRef.current) {
          mapRef.current.resize();
          updateVisibleProperties();
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        map.off('moveend', handleBoundsChange);
        map.off('zoomend', handleBoundsChange);
      };
    };

    let cleanupListeners: (() => void) | undefined;

    // Fetch the style JSON. If Neshan style is offline, key is invalid, or returns 503, load with openstreetmap fallback style
    fetch(STYLE_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Style fetch status is ${res.status}`);
        }
        return res.json();
      })
      .then((styleJson) => {
        if (!isCleanedUp) {
          cleanupListeners = initMapWithStyle(styleJson);
        }
      })
      .catch((err) => {
        console.warn('Neshan Vector Map style failed or returned error. Initializing with OpenStreetMap fallback.', err);
        if (!isCleanedUp) {
          cleanupListeners = initMapWithStyle(osmStyle);
        }
      });

    return () => {
      isCleanedUp = true;
      if (cleanupListeners) {
        cleanupListeners();
      }
      if (mapInstance) {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, []);

  // 2. Fly viewport when "center" changes
  useEffect(() => {
    const map = mapRef.current;
    if (map && center) {
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: 15,
        essential: true,
        duration: 1200,
      });
    }
  }, [center]);

  // 3. Dynamic Marker updates based on computed/active clusters
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentClusterIds = new Set(activeClusters.map((c) => c.id));

    // Cleanup markers that are removed
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentClusterIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or Update markers
    activeClusters.forEach((c) => {
      const existingMarker = markersRef.current[c.id];
      const lng = c.location.lng;
      const lat = c.location.lat;

      if (existingMarker) {
        existingMarker.setLngLat([lng, lat]);
      } else {
        const el = document.createElement('div');
        el.className = 'cursor-pointer select-none';

        if (c.isCluster) {
          // Render a gorgeous custom pulse-circle for property cluster badge
          el.innerHTML = `
            <div class="relative flex items-center justify-center group transform active:scale-95 transition-transform duration-150">
              <div class="absolute w-12 h-12 bg-blue-500/25 dark:bg-blue-400/20 rounded-full animate-ping duration-[2000ms]"></div>
              <div class="absolute w-10 h-10 bg-blue-600/35 dark:bg-blue-500/30 rounded-full group-hover:scale-110 transition-transform"></div>
              <div class="w-8 h-8 bg-gradient-to-tr from-blue-700 to-blue-500 text-white rounded-full flex items-center justify-center font-black text-xs shadow-xl ring-2 ring-white dark:ring-slate-900 select-none relative z-10">
                ${(c.clusterSize || 1).toLocaleString('fa-IR')}
              </div>
            </div>
          `;

          el.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentZoomLevel = map.getZoom();
            map.flyTo({
              center: [lng, lat],
              zoom: Math.min(currentZoomLevel + 2, 17),
              essential: true,
              duration: 800,
            });
          });
        } else {
          // Render pristine localized Price tag for single properties
          el.innerHTML = `
            <div class="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1.5 rounded-full shadow-lg font-black text-xs border-2 border-white dark:border-slate-900 transform hover:scale-110 active:scale-95 transition-transform flex items-center justify-center whitespace-nowrap">
              ${(c.price / 1000000000).toLocaleString('fa-IR')} م
            </div>
          `;

          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onMarkerClick(c);
          });
        }

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current[c.id] = marker;
      }
    });

    updateVisibleProperties();
  }, [activeClusters]);

  return (
    <div className="h-full w-full relative">
      {/* Dynamic Styling Hook for Map Theme alignment without external dependencies */}
      <style>{`
        #maplibre-container-${mapId} .maplibregl-canvas {
          filter: ${isDark ? 'invert(90%) hue-rotate(185deg) brightness(82%) contrast(108%) saturate(75%)' : 'none'};
          transition: filter 0.3s ease;
        }
        #maplibre-container-${mapId} .maplibregl-ctrl-group {
          background-color: ${isDark ? '#0f172a !important' : '#ffffff !important'};
          border-color: ${isDark ? '#1e293b !important' : '#e2e8f0 !important'};
        }
        #maplibre-container-${mapId} .maplibregl-ctrl-group button span {
          filter: ${isDark ? 'invert(1) !important' : 'none'};
        }
      `}</style>

      <div 
        ref={mapContainerRef} 
        id={`maplibre-container-${mapId}`}
        className="h-full w-full z-0 rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950" 
      />

      {/* Floating View List Button */}
      {showBoundsList && (
        <div className="fixed bottom-28 md:absolute md:bottom-8 left-1/2 -translate-x-1/2 z-[40] w-full max-w-xs px-4">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="w-full bg-slate-950/95 dark:bg-slate-900/95 backdrop-blur-md text-white py-4 px-6 rounded-full flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-900 border border-slate-800 active:scale-95 transition-all select-none font-black text-sm cursor-pointer"
          >
            <List className="w-5 h-5 text-blue-400" />
            <span>مشاهده آگهی‌های این محدوده</span>
            <span className="bg-blue-600 text-white text-[10px] w-5.5 h-5.5 rounded-full flex items-center justify-center font-black pb-0.5 shadow-md shadow-blue-500/20">
              {visibleProperties.length.toLocaleString('fa-IR')}
            </span>
          </button>
        </div>
      )}

      {/* Floating Bottom Drawer for Visible Area Properties */}
      {showBoundsList && (
        <AnimatePresence>
          {isSheetOpen && (
            <>
              {/* Click-out Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSheetOpen(false)}
                className="fixed inset-0 md:right-64 bg-slate-950/60 z-[90] cursor-pointer"
              />

              {/* Bottom Drawer Container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed bottom-0 left-0 right-0 md:right-64 h-[65vh] max-h-[550px] bg-slate-950/95 border-t border-slate-800/80 rounded-t-[2.5rem] z-[100] flex flex-col shadow-2xl backdrop-blur-lg select-none pb-8"
                dir="rtl"
              >
                {/* Grab Handle Header */}
                <div className="flex-shrink-0 pt-3 pb-2 flex flex-col items-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                  
                  {/* Header Information */}
                  <div className="w-full px-6 pt-3 flex items-center justify-between">
                    <div className="text-right">
                      <h3 className="font-black text-base text-white">آگهی‌های این محدوده</h3>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">
                        فقط آگهی‌های قابل مشاهده بر روی نقشه جاری
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSheetOpen(false)}
                      className="w-9 h-9 bg-slate-900 hover:bg-slate-800 active:scale-90 text-slate-400 hover:text-white rounded-full flex items-center justify-center border border-slate-800/80 transition-all cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable List Container */}
                <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 scrollbar-hide">
                  {visibleProperties.length > 0 ? (
                    visibleProperties.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSheetOpen(false);
                          onMarkerClick(p);
                        }}
                        className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800/60 rounded-3xl p-3 flex gap-4 cursor-pointer transition-all active:scale-[0.99] group text-right"
                      >
                        {/* Left: Thumbnail image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-950 border border-slate-800">
                          <img 
                            src={p.images[0]} 
                            alt={p.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          {p.virtualTourUrl && (
                            <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm p-1.5 rounded-full text-white shadow">
                              <View360 className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        {/* Right: Property spec and values */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="font-black text-sm text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                              {p.title}
                            </h4>
                            <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5 font-bold justify-start">
                              <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                              <span className="truncate max-w-[150px] sm:max-w-xs">{p.location.address}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <span className="text-blue-400 font-black text-sm tracking-tight">
                              {(p.price / 1000000000).toLocaleString('fa-IR')}{' '}
                              <span className="text-[10px] font-bold text-blue-500/80">میلیارد تومان</span>
                            </span>

                            <div className="flex gap-2.5 text-[10px] text-slate-400 font-black bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800/60 leading-none">
                              <span>{p.area.toLocaleString('fa-IR')} متر</span>
                              <span className="text-slate-800">/</span>
                              <span>{p.bedrooms.toLocaleString('fa-IR')} خواب</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Zero State when panning out of active areas */
                    <div className="py-16 text-center flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-slate-600 mb-4 border border-slate-800/60 animate-bounce">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-black text-slate-300">در این محدوده از نقشه ملکی یافت نشد</p>
                      <p className="text-xs text-slate-500 font-bold mt-1.5 max-w-[240px] leading-5">
                        نقشه را جابجا کنید یا مقیاس بزرگ‌نمایی را تغییر دهید تا آگهی‌های آن محدوده ثبت شوند.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
