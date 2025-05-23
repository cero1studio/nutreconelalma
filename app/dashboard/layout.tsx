"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calculator, Settings, ClipboardList, LogOut, Menu, X } from "lucide-react"
import { SaveStatus } from "@/components/ui/save-status"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      name: "Calculadora",
      path: "/dashboard/calculator",
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: "Configuración",
      path: "/dashboard/configuration",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Historial",
      path: "/dashboard/history",
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo para todos los dispositivos */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="z-50 p-2 rounded-md hover:bg-gray-100">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-f5nDdo9a88OwB8ZX5sUkbCt01JSPaf.png"
            alt="B Braun Logo"
            className="h-8"
          />
          <SaveStatus lastSaved={null} isSaving={false} hasChanges={false} className="hidden md:flex" />
        </div>
      </div>

      {/* Sidebar - hidden by default on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden lg:flex items-center justify-between px-4 py-6">
            <h2 className="text-xl font-bold text-primary">Nutrición Hospitalaria</h2>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4 mt-14">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === route.path ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {route.icon}
                <span className="ml-3">{route.name}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start rounded-full">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal - full width */}
      <div className="w-full">
        <div className="pt-14">
          {/* Contenido de la página con padding adaptativo */}
          <div className="py-4 sm:py-6 px-2 sm:px-4 md:px-6">{children}</div>
        </div>
      </div>

      {/* Overlay para cerrar el menú en móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
