export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
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
  description: string;
  cost: number;
}

export interface BudgetStatus {
  assignedBudget: number;
  totalSpent: number;
  difference: number;
}

export interface PlannerNote {
  title: string;
  note: string;
  eventId: string;
  createdBy: string;
}
