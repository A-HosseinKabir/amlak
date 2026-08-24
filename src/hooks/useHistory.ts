// src/hooks/useHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { Property } from '../types/property.types';
import { MOCK_PROPERTIES } from '../utils/constants';

export const useHistory = () => {
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [historyProperties, setHistoryProperties] = useState<Property[]>([]);

  const loadHistory = useCallback(() => {
    const ids = storage.getHistoryIds();
    setHistoryIds(ids);
    const props = MOCK_PROPERTIES.filter(p => ids.includes(p.id));
    setHistoryProperties(props);
  }, []);

  useEffect(() => {
    loadHistory();
    const handleSync = () => loadHistory();
    window.addEventListener('history-updated', handleSync);
    window.addEventListener('history-cleared', handleSync);
    return () => {
      window.removeEventListener('history-updated', handleSync);
      window.removeEventListener('history-cleared', handleSync);
    };
  }, [loadHistory]);

  const addToHistory = useCallback((propertyId: string) => {
    storage.addToHistory(propertyId);
    loadHistory();
    window.dispatchEvent(new Event('history-updated'));
  }, [loadHistory]);

  const clearHistory = useCallback(() => {
    storage.clearHistory();
    loadHistory();
    window.dispatchEvent(new Event('history-cleared'));
  }, [loadHistory]);

  return {
    historyIds,
    historyProperties,
    addToHistory,
    clearHistory,
    loadHistory,
  };
};