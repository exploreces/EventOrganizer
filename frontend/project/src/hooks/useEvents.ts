import { useEffect, useState } from 'react';
import api from '../utils/api';


export type EventType = 'CLUB' | 'CONFERENCE' | 'WORKSHOP' | 'SEMINAR' | 'TRAINING' | 'OTHER';

export interface Event {
  id: number;
  name: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  image?: string;
}


interface Registration {
  id: number;
  eventId: number;
  registeredAt: string;
  userEmail: string;
}

interface Feedback {
  id?: number;
  eventId: number;
  stars: number;
  message: string;
  userEmail?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

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

  const createEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      // Ensure eventType is uppercase to match backend enum
      const createData = {
        ...eventData,
        eventType: eventData.eventType.toUpperCase()
      };
      const res = await api.post('/api/events', createData);
      await fetchEvents();
      return res.data;
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      // Clean and format the data
      const updateData = {
        ...eventData,
        id,
        // Ensure dates are in ISO format
        startDate: eventData.startDate ? new Date(eventData.startDate).toISOString() : undefined,
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined,
        // Ensure eventType is uppercase to match backend enum
        eventType: eventData.eventType ? eventData.eventType.toUpperCase() : undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      console.log('Sending update data:', updateData);
      const res = await api.put(`/api/events/${id}`, updateData);
      await fetchEvents();
      return res.data;
    } catch (err) {
      console.error('Error updating event:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await api.delete(`/api/events/${id}`);
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const submitFeedback = async (feedback: Feedback) => {
    try {
      const res = await api.post('/api/feedbacks', feedback);
      return res.data;
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const updateFeedback = async (id: number, feedback: Feedback) => {
    try {
      const res = await api.put(`/api/feedbacks/${id}`, feedback);
      return res.data;
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      await api.delete(`/api/feedbacks/${id}`);
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  const fetchAllFeedbacks = async () => {
    try {
      const res = await api.get('/api/feedbacks');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching all feedbacks:', err);
    }
  };

  const fetchFeedbacksByEvent = async (eventId: number) => {
    try {
      const res = await api.get(`/api/feedbacks/event/${eventId}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching feedbacks for event:', err);
    }
  };

  return {
    events,
    registrations,
    feedbacks,
    registerForEvent,
    submitFeedback,
    updateFeedback,
    deleteFeedback,
    fetchAllFeedbacks,
    fetchFeedbacksByEvent,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};