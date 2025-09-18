'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Building2 } from 'lucide-react'
import { Restaurant } from '@prisma/client'

interface RestaurantSwitcherProps {
  className?: string
  currentRestaurant?: Restaurant | null
}

export function RestaurantSwitcher({
  className,
  currentRestaurant,
}: RestaurantSwitcherProps) {
  const pathname = usePathname()

  // Extract restaurant ID from pathname
  const restaurantIdMatch = pathname.match(/^\/dashboard\/(\d+)/)
  const restaurantId = restaurantIdMatch ? restaurantIdMatch[1] : null

  // If we're on the main dashboard page, show "My restaurants"
  if (!restaurantId) {
    return (
      <div className={className}>
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-text-secondary" />
          <span className="font-semibold text-text-dark">My restaurants</span>
        </div>
      </div>
    )
  }

  // If we have a current restaurant, show it with navigation
  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <Building2 className="h-5 w-5 text-text-secondary" />
        <div className="flex items-center space-x-1">
          <Link
            href="/dashboard"
            className="text-sm text-text-secondary hover:text-text-dark transition-colors"
          >
            My restaurants
          </Link>
          <span className="text-text-secondary">/</span>
          <span className="font-semibold text-text-dark">
            {currentRestaurant?.name || `Restaurant ${restaurantId}`}
          </span>
        </div>

        {/* Future enhancement: Dropdown for multiple restaurants */}
        {/* This is a placeholder for when we implement restaurant switching */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-50 cursor-not-allowed"
          disabled
        >
          <ChevronDown className="h-3 w-3" />
          <span className="sr-only">Switch restaurant (coming soon)</span>
        </Button>
      </div>
    </div>
  )
}
