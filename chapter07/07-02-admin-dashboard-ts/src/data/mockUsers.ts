import { User, LoginRequest } from '../types/auth';

// 모킹용 사용자 데이터
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '관리자',
    role: 'admin',
    avatar: '👨‍💼',
    createdAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: '일반사용자',
    role: 'user',
    avatar: '👤',
    createdAt: '2023-06-15T00:00:00Z',
    lastLoginAt: '2024-01-14T15:45:00Z',
  },
];

// 로그인 시뮬레이션 함수
export const authenticateUser = async (credentials: LoginRequest): Promise<User | null> => {
  // 실제로는 API 호출을 하지만, 여기서는 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연

  const user = mockUsers.find(
    u => u.email === credentials.email
  );

  // 간단한 비밀번호 체크 (실제로는 서버에서 검증)
  if (user && isValidPassword(credentials.email, credentials.password)) {
    return {
      ...user,
      lastLoginAt: new Date().toISOString(),
    };
  }

  return null;
};

// 간단한 비밀번호 검증 (데모용)
const isValidPassword = (email: string, password: string): boolean => {
  // 데모용 고정 비밀번호
  const validCredentials: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  return validCredentials[email] === password;
};

// 사용자 목록 데이터 (대시보드에서 사용)
export const getAllUsers = (): User[] => {
  return mockUsers;
};

// 사용자 통계 데이터
export const getUserStats = () => {
  return {
    totalUsers: mockUsers.length,
    adminUsers: mockUsers.filter(u => u.role === 'admin').length,
    regularUsers: mockUsers.filter(u => u.role === 'user').length,
    activeToday: Math.floor(mockUsers.length * 0.6),
    newThisMonth: Math.floor(mockUsers.length * 0.3),
  };
};