"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

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
            <span className="sr-only">Open sidebar</span>
          </Button>
          <span className="font-bold text-lg text-text-dark">Dashboard</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
