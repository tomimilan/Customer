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
import { Eye, FileText, MapPin, MoreHorizontal, Phone } from "lucide-react"

export function TrackingTable() {
  const [trackings] = useState([
    {
      id: "TRK-1001",
      carga: "CRG-1001",
      origen: "Buenos Aires, Argentina",
      destino: "Santiago, Chile",
      transporte: "Transportes Rápidos S.A.",
      chofer: "Juan Pérez",
      ubicacion: "Mendoza, Argentina",
      ultimaActualizacion: "Hace 35 minutos",
      progreso: "65%",
      estado: "En tránsito",
    },
    {
      id: "TRK-1002",
      carga: "CRG-1002",
      origen: "Córdoba, Argentina",
      destino: "Rosario, Argentina",
      transporte: "Logística del Sur",
      chofer: "María González",
      ubicacion: "Villa María, Argentina",
      ultimaActualizacion: "Hace 1 hora",
      progreso: "40%",
      estado: "En tránsito",
    },
    {
      id: "TRK-1003",
      carga: "CRG-1004",
      origen: "Buenos Aires, Argentina",
      destino: "Montevideo, Uruguay",
      transporte: "Transportes Andinos",
      chofer: "Carlos Rodríguez",
      ubicacion: "Colonia, Uruguay",
      ultimaActualizacion: "Hace 2 horas",
      progreso: "80%",
      estado: "En aduana",
    },
    {
      id: "TRK-1004",
      carga: "CRG-1006",
      origen: "Buenos Aires, Argentina",
      destino: "Salta, Argentina",
      transporte: "Transportes del Norte",
      chofer: "Pedro Sánchez",
      ubicacion: "Tucumán, Argentina",
      ultimaActualizacion: "Hace 3 horas",
      progreso: "50%",
      estado: "En tránsito",
    },
    {
      id: "TRK-1005",
      carga: "CRG-1007",
      origen: "Mendoza, Argentina",
      destino: "Santiago, Chile",
      transporte: "Transportes Andinos",
      chofer: "Ana Martínez",
      ubicacion: "Los Andes, Chile",
      ultimaActualizacion: "Hace 1 hora",
      progreso: "90%",
      estado: "En aduana",
    },
  ])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Carga</TableHead>
          <TableHead>Origen - Destino</TableHead>
          <TableHead>Transporte</TableHead>
          <TableHead>Chofer</TableHead>
          <TableHead>Ubicación Actual</TableHead>
          <TableHead>Progreso</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trackings.map((tracking) => (
          <TableRow key={tracking.id}>
            <TableCell className="font-medium">{tracking.id}</TableCell>
            <TableCell>{tracking.carga}</TableCell>
            <TableCell>
              {tracking.origen} - {tracking.destino}
            </TableCell>
            <TableCell>{tracking.transporte}</TableCell>
            <TableCell>{tracking.chofer}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                {tracking.ubicacion}
              </div>
              <div className="text-xs text-muted-foreground">{tracking.ultimaActualizacion}</div>
            </TableCell>
            <TableCell>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-[#00334a] h-2.5 rounded-full" style={{ width: tracking.progreso }}></div>
              </div>
              <div className="text-xs text-right mt-1">{tracking.progreso}</div>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  tracking.estado === "En tránsito"
                    ? "status-en-transito"
                    : tracking.estado === "En aduana"
                      ? "status-en-aduana"
                      : "status-pendiente"
                }
              >
                {tracking.estado}
              </Badge>
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
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Contactar chofer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Ver documentación
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
