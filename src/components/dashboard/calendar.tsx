'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { OpeningHours } from '@/lib/types/restaurant'
import { ReservationSlot } from '@/components/reservation/block'
import {
  getReservationsForTimeSlot,
  CalendarReservation,
  CalendarReservationsByDate,
} from '@/lib/queries/reservation-calendar'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface DashboardCalendarProps {
  restaurantId: string
  openingHours: OpeningHours
  timeSlotInterval?: number // minutes, default 30
  currentWeek?: Date
}

interface TimeSlot {
  time: string
  hour: number
  minute: number
}

interface WeekDay {
  date: Date
  dayName: string
  dayKey: keyof OpeningHours
  isToday: boolean
  timeSlots: TimeSlot[]
}

export function DashboardCalendar({
  restaurantId,
  openingHours,
  timeSlotInterval = 30,
  currentWeek,
}: DashboardCalendarProps) {
  const t = useTranslations('dashboard.calendar')
  const tUi = useTranslations('ui')
  const [selectedWeek, setSelectedWeek] = useState(currentWeek || new Date())
  const [reservationsByDate, setReservationsByDate] =
    useState<CalendarReservationsByDate>({})
  const [isLoadingReservations, setIsLoadingReservations] = useState(false)
  const [reservationError, setReservationError] = useState<string | null>(null)

  // Fetch reservations for the current week
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoadingReservations(true)
      setReservationError(null)

      const weekStart = getWeekStart(selectedWeek)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999) // End of day

      try {
        const params = new URLSearchParams({
          restaurantId,
          startDate: weekStart.toISOString(),
          endDate: weekEnd.toISOString(),
        })

        const response = await fetch(`/api/reservations/calendar?${params}`)
        const data = await response.json()

        if (!response.ok) {
          setReservationError(data.error || 'Failed to load reservations')
        } else if (data.success) {
          // Convert date strings back to Date objects
          const processedReservationsByDate: CalendarReservationsByDate = {}
          Object.entries(data.reservationsByDate).forEach(
            ([dateKey, reservations]) => {
              processedReservationsByDate[dateKey] = (
                reservations as Array<
                  Omit<CalendarReservation, 'date'> & { date: string }
                >
              ).map((reservation) => ({
                ...reservation,
                date: new Date(reservation.date),
              }))
            }
          )
          setReservationsByDate(processedReservationsByDate)
        } else {
          setReservationError('Failed to load reservations')
        }
      } catch (err) {
        console.error('Error fetching reservations:', err)
        setReservationError('Failed to load reservations')
      } finally {
        setIsLoadingReservations(false)
      }
    }

    fetchReservations()
  }, [restaurantId, selectedWeek])

  // Handle reservation click
  const handleReservationClick = (reservation: CalendarReservation) => {
    // Placeholder for future navigation to reservation details
    console.log('Reservation clicked:', {
      id: reservation.id,
      customer: `${reservation.firstName} ${reservation.lastName}`,
      guests: reservation.guests,
      status: reservation.status,
      date: reservation.date.toLocaleString(),
    })
  }

  // Get the start of the week (Monday)
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  // Generate week data
  const weekData = useMemo((): WeekDay[] => {
    if (!openingHours) return []
    // Generate time slots for a given day
    const generateTimeSlots = (daySchedule: {
      open?: string
      close?: string
      closed: boolean
    }): TimeSlot[] => {
      if (daySchedule.closed || !daySchedule.open || !daySchedule.close) {
        return []
      }

      const slots: TimeSlot[] = []
      const [openHour, openMinute] = daySchedule.open.split(':').map(Number)
      const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number)

      let currentHour = openHour
      let currentMinute = openMinute

      while (
        currentHour < closeHour ||
        (currentHour === closeHour && currentMinute < closeMinute)
      ) {
        slots.push({
          time: `${currentHour.toString().padStart(2, '0')}:${currentMinute
            .toString()
            .padStart(2, '0')}`,
          hour: currentHour,
          minute: currentMinute,
        })

        currentMinute += timeSlotInterval
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
      }

      return slots
    }
    const weekStart = getWeekStart(selectedWeek)
    const today = new Date()
    const dayKeys: (keyof OpeningHours)[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]
    const dayNames = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + index)

      const dayKey = dayKeys[index]
      const daySchedule = openingHours[dayKey]

      return {
        date,
        dayName: dayNames[index],
        dayKey,
        isToday: date.toDateString() === today.toDateString(),
        timeSlots: generateTimeSlots(daySchedule),
      }
    })
  }, [selectedWeek, openingHours, timeSlotInterval])

  // Navigation functions
  const goToPreviousWeek = () => {
    const newWeek = new Date(selectedWeek)
    newWeek.setDate(selectedWeek.getDate() - 7)
    setSelectedWeek(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = new Date(selectedWeek)
    newWeek.setDate(selectedWeek.getDate() + 7)
    setSelectedWeek(newWeek)
  }

  const goToCurrentWeek = () => {
    setSelectedWeek(new Date())
  }

  // Format week range for display
  const formatWeekRange = (): string => {
    const weekStart = getWeekStart(selectedWeek)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }

    const startStr = formatDate(weekStart)
    const endStr = formatDate(weekEnd)
    const year = weekStart.getFullYear()

    return `${startStr} - ${endStr}, ${year}`
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">
            {formatWeekRange()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="input"
            size="sm"
            onClick={goToPreviousWeek}
            className="px-3"
          >
            {t('previous')}
          </Button>
          <Button
            variant="input"
            size="sm"
            onClick={goToCurrentWeek}
            className="px-3"
          >
            {t('today')}
          </Button>
          <Button
            variant="input"
            size="sm"
            onClick={goToNextWeek}
            className="px-3"
          >
            {t('next')}
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-8 rounded-lg overflow-clip">
          {/* Time column header */}
          <div className="p-3 font-medium text-text-secondary text-sm sticky top-0 bg-white">
            {tUi('time')}
          </div>

          {/* Day headers */}
          {weekData.map((day) => (
            <div
              key={day.dayKey}
              className={cn('p-3 text-center sticky top-0 bg-white', {
                'bg-neutral-200': day.isToday,
              })}
            >
              <div className="font-medium text-text-dark text-sm">
                {day.dayName}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {day.date.toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                })}
              </div>
            </div>
          ))}

          {/* Time slots grid */}
          {/* Get all unique time slots across all days */}
          {(() => {
            const allTimeSlots = new Set<string>()
            weekData.forEach((day) => {
              day.timeSlots.forEach((slot) => {
                allTimeSlots.add(slot.time)
              })
            })

            const sortedTimeSlots = Array.from(allTimeSlots).sort()

            return sortedTimeSlots.map((timeSlot) => (
              <div key={timeSlot} className="contents">
                {/* Time label */}
                <div className="p-3 text-xs text-text-secondary border-t border-border">
                  {timeSlot}
                </div>

                {/* Day cells */}
                {weekData.map((day) => {
                  const hasSlot = day.timeSlots.some(
                    (slot) => slot.time === timeSlot
                  )
                  const daySchedule = openingHours[day.dayKey]

                  return (
                    <div
                      key={`${day.dayKey}-${timeSlot}`}
                      className={cn('p-3 border-t border-border min-h-[60px]', {
                        'bg-neutral-200': day.isToday,
                        'bg-gray-100': daySchedule.closed,
                        'hover:bg-neutral-300 cursor-pointer':
                          !daySchedule.closed,
                      })}
                    >
                      {daySchedule.closed && (
                        <div className="text-xs text-text-secondary text-center">
                          {tUi('closed')}
                        </div>
                      )}
                      {hasSlot && !daySchedule.closed && (
                        <ReservationSlot
                          reservations={getReservationsForTimeSlot(
                            reservationsByDate,
                            day.date,
                            timeSlot
                          )}
                          onReservationClick={handleReservationClick}
                          isLoading={isLoadingReservations}
                          maxVisible={2}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          })()}
        </div>

        {/* Error Display */}
        {reservationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{reservationError}</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-neutral-200 rounded"></div>
            <span>{tUi('today')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>{tUi('closed')}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
