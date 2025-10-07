import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RestaurantWithTypedHours } from '@/lib/types/restaurant'
import { cn } from '@/lib/utils'
import { isRestaurantOpen } from '@/lib/utils/opening-hours'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface DashboardRestaurantCardProps {
  restaurant: RestaurantWithTypedHours
}

export function DashboardRestaurantCard({
  restaurant,
}: DashboardRestaurantCardProps) {
  const t = useTranslations('ui')
  const tCommon = useTranslations('common')
  const isOpen = isRestaurantOpen(restaurant.openingHours)

  return (
    <Link href={`/dashboard/${restaurant.id}/calendar`} className="w-full">
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            {restaurant.logoUrl ? (
              <Image
                src={restaurant.logoUrl}
                alt={`${restaurant.name} logo`}
                className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-semibold text-primary">
                  {restaurant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <CardTitle className="text-xl text-text-dark">
              {restaurant.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                  'bg-green-100 text-green-800': isOpen,
                  'bg-red-100 text-red-800': !isOpen,
                }
              )}
            >
              {isOpen ? t('openNow') : t('closed')}
            </span>
            {restaurant.subscriptionStatus !== 'active' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {tCommon('limitedService')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
