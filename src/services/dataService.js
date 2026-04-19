/**
 * Unified Data Service
 * Abstraction layer that switches between Supabase and MongoDB
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';
import mongoService from './mongoService';

const USE_MONGODB = import.meta.env.VITE_USE_MONGODB === 'true';

// Determine which backend to use
const getBackend = () => {
  if (USE_MONGODB && mongoService.isConfigured) {
    return 'mongodb';
  }
  if (isSupabaseConfigured) {
    return 'supabase';
  }
  return 'local';
};

// Local storage fallback for offline mode
const localStorageService = {
  getItem: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
};

/**
 * Content Items Service
 */
export const contentService = {
  async getAll(userId) {
    const backend = getBackend();

    if (backend === 'mongodb') {
      return mongoService.findMany('content_items', { user_id: userId });
    }

    if (backend === 'supabase') {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    // Local fallback
    return localStorageService.getItem(`content_items_${userId}`) || [];
  },

  async create(userId, item) {
    const backend = getBackend();

    if (backend === 'mongodb') {
      return mongoService.create('content_items', { ...item, user_id: userId });
    }

    if (backend === 'supabase') {
      const { data, error } = await supabase
        .from('content_items')
        .insert([{ ...item, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local fallback
    const items = localStorageService.getItem(`content_items_${userId}`) || [];
    const newItem = { ...item, id: Date.now(), user_id: userId };
    items.unshift(newItem);
    localStorageService.setItem(`content_items_${userId}`, items);
    return newItem;
  },

  async update(userId, id, updates) {
    const backend = getBackend();

    if (backend === 'mongodb') {
      return mongoService.updateOne('content_items', { _id: id }, updates);
    }

    if (backend === 'supabase') {
      const { data, error } = await supabase
        .from('content_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local fallback
    const items = localStorageService.getItem(`content_items_${userId}`) || [];
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorageService.setItem(`content_items_${userId}`, items);
    }
    return items[index];
  },

  async delete(userId, id) {
    const backend = getBackend();

    if (backend === 'mongodb') {
      return mongoService.deleteOne('content_items', { _id: id });
    }

    if (backend === 'supabase') {
      const { error } = await supabase.from('content_items').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    // Local fallback
    const items = localStorageService.getItem(`content_items_${userId}`) || [];
    const filtered = items.filter((item) => item.id !== id);
    localStorageService.setItem(`content_items_${userId}`, filtered);
    return true;
  },
};

/**
 * Vlogs Service
 */
export const vlogsService = {
  async getAll(userId) {
    const backend = getBackend();

    if (backend === 'mongodb') {
      return mongoService.findMany('vlogs', { user_id: userId });
    }

    if (backend === 'supabase') {
      const { data, error } = await supabase
        .from('vlogs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    return localStorageService.getItem(`vlogs_${userId}`) || [];
  },

  async create(userId, vlog) {
    const backend = getBackend();

    if (backend === 'mongodb') {
      return mongoService.create('vlogs', { ...vlog, user_id: userId });
    }

    if (backend === 'supabase') {
      const { data, error } = await supabase
        .from('vlogs')
        .insert([{ ...vlog, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const vlogs = localStorageService.getItem(`vlogs_${userId}`) || [];
    const newVlog = { ...vlog, id: Date.now(), user_id: userId };
    vlogs.unshift(newVlog);
    localStorageService.setItem(`vlogs_${userId}`, vlogs);
    return newVlog;
  },

  async update(userId, id, updates) {
    const backend = getBackend();

    if (backend === 'supabase') {
      const { data, error } = await supabase
        .from('vlogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const vlogs = localStorageService.getItem(`vlogs_${userId}`) || [];
    const index = vlogs.findIndex((v) => v.id === id);
    if (index !== -1) {
      vlogs[index] = { ...vlogs[index], ...updates };
      localStorageService.setItem(`vlogs_${userId}`, vlogs);
    }
    return vlogs[index];
  },

  async delete(userId, id) {
    const backend = getBackend();

    if (backend === 'supabase') {
      const { error } = await supabase.from('vlogs').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const vlogs = localStorageService.getItem(`vlogs_${userId}`) || [];
    const filtered = vlogs.filter((v) => v.id !== id);
    localStorageService.setItem(`vlogs_${userId}`, filtered);
    return true;
  },
};

export default {
  contentService,
  vlogsService,
  getBackend,
};