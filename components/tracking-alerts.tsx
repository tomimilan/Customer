"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertTriangle, CheckCircle, Eye, MapPin, MoreHorizontal } from "lucide-react"

export function TrackingAlerts() {
  const [alerts] = useState([
    {
      id: "ALT-1001",
      carga: "CRG-1001",
      tipo: "Retraso",
      descripcion: "Retraso en aduana de Mendoza",
      fecha: "14/07/2023 15:30",
      impacto: "Alto",
      estado: "Activa",
    },
    {
      id: "ALT-1002",
      carga: "CRG-1002",
      tipo: "Desvío de ruta",
      descripcion: "Desvío por obras en Ruta 9",
      fecha: "14/07/2023 14:15",
      impacto: "Medio",
      estado: "Activa",
    },
    {
      id: "ALT-1003",
      carga: "CRG-1004",
      tipo: "Documentación",
      descripcion: "Falta certificado sanitario",
      fecha: "14/07/2023 12:45",
      impacto: "Alto",
      estado: "Activa",
    },
    {
      id: "ALT-1004",
      carga: "CRG-1006",
      tipo: "Clima",
      descripcion: "Alerta meteorológica en la ruta",
      fecha: "14/07/2023 10:30",
      impacto: "Medio",
      estado: "Activa",
    },
    {
      id: "ALT-1005",
      carga: "CRG-1003",
      tipo: "Retraso",
      descripcion: "Retraso en carga inicial",
      fecha: "13/07/2023 16:20",
      impacto: "Bajo",
      estado: "Resuelta",
    },
  ])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Carga</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Impacto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id}>
            <TableCell className="font-medium">{alert.id}</TableCell>
            <TableCell>{alert.carga}</TableCell>
            <TableCell>{alert.tipo}</TableCell>
            <TableCell>{alert.descripcion}</TableCell>
            <TableCell>{alert.fecha}</TableCell>
            <TableCell>
              <Badge
                className={
                  alert.impacto === "Alto" ? "bg-red-500" : alert.impacto === "Medio" ? "bg-yellow-500" : "bg-blue-500"
                }
              >
                {alert.impacto}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {alert.estado === "Activa" ? (
                  <AlertTriangle className="mr-1 h-3 w-3 text-red-500" />
                ) : (
                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                )}
                {alert.estado}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MapPin className="mr-2 h-4 w-4" />
                    Ver en mapa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {alert.estado === "Activa" ? (
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como resuelta
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Reabrir alerta
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
