import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-warm flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-text-dark mb-4">
          Yeety Book
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Multi-tenant Restaurant Reservation SaaS Platform
        </p>
        <div className="mt-8">
          <Button size="lg" className="px-8 py-4 text-lg font-semibold">
            Get Started
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-accent-green p-6 rounded-brand text-white text-center">
            <h3 className="font-bold text-lg mb-2">Easy Setup</h3>
            <p className="text-sm opacity-90">Quick restaurant onboarding</p>
          </div>
          <div className="bg-accent-pink p-6 rounded-brand text-text-dark text-center">
            <h3 className="font-bold text-lg mb-2">Smart Booking</h3>
            <p className="text-sm opacity-80">Intelligent reservation system</p>
          </div>
          <div className="bg-accent-yellow p-6 rounded-brand text-text-dark text-center">
            <h3 className="font-bold text-lg mb-2">Analytics</h3>
            <p className="text-sm opacity-80">Detailed insights & reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
