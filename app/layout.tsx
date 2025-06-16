import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aconcarga - Sistema de Gestión Logística con IA",
  description: "Plataforma integral para la gestión de operaciones logísticas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Verificar si la ruta actual es de autenticación o página de selección
  const isAuthPage =
    typeof window !== "undefined" &&
    (window.location.pathname === "/" ||
      window.location.pathname === "/empresa/login" ||
      window.location.pathname === "/empresa/recuperar-contrasena" ||
      window.location.pathname === "/empresa/registro" ||
      window.location.pathname === "/sistema-abierto/login" ||
      window.location.pathname === "/sistema-abierto/recuperar-contrasena" ||
      window.location.pathname === "/sistema-abierto/registro" ||
      window.location.pathname === "/sistema-abierto/terminos" ||
      window.location.pathname === "/sistema-abierto/privacidad")

  return (
    <html lang="es">
      <body className={inter.className}>
        {isAuthPage ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <main className="container mx-auto py-6 px-4 md:px-6">{children}</main>
            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        )}
      </body>
    </html>
  )
}
