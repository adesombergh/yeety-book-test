import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Yeety Book</h1>
            <nav className="space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Restaurant Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Restaurant Reservations Made Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern SaaS platform that enables restaurants to manage online reservations
            with ease. Each restaurant gets their own booking page and dashboard.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Customers can easily book tables with date and time selection
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Restaurant staff can manage reservations in real-time
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Customer Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Automatic email confirmations and cancellation options
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Subscription Based</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Simple monthly subscription with Stripe billing
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Try the Demo</h3>
            <p className="text-gray-600">
              Experience how easy it is for customers to make reservations
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/demo-restaurant/reservation">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Make a Demo Reservation
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Join restaurants already using Yeety Book to manage their reservations
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              Access Restaurant Dashboard
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Yeety Book. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
