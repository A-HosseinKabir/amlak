// src/hooks/useVisits.ts
import { useState, useEffect, useCallback } from 'react';
import { visitApi, VisitRequest, CreateVisitRequest } from '../api/visit.api';

export const useVisits = () => {
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await visitApi.getMyRequests();
      setRequests(data);
    } catch (err) {
      setError('خطا در بارگذاری درخواست‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const createRequest = useCallback(async (data: CreateVisitRequest) => {
    try {
      const newRequest = await visitApi.create(data);
      // Also save to localStorage for mock persistence
      const currentRequests = localStorage.getItem('visit_requests');
      let allRequests: VisitRequest[] = currentRequests ? JSON.parse(currentRequests) : [];
      allRequests.unshift(newRequest);
      localStorage.setItem('visit_requests', JSON.stringify(allRequests));
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      setError('خطا در ثبت درخواست بازدید');
      throw err;
    }
  }, []);

  const updateRequest = useCallback(async (id: string, slots: VisitRequest['slots']) => {
    try {
      const updated = await visitApi.update(id, slots);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      // Update localStorage
      const currentRequests = localStorage.getItem('visit_requests');
      if (currentRequests) {
        const allRequests: VisitRequest[] = JSON.parse(currentRequests);
        const index = allRequests.findIndex(r => r.id === id);
        if (index !== -1) {
          allRequests[index] = updated;
          localStorage.setItem('visit_requests', JSON.stringify(allRequests));
        }
      }
      return updated;
    } catch (err) {
      setError('خطا در ویرایش درخواست');
      throw err;
    }
  }, []);

  const deleteRequest = useCallback(async (id: string) => {
    try {
      await visitApi.delete(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      // Update localStorage
      const currentRequests = localStorage.getItem('visit_requests');
      if (currentRequests) {
        const allRequests: VisitRequest[] = JSON.parse(currentRequests);
        const filtered = allRequests.filter(r => r.id !== id);
        localStorage.setItem('visit_requests', JSON.stringify(filtered));
      }
    } catch (err) {
      setError('خطا در حذف درخواست');
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: VisitRequest['status']) => {
    try {
      const updated = await visitApi.updateStatus(id, status);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      // Update localStorage
      const currentRequests = localStorage.getItem('visit_requests');
      if (currentRequests) {
        const allRequests: VisitRequest[] = JSON.parse(currentRequests);
        const index = allRequests.findIndex(r => r.id === id);
        if (index !== -1) {
          allRequests[index] = updated;
          localStorage.setItem('visit_requests', JSON.stringify(allRequests));
        }
      }
      return updated;
    } catch (err) {
      setError('خطا در تغییر وضعیت درخواست');
      throw err;
    }
  }, []);

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
    deleteRequest,
    updateStatus,
    loadRequests,
  };
};