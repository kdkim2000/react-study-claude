export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
  searchTerm: string;
}