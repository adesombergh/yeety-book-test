import { CancellationConfirmationEmail } from '../src/components/emails/cancellation-confirmation'

// Sample data for email preview
const sampleReservation = {
  id: 2,
  firstName: 'Marie',
  lastName: 'Martin',
  email: 'marie.martin@example.com',
  phone: '+33 1 98 76 54 32',
  date: new Date('2024-12-20T20:00:00'),
  guests: 2,
  notes: 'Menu végétarien',
}

const sampleRestaurant = {
  name: 'Le Petit Bistrot',
  emailContact: 'contact@lepetitbistrot.fr',
  phoneContact: '+33 1 42 86 95 27',
}

// Export the email component with sample data for React Email preview
export default function CancellationConfirmationPreview() {
  return (
    <CancellationConfirmationEmail
      reservation={sampleReservation}
      restaurant={sampleRestaurant}
      locale="fr"
    />
  )
}
