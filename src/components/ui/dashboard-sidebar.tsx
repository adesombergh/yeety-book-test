'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useClerk } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Calendar,
  Settings,
  CreditCard,
  LogOut,
} from 'lucide-react'

interface DashboardSidebarProps {
  isOpen?: boolean
  onToggle?: () => void
  currentRestaurantId?: string | null
}

export function DashboardSidebar({
  isOpen = true,
  onToggle,
  currentRestaurantId,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('auth')
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' })
  }

  // Create navigation items dynamically based on current restaurant
  const navigationItems = [
    {
      name: 'My Restaurants',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    ...(currentRestaurantId
      ? [
          {
            name: 'Calendar',
            href: `/dashboard/${currentRestaurantId}/calendar`,
            icon: <Calendar className="h-5 w-5" />,
          },
          {
            name: 'Settings',
            href: `/dashboard/${currentRestaurantId}/settings`,
            icon: <Settings className="h-5 w-5" />,
          },
          {
            name: 'Billing',
            href: `/dashboard/${currentRestaurantId}/billing`,
            icon: <CreditCard className="h-5 w-5" />,
          },
        ]
      : []),
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="font-bold text-lg text-text-dark">Dashboard</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-accent-pink/20 hover:text-text-dark'
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('signOut')}
          </Button>
        </div>
      </div>
    </>
  )
}
