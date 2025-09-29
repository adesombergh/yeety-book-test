import React from 'react'

// TypeScript interfaces for the email template props
interface ReservationConfirmationEmailProps {
  reservation: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    date: Date
    guests: number
    notes?: string | null
    cancelToken: string
  }
  restaurant: {
    name: string
    slug: string
    emailContact: string
    phoneContact?: string | null
  }
  locale?: 'en' | 'fr'
}

// Multi-language content object
const content = {
  en: {
    subject: 'Reservation Confirmed',
    greeting: (firstName: string) => `Hello ${firstName},`,
    confirmed: (restaurantName: string) =>
      `Your reservation at ${restaurantName} has been confirmed.`,
    details: 'Reservation Details:',
    date: 'Date',
    time: 'Time',
    guests: 'Guests',
    notes: 'Special Requests',
    restaurantInfo: 'Restaurant Information:',
    name: 'Restaurant',
    phone: 'Phone',
    email: 'Email',
    footer: 'Thank you for choosing YeetyBook!',
    calendarNote: 'A calendar invite has been attached to this email.',
    contactNote:
      'If you need to make any changes, please contact the restaurant directly.',
    cancelNote: 'Need to cancel? Click the link below:',
    cancelLink: 'Cancel Reservation',
  },
  fr: {
    subject: 'Réservation Confirmée',
    greeting: (firstName: string) => `Bonjour ${firstName},`,
    confirmed: (restaurantName: string) =>
      `Votre réservation chez ${restaurantName} a été confirmée.`,
    details: 'Détails de la réservation :',
    date: 'Date',
    time: 'Heure',
    guests: 'Convives',
    notes: 'Demandes spéciales',
    restaurantInfo: 'Informations du restaurant :',
    name: 'Restaurant',
    phone: 'Téléphone',
    email: 'Email',
    footer: "Merci d'avoir choisi YeetyBook !",
    calendarNote: 'Une invitation de calendrier a été jointe à cet email.',
    contactNote:
      'Si vous devez apporter des modifications, veuillez contacter directement le restaurant.',
    cancelNote: "Besoin d'annuler ? Cliquez sur le lien ci-dessous :",
    cancelLink: 'Annuler la Réservation',
    yeetybook: 'YeetyBook',
  },
}

export function ReservationConfirmationEmail({
  reservation,
  restaurant,
  locale = 'fr',
}: ReservationConfirmationEmailProps) {
  const t = content[locale]

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.subject}</title>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={bodyStyle}>
        <table style={containerStyle} cellPadding="0" cellSpacing="0">
          <tr>
            <td>
              {/* Header with YeetyBook branding */}
              <table style={headerStyle} cellPadding="0" cellSpacing="0">
                <tr>
                  <td style={headerContentStyle}>
                    <h1 style={brandingStyle}>
                      {content.fr.yeetybook || 'YeetyBook'}
                    </h1>
                    <h2 style={headingStyle}>{t.subject}</h2>
                  </td>
                </tr>
              </table>

              {/* Main content */}
              <table style={contentStyle} cellPadding="0" cellSpacing="0">
                <tr>
                  <td style={contentPaddingStyle}>
                    <p style={textStyle}>{t.greeting(reservation.firstName)}</p>
                    <p style={textStyle}>{t.confirmed(restaurant.name)}</p>
                    <p style={textStyle}>{t.calendarNote}</p>

                    {/* Reservation details section */}
                    <table style={sectionStyle} cellPadding="0" cellSpacing="0">
                      <tr>
                        <td>
                          <h3 style={subHeadingStyle}>{t.details}</h3>
                          <table
                            style={detailsTableStyle}
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tr>
                              <td style={labelStyle}>{t.date}:</td>
                              <td style={valueStyle}>
                                {formatDate(reservation.date)}
                              </td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>{t.time}:</td>
                              <td style={valueStyle}>
                                {formatTime(reservation.date)}
                              </td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>{t.guests}:</td>
                              <td style={valueStyle}>{reservation.guests}</td>
                            </tr>
                            {reservation.notes && (
                              <tr>
                                <td style={labelStyle}>{t.notes}:</td>
                                <td style={valueStyle}>{reservation.notes}</td>
                              </tr>
                            )}
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Restaurant information section */}
                    <table style={sectionStyle} cellPadding="0" cellSpacing="0">
                      <tr>
                        <td>
                          <h3 style={subHeadingStyle}>{t.restaurantInfo}</h3>
                          <table
                            style={detailsTableStyle}
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tr>
                              <td style={labelStyle}>{t.name}:</td>
                              <td style={valueStyle}>{restaurant.name}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>{t.email}:</td>
                              <td style={valueStyle}>
                                {restaurant.emailContact}
                              </td>
                            </tr>
                            {restaurant.phoneContact && (
                              <tr>
                                <td style={labelStyle}>{t.phone}:</td>
                                <td style={valueStyle}>
                                  {restaurant.phoneContact}
                                </td>
                              </tr>
                            )}
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Cancellation section */}
                    <table style={sectionStyle} cellPadding="0" cellSpacing="0">
                      <tr>
                        <td>
                          <p style={cancelNoteStyle}>{t.cancelNote}</p>
                          <table
                            style={cancelButtonTableStyle}
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tr>
                              <td style={cancelButtonCellStyle}>
                                <a
                                  // TODO: Use ENV
                                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/${restaurant.slug}/reservation/cancel/${reservation.cancelToken}`}
                                  style={cancelButtonStyle}
                                >
                                  {t.cancelLink}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p style={noteStyle}>{t.contactNote}</p>
                  </td>
                </tr>
              </table>

              {/* Footer */}
              <table style={footerStyle} cellPadding="0" cellSpacing="0">
                <tr>
                  <td style={footerContentStyle}>
                    <p style={footerTextStyle}>{t.footer}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

// Inline styles for maximum email client compatibility
const bodyStyle: React.CSSProperties = {
  margin: '0',
  padding: '40px 0 0 0',
  backgroundColor: '#F8F2EB',
  fontFamily: "'Bricolage Grotesque', Arial, Helvetica, sans-serif",
  lineHeight: '1.6',
  color: '#02201F',
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const headerStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#FE6C3B',
}

const headerContentStyle: React.CSSProperties = {
  padding: '30px 40px',
  textAlign: 'center',
}

const brandingStyle: React.CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  letterSpacing: '1px',
}

const headingStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '20px',
  fontWeight: 'normal',
  color: '#ffffff',
  opacity: '0.9',
}

const contentStyle: React.CSSProperties = {
  width: '100%',
}

const contentPaddingStyle: React.CSSProperties = {
  padding: '40px',
}

const textStyle: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#02201F',
}

const noteStyle: React.CSSProperties = {
  margin: '24px 0 0 0',
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#666666',
  fontStyle: 'italic',
}

const sectionStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '30px',
}

const subHeadingStyle: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#02201F',
  borderBottom: '2px solid #FE6C3B',
  paddingBottom: '8px',
}

const detailsTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const labelStyle: React.CSSProperties = {
  padding: '8px 16px 8px 0',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#02201F',
  verticalAlign: 'top',
  width: '120px',
}

const valueStyle: React.CSSProperties = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#02201F',
  verticalAlign: 'top',
}

const footerStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#F8F2EB',
}

const footerContentStyle: React.CSSProperties = {
  padding: '20px 40px',
  textAlign: 'center',
}

const footerTextStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '12px',
  color: '#666666',
}

const cancelNoteStyle: React.CSSProperties = {
  margin: '0 0 16px 0',
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#02201F',
  textAlign: 'center',
}

const cancelButtonTableStyle: React.CSSProperties = {
  width: '100%',
  margin: '0 auto',
}

const cancelButtonCellStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '0',
}

const cancelButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 24px',
  backgroundColor: '#FE6C3B',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'center',
  border: 'none',
  cursor: 'pointer',
}

export default ReservationConfirmationEmail
