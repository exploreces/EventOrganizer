import { useEffect, useState } from 'react';
import api from '../utils/api';

interface Event {
  id: number;
  name: string;
  description: string;
  eventType: string;
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

  // ✅ CRUD: Create feedback
  const submitFeedback = async (feedback: Feedback) => {
    try {
      const res = await api.post('/api/feedbacks', feedback);
      return res.data;
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  // ✅ CRUD: Update feedback
  const updateFeedback = async (id: number, feedback: Feedback) => {
    try {
      const res = await api.put(`/api/feedbacks/${id}`, feedback);
      return res.data;
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  // ✅ CRUD: Delete feedback
  const deleteFeedback = async (id: number) => {
    try {
      await api.delete(`/api/feedbacks/${id}`);
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  // ✅ Read: Get all feedbacks
  const fetchAllFeedbacks = async () => {
    try {
      const res = await api.get('/api/feedbacks');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching all feedbacks:', err);
    }
  };

  // ✅ Read: Get feedbacks for specific event
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
  };
};
