import { format } from 'date-fns';
import { Calendar, Clock, Users, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReservationCardProps {
  reservation: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: Date | string;
    guests: number;
    notes?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  };
  restaurant?: {
    name: string;
    slug: string;
  };
  showRestaurant?: boolean;
  className?: string;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export function ReservationCard({
  reservation,
  restaurant,
  showRestaurant = false,
  className
}: ReservationCardProps) {
  const reservationDate = typeof reservation.date === 'string'
    ? new Date(reservation.date)
    : reservation.date;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">
            {reservation.firstName} {reservation.lastName}
          </CardTitle>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[reservation.status]}`}>
            {statusLabels[reservation.status]}
          </span>
        </div>
        {showRestaurant && restaurant && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.name}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{format(reservationDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{format(reservationDate, 'h:mm a')}</span>
        </div>

        {/* Guest Count */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-500" />
          <span>{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
        </div>

        {/* Contact Information */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="truncate">{reservation.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{reservation.phone}</span>
        </div>

        {/* Notes */}
        {reservation.notes && (
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 leading-relaxed">{reservation.notes}</span>
          </div>
        )}

        {/* Reservation ID */}
        <div className="pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Reservation #{reservation.id}</span>
        </div>
      </CardContent>
    </Card>
  );
}
