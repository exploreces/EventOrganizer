export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  image: string;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Feedback {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  eventId: string;
  category: string;
  budgeted: number;
  actual: number;
  description: string;
}

export interface AIPlanning {
  eventType: string;
  budget: number;
  attendees: number;
  suggestions: {
    venue: string[];
    catering: string[];
    entertainment: string[];
    timeline: string[];
  };
}