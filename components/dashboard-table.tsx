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
import { Eye, MapPin, MoreHorizontal } from "lucide-react"

export function DashboardTable() {
  const [cargas] = useState([
    {
      id: "CRG-1001",
      origen: "Buenos Aires, Argentina",
      destino: "Santiago, Chile",
      cliente: "Importadora Andina S.A.",
      transporte: "Transportes Rápidos S.A.",
      chofer: "Juan Pérez",
      progreso: "65%",
      estado: "En tránsito",
    },
    {
      id: "CRG-1002",
      origen: "Córdoba, Argentina",
      destino: "Rosario, Argentina",
      cliente: "Distribuidora Central",
      transporte: "Logística del Sur",
      chofer: "María González",
      progreso: "40%",
      estado: "En tránsito",
    },
    {
      id: "CRG-1004",
      origen: "Buenos Aires, Argentina",
      destino: "Montevideo, Uruguay",
      cliente: "Exportadora del Plata",
      transporte: "Transportes Andinos",
      chofer: "Carlos Rodríguez",
      progreso: "80%",
      estado: "En aduana",
    },
    {
      id: "CRG-1006",
      origen: "Buenos Aires, Argentina",
      destino: "Salta, Argentina",
      cliente: "Agroindustrias del Centro",
      transporte: "Transportes del Norte",
      chofer: "Pedro Sánchez",
      progreso: "50%",
      estado: "En tránsito",
    },
  ])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Origen - Destino</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Transporte</TableHead>
          <TableHead>Progreso</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cargas.map((carga) => (
          <TableRow key={carga.id}>
            <TableCell className="font-medium">{carga.id}</TableCell>
            <TableCell>
              {carga.origen} - {carga.destino}
            </TableCell>
            <TableCell>{carga.cliente}</TableCell>
            <TableCell>{carga.transporte}</TableCell>
            <TableCell>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-[#00334a] h-2.5 rounded-full" style={{ width: carga.progreso }}></div>
              </div>
              <div className="text-xs text-right mt-1">{carga.progreso}</div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  carga.estado === "En tránsito"
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    : carga.estado === "En aduana"
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }
              >
                {carga.estado}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Actualizar estado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
