import { api } from './backendService';
import { Property } from '../types/property';

export const propertyService = {
  getProperties: async (): Promise<Property[]> => {
    return await api.getProperties();
  },

  subscribeToProperties: (onData: (properties: Property[]) => void) => {
    return api.subscribeToProperties(onData);
  }
};
