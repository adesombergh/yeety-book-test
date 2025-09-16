import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { RestaurantWithTypedHours } from '@/lib/types/restaurant'
import { isRestaurantOpen } from '@/lib/utils/opening-hours'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardRestaurantCardProps {
  restaurant: RestaurantWithTypedHours
}

export function DashboardRestaurantCard({
  restaurant,
}: DashboardRestaurantCardProps) {
  const t = useTranslations('dashboard.home')
  const isOpen = isRestaurantOpen(restaurant.openingHours)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl text-text-dark">
          {restaurant.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
          {restaurant.subscriptionStatus !== 'active' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Limited Service
            </span>
          )}
        </div>
        <p className="text-text-secondary text-sm">
          Slug: <span className="font-mono">{restaurant.slug}</span>
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/${restaurant.id}/calendar`} className="w-full">
          <Button className="w-full">{t('goToDashboard')}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
