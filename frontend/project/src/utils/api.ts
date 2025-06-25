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

        // EVENTS API //
export const getAllEvents = () => api.get('/api/events');

export const registerForEvent = (eventId: number) =>
  api.post('/api/registrations', { eventId });

export const getMyRegistrations = () =>
  api.get('/api/registrations/my');

            // FEEDBACK API //
export const getFeedbacksByEvent = (eventId: number) =>
  api.get(`/api/feedbacks/event/${eventId}`);

export const submitFeedback = (data: { eventId: number; stars: number; message?: string }) =>
  api.post('/api/feedbacks', data);

export const updateFeedback = (id: number, data: { eventId: number; stars: number; message?: string }) =>
  api.put(`/api/feedbacks/${id}`, data);

export const deleteFeedback = (id: number) =>
  api.delete(`/api/feedbacks/${id}`);

 export const getUserByEmail = (email: string) =>
   api.get(`/api/users/${email}`);

// ---------- BUDGET API ----------
export const getBudgetsForEvent = (eventId: number) =>
  api.get(`/api/budgets/events/${eventId}`);

export const getBudgetStatus = (eventId: number) =>
  api.get(`/api/budgets/budget/status/${eventId}`);

export const getBudgetById = (id: number) =>
  api.get(`/api/budgets/${id}`);

export const createBudget = (data: any) =>
  api.post(`/api/budgets`, data);

export const updateBudget = (id: number, data: any) =>
  api.put(`/api/budgets/${id}`, data);

export const deleteBudget = (id: number) =>
  api.delete(`/api/budgets/${id}`);

// ---------- PLANNER API ----------
export const getPlannersForEvent = (eventId: number) =>
  api.get(`/api/planners/event/${eventId}`);

export const createPlanner = (data: any) =>
  api.post(`/api/planners`, data);

export const updatePlanner = (id: number, data: any) =>
  api.put(`/api/planners/${id}`, data);

export const deletePlanner = (id: number) =>
  api.delete(`/api/planners/${id}`);

export default api;
