import axios from 'axios';
import { useState, useEffect } from 'react';

export interface Registration {
  id: number;
  userEmail: string;
  eventId: number;
  registeredAt: string;
}

export const useRegistrations = (eventId?: number) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [regRes, countRes] = await Promise.all([
          axios.get(`/api/registrations/event/${eventId}`),
          axios.get(`/api/registrations/event/${eventId}/count`),
        ]);
        setRegistrations(regRes.data || []);
        setCount(countRes.data || 0);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  return { registrations, count, loading };
};
