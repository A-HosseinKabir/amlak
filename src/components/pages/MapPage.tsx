// src/components/pages/MapPage.tsx
import React, { useState } from 'react';
import { useProperties } from '../../hooks/useProperties';
import PropertyMap from '../CustomMap'; // ✅ مسیر درست (یک سطح بالا)
import PropertyDetail from '../features/properties/PropertyDetail';
import { Property } from '../../';

export const MapPage: React.FC = () => {
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseDetail = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="h-full w-full relative">
      <CustomMap
        properties={properties}
        onMarkerClick={handleMarkerClick}
        showBoundsList={true}
      />

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={handleCloseDetail}
          onChatClick={() => {}}
        />
      )}
    </div>
  );
};

export default MapPage;