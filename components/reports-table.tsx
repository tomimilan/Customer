"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReportsTable() {
  const [reports] = useState([
    {
      id: "CRG-1001",
      origen: "Buenos Aires, Argentina",
      destino: "Santiago, Chile",
      cliente: "Importadora Andina S.A.",
      fechaCreacion: "12/07/2023",
      fechaEntrega: "18/07/2023",
      tiempoTransito: "6 días",
      estado: "Finalizada",
    },
    {
      id: "CRG-1002",
      origen: "Córdoba, Argentina",
      destino: "Rosario, Argentina",
      cliente: "Distribuidora Central",
      fechaCreacion: "13/07/2023",
      fechaEntrega: "16/07/2023",
      tiempoTransito: "3 días",
      estado: "Finalizada",
    },
    {
      id: "CRG-1003",
      origen: "Mendoza, Argentina",
      destino: "Buenos Aires, Argentina",
      cliente: "Viñedos Argentinos",
      fechaCreacion: "14/07/2023",
      fechaEntrega: "19/07/2023",
      tiempoTransito: "5 días",
      estado: "En tránsito",
    },
    {
      id: "CRG-1004",
      origen: "Buenos Aires, Argentina",
      destino: "Montevideo, Uruguay",
      cliente: "Exportadora del Plata",
      fechaCreacion: "10/07/2023",
      fechaEntrega: "15/07/2023",
      tiempoTransito: "5 días",
      estado: "Finalizada",
    },
    {
      id: "CRG-1005",
      origen: "Rosario, Argentina",
      destino: "Córdoba, Argentina",
      cliente: "Agroindustrias del Centro",
      fechaCreacion: "11/07/2023",
      fechaEntrega: "14/07/2023",
      tiempoTransito: "3 días",
      estado: "Finalizada",
    },
  ])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="fecha-desde">Desde</Label>
          <Input id="fecha-desde" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha-hasta">Hasta</Label>
          <Input id="fecha-hasta" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Select>
            <SelectTrigger id="cliente">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="importadora-andina">Importadora Andina S.A.</SelectItem>
              <SelectItem value="distribuidora-central">Distribuidora Central</SelectItem>
              <SelectItem value="vinedos-argentinos">Viñedos Argentinos</SelectItem>
              <SelectItem value="exportadora-plata">Exportadora del Plata</SelectItem>
              <SelectItem value="agroindustrias-centro">Agroindustrias del Centro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="en-transito">En tránsito</SelectItem>
              <SelectItem value="finalizada">Finalizada</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-[#00334a] hover:bg-[#004a6b]">Filtrar</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Origen - Destino</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Fecha Entrega</TableHead>
            <TableHead>Tiempo Tránsito</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>
                {report.origen} - {report.destino}
              </TableCell>
              <TableCell>{report.cliente}</TableCell>
              <TableCell>{report.fechaCreacion}</TableCell>
              <TableCell>{report.fechaEntrega}</TableCell>
              <TableCell>{report.tiempoTransito}</TableCell>
              <TableCell>
                <Badge
                  className={
                    report.estado === "Finalizada"
                      ? "bg-green-500"
                      : report.estado === "En tránsito"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }
                >
                  {report.estado}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
