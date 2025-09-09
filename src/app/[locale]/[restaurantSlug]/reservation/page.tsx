import Link from 'next/link';

interface ReservationPageProps {
  params: Promise<{
    locale: string;
    restaurantSlug: string;
  }>;
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { locale, restaurantSlug } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-between items-center">
              <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors">
                ← Back to Home
              </Link>
              <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                Dashboard →
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Make a Reservation
            </h1>
            <p className="text-lg text-gray-600">
              Restaurant: <span className="font-semibold text-orange-600">{restaurantSlug}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Locale: {locale}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Reservation Details
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800">
                      📅 <strong>Date & Time:</strong> Coming soon...
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800">
                      👥 <strong>Party Size:</strong> Coming soon...
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800">
                      📝 <strong>Special Requests:</strong> Coming soon...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Restaurant Info
                </h2>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurantSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This is a placeholder for restaurant information. The actual restaurant details will be loaded from the database.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>📍 Address: Coming soon...</p>
                    <p>📞 Phone: Coming soon...</p>
                    <p>🕒 Hours: Coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Book Now (Coming Soon)
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This is a placeholder page for the reservation system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
