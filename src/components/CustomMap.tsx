import { useState, useRef, useEffect } from 'react';
import { MapComponent, MapTypes } from '@neshan-maps-platform/mapbox-gl-react';
import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';
import { Property } from '../types/property';
import { MapPin, List, X, Search, View as View360 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface CustomMapProps {
    properties: Property[];
    onMarkerClick: (property: Property) => void;
    center?: { lat: number; lng: number };
    zoom?: number;
    showBoundsList?: boolean;
    isDark?: boolean;
}

const TABRIZ_BOUNDS: [[number, number], [number, number]] = [
    [45.95, 37.70],
    [46.65, 38.20]
];

export default function CustomMap({
    properties,
    onMarkerClick,
    center,
    zoom,
    showBoundsList = false,
    isDark = false,
}: CustomMapProps) {
    const mapRef = useRef<any>(null);
    const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // ۱. تبدیل دیتا به فرمت استاندارد برای لایه های نشان
    const generateGeoJSON = (data: Property[]) => {
        return {
            type: 'FeatureCollection',
            features: data.map(p => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [p.location.lng, p.location.lat] },
                properties: {
                    ...p,
                    // قیمت برای نمایش در حباب (اگر قیمت در دیتا به تومان است، اینجا به میلیارد تبدیل کن)
                    displayPrice: `${(p.price / 1000000000).toFixed(1)} میلیارد`
                }
            }))
        };
    };

    // ۲. متد به‌روزرسانی لیست آگهی‌های محدوده (با استفاده از داده‌های واقعی لایه)
    const updateVisibleList = (map: any) => {
        if (!map) return;
        // گرفتن تمام فیچرهایی که الان در لایه نقاط انفرادی رندر شده‌اند
        const features = map.queryRenderedFeatures({ layers: ['unclustered-point-label'] });

        const uniqueProperties: Property[] = [];
        const seenIds = new Set();

        features.forEach((f: any) => {
            const p = f.properties;
            if (!seenIds.has(p.id)) {
                seenIds.add(p.id);
                // پارس کردن آرایه تصاویر چون در GeoJSON تبدیل به رشته می‌شود
                const images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                uniqueProperties.push({ ...p, images });
            }
        });
        setVisibleProperties(uniqueProperties);
    };

    const mapSetter = (map: any) => {
        mapRef.current = map;

        map.on('load', () => {
            const pointsData = generateGeoJSON(properties);

            map.addSource('locations', {
                type: 'geojson',
                data: pointsData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            // --- شروع بخش ترسیم گرافیکی (دقیقاً مطابق کد جدیدت) ---
            const drawBubble = () => {
                const size = 64;
                const canvas = document.createElement('canvas');
                canvas.width = size; canvas.height = size;
                const ctx: any = canvas.getContext('2d');
                const radius = 20;
                ctx.fillStyle = '#155dfc';
                ctx.beginPath();
                ctx.roundRect(5, 5, size - 10, size - 25, radius);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(size / 2 - 8, size - 25);
                ctx.lineTo(size / 2 + 8, size - 25);
                ctx.lineTo(size / 2, size - 10);
                ctx.fill();
                return ctx.getImageData(0, 0, size, size);
            };

            map.addImage('bubble-bg', drawBubble(), {
                pixelRatio: 2,
                content: [5, 5, 59, 39],
                stretchX: [[15, 45]],
                stretchY: [[15, 30]]
            });

            map.addLayer({
                id: 'clusters-outer',
                type: 'circle',
                source: 'locations',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': '#155dfc',
                    'circle-opacity': 0.4,
                    'circle-radius': ['step', ['get', 'point_count'], 25, 100, 35, 300, 45]
                }
            });

            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'locations',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': '#155dfc',
                    'circle-radius': ['step', ['get', 'point_count'], 18, 100, 25, 300, 35],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#ffffff'
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'locations',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-size': 14,
                    'text-allow-overlap': true,
                },
                paint: { 'text-color': '#ffffff' }
            });

            map.addLayer({
                id: 'unclustered-point-label',
                type: 'symbol',
                source: 'locations',
                filter: ['!', ['has', 'point_count']],
                layout: {
                    'text-field': ['get', 'displayPrice'],
                    'text-size': 11,
                    'icon-image': 'bubble-bg',
                    'icon-text-fit': 'both',
                    'icon-text-fit-padding': [6, 12, 12, 12],
                    'text-anchor': 'bottom',
                    'text-offset': [0, -0.1],
                    'text-allow-overlap': true
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': '#155dfc',
                    'text-halo-width': 0.3
                }
            });
            // --- پایان بخش ترسیم گرافیکی ---

            // مدیریت رویدادها
            map.on('moveend', () => updateVisibleList(map));

            map.on('click', 'clusters', async (e: any) => {
                const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                const clusterId = features[0].properties.cluster_id;
                const source: any = map.getSource('locations');
                const expansionZoom = await source.getClusterExpansionZoom(clusterId);
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: expansionZoom
                });
            });

            map.on('click', 'unclustered-point-label', (e: any) => {
                const p = e.features[0].properties;
                const pros = properties.find(x => x.id == p.id);
                if (pros) {
                    onMarkerClick(pros);
                }
            });

            map.on('mouseenter', 'clusters', () => map.getCanvas().style.cursor = 'pointer');
            map.on('mouseleave', 'clusters', () => map.getCanvas().style.cursor = '');

            // مقداردهی اولیه لیست
            updateVisibleList(map);
        });
    };

    return (
        <div className="h-full w-full relative">
            <MapComponent
                options={{
                    mapKey: 'web.3d70186c9e104faa8b3270543e458f88',
                    mapType: isDark ? MapTypes.neshanVectorNight : MapTypes.neshanVector,
                    zoom: zoom || 11,
                    center: center ? [center.lng, center.lat] : [46.2947198185519, 38.075699469004746],
                    maxBounds: TABRIZ_BOUNDS,
                    mapTypeControllerOptions: {
                        show: false
                    }
                }}
                mapSetter={mapSetter}
            />

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

            <AnimatePresence>
                {isSheetOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSheetOpen(false)}
                            className="fixed inset-0 md:right-64 bg-slate-950/60 z-[90] cursor-pointer"
                        />
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed bottom-0 left-0 right-0 md:right-64 h-[65vh] max-h-[550px] bg-slate-950/95 border-t border-slate-800/80 rounded-t-[2.5rem] z-[100] flex flex-col shadow-2xl backdrop-blur-lg select-none pb-8"
                            dir="rtl"
                        >
                            <div className="flex-shrink-0 pt-3 pb-2 flex flex-col items-center">
                                <div className="w-12 h-1 bg-slate-800 rounded-full" />
                                <div className="w-full px-6 pt-3 flex items-center justify-between">
                                    <div className="text-right">
                                        <h3 className="font-black text-base text-white">آگهی‌های این محدوده</h3>
                                        <p className="text-xs text-slate-500 font-bold mt-0.5">فقط موارد قابل مشاهده روی نقشه</p>
                                    </div>
                                    <button onClick={() => setIsSheetOpen(false)} className="w-9 h-9 bg-slate-900 text-slate-400 rounded-full flex items-center justify-center border border-slate-800/80 cursor-pointer"><X className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 [&::-webkit-scrollbar]:hidden scrollbar-none">
                                {visibleProperties.length > 0 ? (
                                    visibleProperties.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setIsSheetOpen(false);
                                                const pros = properties.find(x => x.id == p.id);
                                                if (pros) {
                                                    onMarkerClick(pros);
                                                }
                                            }
                                            }
                                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800/60 rounded-3xl p-3 flex gap-4 cursor-pointer transition-all active:scale-[0.99] group text-right"
                                        >
                                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-950">
                                                <img src={p.images[0]} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="font-black text-sm text-slate-100 group-hover:text-blue-400 line-clamp-1">{p.title}</h4>
                                                    <p className="text-slate-500 text-[10px] mt-1 flex items-center gap-1 font-bold">
                                                        <MapPin className="w-3 h-3 text-blue-500" />
                                                        {p.location.address}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-blue-400 font-black text-sm">
                                                        {(p.price / 1000000000).toLocaleString('fa-IR')} میلیارد
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-16 text-center flex flex-col items-center">
                                        <Search className="w-8 h-8 text-slate-700 mb-2" />
                                        <p className="text-sm font-black text-slate-400">ملکی در این محدوده نیست</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

