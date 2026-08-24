import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Property } from '../types/property.types';
import { storage } from '../utils/storage';
import { MOCK_PROPERTIES } from '../utils/constants';

export interface BookmarkContextType {
  bookmarks: Property[];
  isBookmarked: (propertyId: string) => boolean;
  toggleBookmark: (property: Property) => void;
  clearBookmarks: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Property[]>([]);

  const loadBookmarks = () => {
    const ids = storage.getBookmarkIds();
    const props = MOCK_PROPERTIES.filter(p => ids.includes(p.id));
    setBookmarks(props);
  };

  useEffect(() => {
    loadBookmarks();
    const handleSync = () => loadBookmarks();
    window.addEventListener('bookmarks-updated', handleSync);
    return () => window.removeEventListener('bookmarks-updated', handleSync);
  }, []);

  const isBookmarked = (propertyId: string) => {
    return bookmarks.some(p => p.id === propertyId);
  };

  const toggleBookmark = (property: Property) => {
    const newIsBookmarked = storage.toggleBookmark(property.id);
    loadBookmarks();
    window.dispatchEvent(new Event('bookmarks-updated'));
    return newIsBookmarked;
  };

  const clearBookmarks = () => {
    storage.setBookmarkIds([]);
    loadBookmarks();
    window.dispatchEvent(new Event('bookmarks-updated'));
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, clearBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export { BookmarkContext };

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
};