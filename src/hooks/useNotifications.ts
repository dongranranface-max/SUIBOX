import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'offer_countered' | 'system';
  title: string;
  message: string;
  address: string;
  read: boolean;
  data?: any;
  createdAt: number;
}

export function useNotifications(address?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`/api/notifications?address=${address}`);
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
        setUnreadCount(json.unreadCount);
      }
    } catch (err) {
      console.error('获取通知失败', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId?: string, markAll = false) => {
    const res = await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        notificationId, 
        markAllRead: markAll,
        address,
      }),
    });
    const json = await res.json();
    if (json.success) {
      await fetchNotifications();
    }
    return json;
  };

  return { notifications, unreadCount, loading, refetch: fetchNotifications, markAsRead };
}
