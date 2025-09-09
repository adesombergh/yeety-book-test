import Link from 'next/link';

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                ← Back to Home
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Restaurant Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage your restaurant reservations and settings
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Locale: {locale}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-800">Today&apos;s Reservations</h3>
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-3xl font-bold text-green-900 mb-2">12</p>
              <p className="text-sm text-green-700">+3 from yesterday</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Total Customers</h3>
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-2">48</p>
              <p className="text-sm text-blue-700">Expected today</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-orange-800">Revenue</h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-orange-900 mb-2">$2,340</p>
              <p className="text-sm text-orange-700">This week</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-left">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📝</span>
                      <div>
                        <p className="font-semibold">View Reservations</p>
                        <p className="text-sm text-blue-100">Manage today&apos;s bookings</p>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-left">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">⚙️</span>
                      <div>
                        <p className="font-semibold">Restaurant Settings</p>
                        <p className="text-sm text-green-100">Update hours, capacity, etc.</p>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-left">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📊</span>
                      <div>
                        <p className="font-semibold">Analytics</p>
                        <p className="text-sm text-purple-100">View performance reports</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">New reservation</p>
                        <p className="text-sm text-gray-600">John Doe - Party of 4</p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Reservation cancelled</p>
                        <p className="text-sm text-gray-600">Jane Smith - Party of 2</p>
                      </div>
                      <span className="text-xs text-gray-500">15 min ago</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Table updated</p>
                        <p className="text-sm text-gray-600">Table 5 - Available</p>
                      </div>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This is a placeholder dashboard. Features will be implemented in future tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
