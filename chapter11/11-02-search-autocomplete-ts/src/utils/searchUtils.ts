import { SearchCategory } from '../types'

// 검색어 하이라이팅 함수
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 정규식 특수문자 이스케이프 처리
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 카테고리별 아이콘 이름 반환
export function getCategoryIcon(category: SearchCategory): string {
  const iconMap = {
    person: 'Person',
    place: 'LocationOn',
    product: 'ShoppingCart',
    article: 'Article',
    company: 'Business'
  }
  return iconMap[category] || 'Search'
}

// 시간 포맷팅 함수
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return minutes <= 1 ? '방금 전' : `${minutes}분 전`
  } else if (hours < 24) {
    return `${hours}시간 전`
  } else if (days < 7) {
    return `${days}일 전`
  } else {
    return new Date(timestamp).toLocaleDateString()
  }
}