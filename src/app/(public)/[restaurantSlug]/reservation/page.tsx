interface ReservationPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { restaurantSlug } = await params;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">Make a Reservation</h1>
      <p className="text-text-secondary mt-2">
        Restaurant: {restaurantSlug}
      </p>
    </div>
  );
}
