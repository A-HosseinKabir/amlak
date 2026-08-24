// src/hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { chatApi, ChatRoom, ChatMessage } from '../api/chat.api';
import { Property } from '../types/property.types';
import { MOCK_PROPERTIES } from '../utils/constants';

export const useChat = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatApi.getRooms();
      setRooms(data);
    } catch (err) {
      setError('خطا در بارگذاری اتاق‌های گفتگو');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const loadMessages = useCallback(async (roomId: string) => {
    try {
      const data = await chatApi.getMessages(roomId);
      setMessages(data);
      setActiveRoomId(roomId);
      // Mark as read
      await chatApi.markAsRead(roomId);
      // Update unread count in rooms list
      setRooms(prev => prev.map(r =>
        r.id === roomId ? { ...r, unreadCount: 0 } : r
      ));
    } catch (err) {
      setError('خطا در بارگذاری پیام‌ها');
      console.error(err);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!activeRoomId) return;
    try {
      const newMessage = await chatApi.sendMessage(activeRoomId, text);
      setMessages(prev => [...prev, newMessage]);
      // Update last message in rooms list
      setRooms(prev => prev.map(r =>
        r.id === activeRoomId
          ? { ...r, lastMessage: text, lastMessageTime: new Date() }
          : r
      ));
    } catch (err) {
      setError('خطا در ارسال پیام');
      console.error(err);
    }
  }, [activeRoomId]);

  const getPropertyForRoom = useCallback((roomId: string): Property | undefined => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      return MOCK_PROPERTIES.find(p => p.id === room.propertyId);
    }
    return undefined;
  }, [rooms]);

  const getUnreadCount = useCallback(async () => {
    try {
      const { count } = await chatApi.getUnreadCount();
      return count;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }, []);

  return {
    rooms,
    messages,
    activeRoomId,
    loading,
    error,
    loadRooms,
    loadMessages,
    sendMessage,
    getPropertyForRoom,
    getUnreadCount,
    setActiveRoomId,
  };
};