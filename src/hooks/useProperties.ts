// src/hooks/useProperties.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { propertyApi } from '../api/property.api';
import { Property } from '../types/property.types';
import { DEFAULT_FILTERS } from '../utils/constants';
import { FilterState } from '../types/filter.types';

export const useProperties = (initialFilters?: FilterState) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters || DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await propertyApi.getList({
        ...filters,
        sortBy,
        page,
        limit: 10,
      });
      setProperties(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('خطا در بارگذاری آگهی‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, page]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const changePage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  return {
    properties,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    page,
    totalPages,
    changePage,
    resetFilters,
    refetch: loadProperties,
  };
};