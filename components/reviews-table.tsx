"use client"

import type React from "react"

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
import { Eye, MessageSquare, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react"

export function ReviewsTable() {
  const [reviews] = useState([
    {
      id: "REV-1001",
      cliente: "Importadora Andina S.A.",
      transporte: "Transportes Rápidos S.A.",
      chofer: "Juan Pérez",
      carga: "CRG-1001",
      valoracion: 5,
      comentario: "Excelente servicio, entrega puntual y cuidado de la mercadería.",
      fecha: "12/07/2023",
      estado: "Publicada",
    },
    {
      id: "REV-1002",
      cliente: "Distribuidora Central",
      transporte: "Logística del Sur",
      chofer: "María González",
      carga: "CRG-1002",
      valoracion: 4,
      comentario: "Buen servicio en general, pequeño retraso en la entrega.",
      fecha: "11/07/2023",
      estado: "Publicada",
    },
    {
      id: "REV-1003",
      cliente: "Exportadora del Plata",
      transporte: "Transportes Andinos",
      chofer: "Carlos Rodríguez",
      carga: "CRG-1004",
      valoracion: 3,
      comentario: "Demoras en aduana, pero buena comunicación durante el proceso.",
      fecha: "10/07/2023",
      estado: "Publicada",
    },
    {
      id: "REV-1004",
      cliente: "Agroindustrias del Centro",
      transporte: "Transportes del Norte",
      chofer: "Pedro Sánchez",
      carga: "CRG-1005",
      valoracion: 5,
      comentario: "Servicio impecable, muy profesionales y puntuales.",
      fecha: "09/07/2023",
      estado: "Publicada",
    },
    {
      id: "REV-1005",
      cliente: "Viñedos Argentinos",
      transporte: "Cargas Express",
      chofer: "Ana Martínez",
      carga: "CRG-1003",
      valoracion: 2,
      comentario: "Problemas con la documentación y retrasos significativos.",
      fecha: "08/07/2023",
      estado: "En revisión",
    },
  ])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Transporte</TableHead>
          <TableHead>Chofer</TableHead>
          <TableHead>Valoración</TableHead>
          <TableHead>Comentario</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="font-medium">{review.id}</TableCell>
            <TableCell>{review.cliente}</TableCell>
            <TableCell>{review.transporte}</TableCell>
            <TableCell>{review.chofer}</TableCell>
            <TableCell>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.valoracion ? "text-yellow-500" : "text-gray-300"}`}
                    fill={i < review.valoracion ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">{review.comentario}</TableCell>
            <TableCell>{review.fecha}</TableCell>
            <TableCell>
              <Badge
                className={
                  review.estado === "Publicada"
                    ? "bg-green-500"
                    : review.estado === "En revisión"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              >
                {review.estado}
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
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Responder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Aprobar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Rechazar
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

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
