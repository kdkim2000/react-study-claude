import { ReactNode } from 'react';

// 통계 카드 데이터 타입
export interface StatData {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  badge?: number;
}

// 사용자 정보 타입
export interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

// 헤더 컴포넌트 Props
export interface HeaderProps {
  onMenuClick: () => void;
  userInfo: UserInfo;
}

// 사이드바 컴포넌트 Props
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  selectedItem: string;
  onMenuSelect: (itemId: string) => void;
}

// 통계 카드 컴포넌트 Props
export interface StatCardProps {
  data: StatData;
}