/**
 * Backend Service Layer
 * 
 * این فایل تمام ارتباطات شبکه با بک‌اند اختصاصی شما را مدیریت می‌کند.
 * برای اتصال به سرور واقعی، کافیست آدرس‌های API را در متدهای زیر اصلاح کنید.
 */

import { Property } from '../types/property';
import { MOCK_PROPERTIES } from '../constants';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: string;
  phoneNumber: string;
  displayName?: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  propertyId: string;
  propertyName: string;
  lastMessage?: string;
  participants: string[];
}

class BackendService {
  /**
   * --- بخش احراز هویت (AUTH) ---
   */
  async sendOtp(phoneNumber: string): Promise<{ success: boolean; sessionId?: string }> {
    console.log(`[API CALL] POST /auth/send-otp: ${phoneNumber}`);
    return { success: true, sessionId: 'sess_' + Math.random().toString(36).substr(2, 9) };
  }

  async verifyOtp(phoneNumber: string, code: string, sessionId?: string): Promise<{ user: User; token: string }> {
    console.log(`[API CALL] POST /auth/verify-otp: ${code}`);
    return {
      token: 'jwt_token_' + Math.random().toString(36).substr(2, 20),
      user: { id: 'usr_' + Date.now(), phoneNumber }
    };
  }

  async updateProfile(userId: string, displayName: string): Promise<User> {
    console.log(`[API CALL] PATCH /users/${userId}: ${displayName}`);
    return { id: userId, phoneNumber: '09...', displayName };
  }

  /**
   * --- بخش املاک (PROPERTIES) ---
   */
  async getProperties(): Promise<Property[]> {
    console.log(`[API CALL] GET /properties`);
    // در اینجا می‌توانید از mock استفاده کنید یا از سرور بگیرید
    return MOCK_PROPERTIES;
  }

  subscribeToProperties(onData: (properties: Property[]) => void) {
    console.log(`[REALTIME] Subscribing to /properties updates`);
    // در دنیای واقعی اینجا از WebSocket یا SSE استفاده می‌شود
    onData(MOCK_PROPERTIES);
    return () => console.log(`[REALTIME] Unsubscribed from properties`);
  }

  /**
   * --- بخش چت و گفتگو (CHAT) ---
   */
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    console.log(`[API CALL] GET /chats?userId=${userId}`);
    return []; 
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    console.log(`[API CALL] GET /chats/${roomId}/messages`);
    return [];
  }

  subscribeToMessages(roomId: string, onData: (messages: ChatMessage[]) => void) {
    console.log(`[REALTIME] Subscribing to messages in room: ${roomId}`);
    onData([]);
    return () => console.log(`[REALTIME] Unsubscribed from messages`);
  }

  async sendMessage(roomId: string, senderId: string, text: string): Promise<ChatMessage> {
    console.log(`[API CALL] POST /chats/${roomId}/messages: ${text}`);
    return { id: Date.now().toString(), senderId, text, timestamp: new Date() };
  }
}

export const api = new BackendService();
