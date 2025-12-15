import { ShoppingBag, BarChart3, type LucideIcon } from 'lucide-react'

export interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    url: string
  }[]
}

export interface NavigationProject {
  name: string
  url: string
  icon: LucideIcon
}

export const navigationMain: NavigationItem[] = [
  {
    title: 'Gestion des Posts',
    url: '/posts',
    icon: ShoppingBag,
  },
]

export const navigationProjects: NavigationProject[] = [
  {
    name: 'Analytiques',
    url: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Mes activités',
    url: '/activities',
    icon: ShoppingBag,
  },
]
