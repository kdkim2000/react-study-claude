export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  joinDate: string;
}

export type UserRole = 'admin' | 'manager' | 'developer' | 'designer' | 'intern';

export interface FilterOptions {
  searchTerm: string;
  selectedRoles: UserRole[];
}

export const USER_ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'admin', label: '관리자', color: '#f44336' },
  { value: 'manager', label: '매니저', color: '#ff9800' },
  { value: 'developer', label: '개발자', color: '#2196f3' },
  { value: 'designer', label: '디자이너', color: '#9c27b0' },
  { value: 'intern', label: '인턴', color: '#4caf50' },
];