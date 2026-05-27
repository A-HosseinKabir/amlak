export enum PropertyType {
  APARTMENT = 'آپارتمان',
  HOUSE = 'ویلایی',
  OFFICE = 'اداری',
  LAND = 'زمین',
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  yearBuilt?: number;
  totalFloors?: number;
  unitsPerFloor?: number;
  createdAt: number;
  isFeatured?: boolean;
  ownerId: string;
  features: string[];
}
