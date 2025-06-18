// src/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllEvents = () => api.get('/api/events');

export const registerForEvent = (eventId: number) =>
  api.post('/api/registrations', { eventId });

export const getMyRegistrations = () =>
  api.get('/api/registrations/my');

export const getFeedbacksByEvent = (eventId: number) =>
  api.get(`/api/feedbacks/event/${eventId}`);

export const submitFeedback = (data: { eventId: number; stars: number; message?: string }) =>
  api.post('/api/feedbacks', data);

export const updateFeedback = (id: number, data: { eventId: number; stars: number; message?: string }) =>
  api.put(`/api/feedbacks/${id}`, data);

export const deleteFeedback = (id: number) =>
  api.delete(`/api/feedbacks/${id}`);

export default api;
