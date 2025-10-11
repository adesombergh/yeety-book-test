'use client'

import { cn } from '@/lib/utils'
import { Calendar, CreditCard, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Restaurant } from '@prisma/client'
import Image from 'next/image'

interface DashboardSidebarProps {
  isOpen?: boolean
  onToggle?: () => void
  currentRestaurantId?: string | null
  currentRestaurant?: Restaurant | null
}

export function DashboardSidebar({
  isOpen = true,
  onToggle,
  currentRestaurantId,
  currentRestaurant,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  // Create navigation items dynamically based on current restaurant
  const navigationItems = currentRestaurantId
    ? [
        {
          // TODO: move this into translation keys
          name: 'Calendrier',
          href: `/dashboard/${currentRestaurantId}/calendar`,
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          name: 'Configuration',
          href: `/dashboard/${currentRestaurantId}/settings`,
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: 'Facturation',
          href: `/dashboard/${currentRestaurantId}/billing`,
          icon: <CreditCard className="h-5 w-5" />,
        },
      ]
    : []

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden "
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-background transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 ',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Restaurant Name Header */}
        {currentRestaurant && (
          <div className="px-7 pt-8 pb-4">
            <div className="flex items-center gap-3">
              {currentRestaurant.logoUrl ? (
                <Image
                  src={currentRestaurant.logoUrl}
                  alt={`${currentRestaurant.name} logo`}
                  className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-primary">
                    {currentRestaurant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-text-dark truncate">
                {currentRestaurant.name}
              </h2>
            </div>
          </div>
        )}

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
      </div>
    </>
  )
}
