"use client"

import { useState } from "react"
import { AlertTriangle, Clock, MapPin, Truck, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardAlerts() {
  const [alerts] = useState([
    {
      id: 1,
      type: "warning",
      message: "Retraso en aduana de Mendoza para carga CRG-1001",
      time: "Hace 35 minutos",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "info",
      message: "Carga CRG-1004 llegando a aduana de Colonia, Uruguay",
      time: "Hace 1 hora",
      icon: MapPin,
    },
    {
      id: 3,
      type: "warning",
      message: "Desvío de ruta detectado para carga CRG-1002",
      time: "Hace 2 horas",
      icon: Truck,
    },
    {
      id: 4,
      type: "success",
      message: "Carga CRG-1005 entregada con éxito en destino",
      time: "Hace 3 horas",
      icon: CheckCircle,
    },
    {
      id: 5,
      type: "info",
      message: "Tiempo estimado de llegada actualizado para CRG-1006",
      time: "Hace 4 horas",
      icon: Clock,
    },
  ])

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "flex items-start space-x-4 rounded-md border p-3",
            alert.type === "warning" && "border-yellow-500/50 bg-yellow-500/10",
            alert.type === "info" && "border-blue-500/50 bg-blue-500/10",
            alert.type === "success" && "border-green-500/50 bg-green-500/10",
          )}
        >
          <alert.icon
            className={cn(
              "mt-0.5 h-5 w-5",
              alert.type === "warning" && "text-yellow-500",
              alert.type === "info" && "text-blue-500",
              alert.type === "success" && "text-green-500",
            )}
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{alert.message}</p>
            <p className="text-xs text-muted-foreground">{alert.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
