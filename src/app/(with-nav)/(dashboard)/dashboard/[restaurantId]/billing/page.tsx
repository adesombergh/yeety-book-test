import { getTranslations } from 'next-intl/server'
import { getRestaurantById } from '@/lib/queries/restaurant'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingPortalButton } from '@/components/billing/portal-button'
// import { BillingInfoForm } from '@/components/billing/billing-info-form'

interface BillingPageProps {
  params: Promise<{
    restaurantId: string
  }>
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { restaurantId } = await params
  const t = await getTranslations('dashboard.billing')

  // Load restaurant data server-side
  const restaurantIdNum = parseInt(restaurantId, 10)
  if (isNaN(restaurantIdNum)) {
    notFound()
  }

  const { restaurant, error } = await getRestaurantById(restaurantIdNum)

  if (error || !restaurant) {
    notFound()
  }

  // Get status badge color
  const getStatusVariant = (status: string | null) => {
    if (!status) return 'secondary'

    switch (status) {
      case 'active':
        return 'default'
      case 'trialing':
        return 'default'
      case 'past_due':
        return 'destructive'
      case 'canceled':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const statusKey = restaurant.subscriptionStatus || 'unknown'
  const statusLabel = t(`status.${statusKey}`)

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t('title')}</h1>
      <p className="text-text-secondary mt-2">{t('subtitle')}</p>

      <div className="mt-8 space-y-6">
        {/* Billing Information Card */}
        {/* <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-2">
            {t('billingInfo')}
          </h2>
          <p className="text-text-secondary mb-6">
            {t('billingInfoDescription')}
          </p>

          <BillingInfoForm restaurantId={restaurantId} />
        </Card> */}

        {/* Subscription Status Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-4">
            {t('subscriptionDetails')}
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">
                {t('subscriptionStatus')}
              </p>
              <Badge variant={getStatusVariant(restaurant.subscriptionStatus)}>
                {statusLabel}
              </Badge>
            </div>

            {restaurant.subscriptionStatus === 'trialing' && (
              <div className="mt-4 p-4 bg-accent-pink/10 rounded-lg">
                <p className="text-sm text-text-dark">
                  {t('trialEndsOn', {
                    date: new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }),
                  })}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Manage Subscription Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-2">
            {t('manageSubscription')}
          </h2>
          <p className="text-text-secondary mb-6">
            {t('manageSubscriptionDescription')}
          </p>

          <BillingPortalButton restaurantId={restaurantId} />
        </Card>
      </div>
    </div>
  )
}
