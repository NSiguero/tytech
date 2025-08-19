"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, BarChart3, Calendar, MapPin, Settings, Bot, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendario", href: "/calendar", icon: Calendar },
  { name: "Visitas", href: "/visits", icon: MapPin },
  { name: "Configuración", href: "/settings", icon: Settings },
  { name: "Asistente IA", href: "/ai", icon: Bot },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        // Silent error handling
      }
    }
  }, [])

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
  }, [collapsed])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const getUserInitials = () => {
    if (user) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
    }
    return "U"
  }

  return (
    <TooltipProvider>
      <div className="sticky top-0 h-screen">
        <div
          className={cn(
            "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen",
            collapsed ? "w-16" : "w-64",
          )}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Retail Analytics</span>
            </div>
          )}

          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Toggle Button - Moved to top */}
        <div className="p-2 border-b border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className={cn(
                  "w-full h-8 p-0 hover:bg-gray-100 border border-gray-200 bg-white shadow-sm",
                  collapsed && "justify-center",
                )}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? "Expandir menú" : "Contraer menú"}</TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full h-10 p-0 justify-center",
                          isActive && "bg-blue-600 text-white hover:bg-blue-700",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn("w-full justify-start h-10", isActive && "bg-blue-600 text-white hover:bg-blue-700")}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{getUserInitials()}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{user ? `${user.first_name} ${user.last_name}` : 'User'}</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user ? `${user.first_name} ${user.last_name}` : 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.role || 'User'}</p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

