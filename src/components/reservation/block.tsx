'use client'

import { CalendarReservation } from '@/lib/queries/reservation-calendar'
import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ReservationBlockProps {
  reservation: CalendarReservation
  onClick?: (reservation: CalendarReservation) => void
  isLoading?: boolean
}

interface ReservationBlockSkeletonProps {
  count?: number
}

export function ReservationBlock({
  reservation,
  onClick,
  isLoading = false,
}: ReservationBlockProps) {
  if (isLoading) {
    return <ReservationBlockSkeleton />
  }

  const handleClick = () => {
    if (onClick) {
      onClick(reservation)
    } else {
      // Placeholder interaction for validation
      console.log('Reservation clicked:', {
        id: reservation.id,
        customer: `${reservation.firstName} ${reservation.lastName}`,
        guests: reservation.guests,
        status: reservation.status,
        time: reservation.date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    }
  }

  return (
    <div
      className="bg-accent-green text-white rounded-lg p-2 mb-1 cursor-pointer hover:opacity-80 transition-opacity text-xs border border-opacity-20 border-white"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`Reservation for ${reservation.firstName} ${reservation.lastName}, ${reservation.guests} guests`}
    >
      <div className="font-medium truncate">
        {reservation.firstName} {reservation.lastName}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3 " />
          {reservation.guests}
        </span>
      </div>
    </div>
  )
}

export function ReservationBlockSkeleton({
  count = 1,
}: ReservationBlockSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded-lg p-2 mb-1 animate-pulse"
        >
          <div className="h-3 bg-gray-300 rounded mb-2"></div>
          <div className="flex justify-between">
            <div className="h-2 bg-gray-300 rounded w-8"></div>
            <div className="h-2 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      ))}
    </>
  )
}

// Multiple reservations in a single time slot
interface ReservationSlotProps {
  reservations: CalendarReservation[]
  onReservationClick?: (reservation: CalendarReservation) => void
  isLoading?: boolean
  maxVisible?: number
}

export function ReservationSlot({
  reservations,
  onReservationClick,
  isLoading = false,
  maxVisible = 3,
}: ReservationSlotProps) {
  const t = useTranslations('ui')

  if (isLoading) {
    return <ReservationBlockSkeleton count={2} />
  }

  if (reservations.length === 0) {
    return null
  }

  const visibleReservations = reservations.slice(0, maxVisible)
  const hiddenCount = reservations.length - maxVisible

  return (
    <div className="space-y-1">
      {visibleReservations.map((reservation) => (
        <ReservationBlock
          key={reservation.id}
          reservation={reservation}
          onClick={onReservationClick}
        />
      ))}
      {hiddenCount > 0 && (
        <div className="text-xs text-text-secondary text-center py-1">
          {t('moreReservations', { count: hiddenCount })}
        </div>
      )}
    </div>
  )
}
