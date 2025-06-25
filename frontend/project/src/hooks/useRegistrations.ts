import axios from 'axios';
import { useState, useEffect } from 'react';

export interface Registration {
  id: number;
  userEmail: string;
  eventId: number;
  registeredAt: string; // ISO date string from backend
}

interface UseRegistrationsResult {
  registrations: Registration[];
  count: number;
  loading: boolean;
  getRegistrationCount?: (id: number) => Promise<number>;
}

export const useRegistrations = (eventId?: number): UseRegistrationsResult => {
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
          axios.get(`/api/registrations/event/count/${eventId}`)
        ]);

        console.log("Event ID:", eventId);
        console.log("Fetched registrations:", regRes.data);
        console.log("Fetched count:", countRes.data);

        const fetchedRegistrations = Array.isArray(regRes.data) ? regRes.data : [];
        const fetchedCount = Number(countRes.data) || 0;

        // Optional Debug Logs:
        console.log("Fetched registrations:", fetchedRegistrations);
        console.log("Fetched count:", fetchedCount);

        setRegistrations(fetchedRegistrations);
        setCount(fetchedCount);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setRegistrations([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const getRegistrationCount = async (id: number): Promise<number> => {
    try {
      const res = await axios.get(`/api/registrations/event/count/${id}`);
      return Number(res.data) || 0;
    } catch (err) {
      console.error(`Error fetching count for event ${id}`, err);
      return 0;
    }
  };

  return {
    registrations,
    count,
    loading,
    ...(eventId ? {} : { getRegistrationCount }) // only include when not using modal
  };
};
