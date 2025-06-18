import { useEffect, useState } from 'react';
import api from '../utils/api';

interface Event {
  id: number;
  name: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
}

interface Registration {
  id: number;
  eventId: number;
  registeredAt: string;
  userEmail: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchMyRegistrations();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get('/api/registrations/my');
      setRegistrations(res.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const registerForEvent = async (eventId: number) => {
    try {
      await api.post('/api/registrations', { eventId });
      await fetchMyRegistrations();
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  return {
    events,
    registrations,
    registerForEvent,
  };
};
