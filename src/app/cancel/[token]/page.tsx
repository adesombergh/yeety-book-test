'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

interface ReservationDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  date: string
  time: string
  guests: number
  restaurant: {
    name: string
    slug: string
  }
}

export default function CancelReservationPage() {
  const {token} = useParams<{token: string}>()
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReservation()
  })

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/cancel/${token}`)
      const data = await response.json()

      if (response.ok) {
        setReservation(data.reservation)
      } else {
        setError(data.error || 'Failed to load reservation')
      }
    } catch (err) {
      console.log("Err", err)
      setError('Failed to load reservation')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const response = await fetch(`/api/cancel/${token}`, {
        method: 'POST',
      })

      if (response.ok) {
        setCancelled(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to cancel reservation')
      }
    } catch (err) {
      console.log("Err", err)
      setError('Failed to cancel reservation')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Reservation Cancelled</CardTitle>
            <CardDescription>
              Your reservation has been successfully cancelled. You and the restaurant have been notified.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Reservation Not Found</CardTitle>
            <CardDescription>
              This cancellation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cancel Reservation</CardTitle>
          <CardDescription>
            Are you sure you want to cancel your reservation?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Reservation Details</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Restaurant:</strong> {reservation.restaurant.name}</p>
              <p><strong>Name:</strong> {reservation.firstName} {reservation.lastName}</p>
              <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {reservation.time}</p>
              <p><strong>Guests:</strong> {reservation.guests}</p>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Once cancelled, this reservation cannot be restored. You will need to make a new reservation if you change your mind.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Keep Reservation
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                'Cancel Reservation'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
