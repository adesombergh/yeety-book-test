import Link from 'next/link';
import { RestaurantWithTypedHours } from '@/lib/types/restaurant';
import { isRestaurantOpen } from '@/lib/utils/opening-hours';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RestaurantCardProps {
  restaurant: RestaurantWithTypedHours;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const isOpen = isRestaurantOpen(restaurant.openingHours);

  return (
    <Link href={`/${restaurant.slug}/reservation`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-xl text-text-dark">
            {restaurant.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOpen
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            {restaurant.subscriptionStatus !== 'active' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Limited Service
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
