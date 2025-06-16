"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Package,
  Users,
  Truck,
  ClipboardList,
  MapPin,
  Star,
  Shield,
  Database,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileSearch,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()

  const routes = [
   
    {
      label: "Cargas",
      icon: Package,
      href: "/modules/cargas",
      active: pathname === "/modules/cargas",
    },
    {
      label: "Parametrización",
      icon: Settings,
      href: "/modules/parametrizacion",
      active: pathname === "/modules/parametrizacion",
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b bg-[#00334a] text-white">
        <div className="flex h-16 items-center justify-center group-data-[collapsible=icon]:justify-center px-6 group-data-[collapsible=icon]:px-2">
          <div className="flex items-center">
            <img
              src="/aconcarga-logo.png"
              alt="Aconcarga Logo"
              className="h-8 w-auto mr-2 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:h-6"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden">Aconcarga</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#00334a] text-white overflow-hidden">
        <SidebarMenu className="py-2 group-data-[collapsible=icon]:items-center">
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton
                asChild
                isActive={route.active}
                tooltip={route.label}
                className="hover:bg-white/10 text-white data-[active=true]:bg-white/20 data-[active=true]:text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <Link
                  href={route.href}
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                >
                  <route.icon className="h-4 w-4 group-data-[collapsible=icon]:mx-auto" />
                  <span>{route.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t bg-[#00334a] text-white group-data-[collapsible=icon]:items-center">
        <div className="p-4 group-data-[collapsible=icon]:p-2">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Juan Ortega</p>
              <p className="text-xs opacity-60">juanortega321@gmail.com</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center text-white transition-colors mt-3 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:ml-0 ml-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
            aria-label="Toggle sidebar"
          >
            {state === "collapsed" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
