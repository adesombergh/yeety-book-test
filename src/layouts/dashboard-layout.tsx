'use client'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { RestaurantSwitcher } from '@/components/restaurant/switcher'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Restaurant } from '@prisma/client'
import { useTranslations } from 'next-intl'

interface DashboardLayoutProps {
  children: ReactNode
  currentRestaurant?: Restaurant | null
  billingInfoComplete?: boolean
}

export const DashboardLayout = ({
  children,
  currentRestaurant,
  billingInfoComplete = false,
}: DashboardLayoutProps): ReactNode | Promise<ReactNode> => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const t = useTranslations()
  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <div className="min-h-full w-64">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentRestaurantId={currentRestaurant?.id.toString() || null}
          currentRestaurant={currentRestaurant}
          billingInfoComplete={billingInfoComplete}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">{t('ui.openSidebar')}</span>
          </Button>
          <RestaurantSwitcher
            currentRestaurant={currentRestaurant}
            className="flex-1 flex justify-center"
          />
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}
