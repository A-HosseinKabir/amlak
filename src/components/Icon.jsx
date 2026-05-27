// IconGallery.jsx
import * as Icons from '@open-condo/icons';

const IconGallery = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
      {Object.entries(Icons).map(([name, IconComponent]) => (
        <div key={name} style={{ textAlign: 'center', padding: '1rem', border: '1px solid #ccc' }}>
          <IconComponent size="medium" />
          <div style={{ fontSize: '12px', marginTop: '8px' }}>{name}</div>
        </div>
      ))}
    </div>
  );
};

export default IconGallery;