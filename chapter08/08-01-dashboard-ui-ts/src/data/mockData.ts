import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { StatData, MenuItem, UserInfo } from '../types/dashboard';

// 통계 데이터
export const statsData: StatData[] = [
  {
    id: 'revenue',
    title: '총 매출',
    value: '₩2,456,000',
    change: 12.5,
    icon: React.createElement(TrendingUpIcon),
    color: 'primary',
  },
  {
    id: 'users',
    title: '신규 사용자',
    value: '1,847',
    change: 8.2,
    icon: React.createElement(PersonAddIcon),
    color: 'success',
  },
  {
    id: 'orders',
    title: '주문 수',
    value: '342',
    change: -3.1,
    icon: React.createElement(LocalShippingIcon),
    color: 'warning',
  },
  {
    id: 'inventory',
    title: '재고 수량',
    value: '1,253',
    change: 5.4,
    icon: React.createElement(InventoryIcon),
    color: 'info',
  },
];

// 메뉴 데이터
export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: React.createElement(DashboardIcon),
  },
  {
    id: 'users',
    title: '사용자',
    icon: React.createElement(PeopleIcon),
    badge: 3,
  },
  {
    id: 'orders',
    title: '주문',
    icon: React.createElement(ShoppingCartIcon),
    badge: 12,
  },
  {
    id: 'analytics',
    title: '분석',
    icon: React.createElement(AnalyticsIcon),
  },
  {
    id: 'notifications',
    title: '알림',
    icon: React.createElement(NotificationsIcon),
    badge: 8,
  },
  {
    id: 'settings',
    title: '설정',
    icon: React.createElement(SettingsIcon),
  },
];

// 사용자 정보 데이터
export const userInfo: UserInfo = {
  name: '홍길동',
  email: 'hong@company.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  role: '관리자',
};