'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Restaurant } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { daysOfWeek, type OpeningHours } from '@/lib/types/restaurant'

interface RestaurantProgressProps {
  restaurant: Restaurant | null
}

const milestoneKeys = [
  'created',
  'addedLogo',
  'setOpeningHours',
  'addedContactInfo',
  'billingInfo',
] as const

type MilestoneKey = (typeof milestoneKeys)[number]

export function RestaurantProgress({ restaurant }: RestaurantProgressProps) {
  const t = useTranslations('dashboard.progress')

  if (!restaurant) return null

  // Calculate completion status for each milestone
  const completedSteps: Record<MilestoneKey, boolean> = {
    created: true, // Always true if restaurant exists
    addedLogo: !!restaurant.logoUrl,
    setOpeningHours: (() => {
      if (!restaurant.openingHours) return false

      const hours = restaurant.openingHours as unknown as OpeningHours
      // Check if at least one day has periods (not all days closed)
      return daysOfWeek.some((day) => {
        const daySchedule = hours[day]
        return (
          daySchedule &&
          Array.isArray(daySchedule.periods) &&
          daySchedule.periods.length > 0
        )
      })
    })(),
    addedContactInfo: !!(restaurant.emailContact || restaurant.phoneContact),
    billingInfo: true, // Future: check Stripe subscription
  }

  const milestones = milestoneKeys.map((key) => ({
    key,
    label: t(`milestones.${key}`),
    completed: completedSteps[key],
  }))

  const completedCount = Object.values(completedSteps).filter(Boolean).length
  const totalSteps = milestones.length
  const percentage = Math.round((completedCount / totalSteps) * 100)

  // Hide progress helper when all milestones are complete
  if (percentage === 100) return null

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center">
          <svg className="size-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              className="text-primary transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{percentage}%</span>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-sm">{t('title')}</span>
          </div>
          {milestones.map((milestone) => {
            const isCompleted = milestone.completed
            return (
              <div
                key={milestone.key}
                className="flex items-center gap-3 text-sm"
              >
                <div
                  className={cn(
                    'flex shrink-0 size-5 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {isCompleted && <Check className="size-3" />}
                </div>
                <span
                  className={cn(
                    'transition-all',
                    isCompleted
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  )}
                >
                  {milestone.label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
