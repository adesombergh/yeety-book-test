import { ReservationConfirmationEmail } from '../src/components/emails/reservation-confirmation'

// Sample data for email preview
const sampleReservation = {
  id: 1,
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33 1 23 45 67 89',
  date: new Date('2024-12-15T19:30:00'),
  guests: 4,
  notes: 'Table près de la fenêtre si possible',
  cancelToken: 'sample-cancel-token-123',
}

const sampleRestaurant = {
  name: 'Le Petit Bistrot',
  slug: 'le-petit-bistrot',
  emailContact: 'contact@lepetitbistrot.fr',
  phoneContact: '+33 1 42 86 95 27',
}

// Export the email component with sample data for React Email preview
export default function ReservationConfirmationPreview() {
  return (
    <ReservationConfirmationEmail
      reservation={sampleReservation}
      restaurant={sampleRestaurant}
      locale="fr"
    />
  )
}
