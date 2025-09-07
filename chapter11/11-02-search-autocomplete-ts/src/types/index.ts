export interface SearchItem {
  id: string
  title: string
  description?: string
  category: SearchCategory
  popularity: number
}

export type SearchCategory = 'person' | 'place' | 'product' | 'article' | 'company'

export interface RecentSearch {
  id: string
  query: string
  timestamp: number
}

export interface SearchHistory {
  recentSearches: RecentSearch[]
  popularSearches: string[]
}