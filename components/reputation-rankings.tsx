"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReputationRankings() {
  const [transportRankings] = useState([
    {
      posicion: 1,
      nombre: "Transportes Rápidos S.A.",
      valoracion: 4.8,
      opiniones: 245,
      puntualidad: "98%",
      comunicacion: "95%",
      cuidado: "97%",
    },
    {
      posicion: 2,
      nombre: "Transportes del Norte",
      valoracion: 4.7,
      opiniones: 187,
      puntualidad: "96%",
      comunicacion: "94%",
      cuidado: "95%",
    },
    {
      posicion: 3,
      nombre: "Logística del Sur",
      valoracion: 4.6,
      opiniones: 203,
      puntualidad: "94%",
      comunicacion: "92%",
      cuidado: "96%",
    },
    {
      posicion: 4,
      nombre: "Transportes Andinos",
      valoracion: 4.3,
      opiniones: 178,
      puntualidad: "90%",
      comunicacion: "88%",
      cuidado: "92%",
    },
    {
      posicion: 5,
      nombre: "Cargas Express",
      valoracion: 4.1,
      opiniones: 156,
      puntualidad: "87%",
      comunicacion: "85%",
      cuidado: "89%",
    },
  ])

  const [driverRankings] = useState([
    {
      posicion: 1,
      nombre: "Juan Pérez",
      empresa: "Transportes Rápidos S.A.",
      valoracion: 4.9,
      opiniones: 132,
      puntualidad: "99%",
      comunicacion: "98%",
      conduccion: "97%",
    },
    {
      posicion: 2,
      nombre: "Pedro Sánchez",
      empresa: "Transportes del Norte",
      valoracion: 4.8,
      opiniones: 118,
      puntualidad: "97%",
      comunicacion: "95%",
      conduccion: "98%",
    },
    {
      posicion: 3,
      nombre: "María González",
      empresa: "Logística del Sur",
      valoracion: 4.7,
      opiniones: 105,
      puntualidad: "96%",
      comunicacion: "97%",
      conduccion: "94%",
    },
    {
      posicion: 4,
      nombre: "Carlos Rodríguez",
      empresa: "Transportes Andinos",
      valoracion: 4.6,
      opiniones: 98,
      puntualidad: "95%",
      comunicacion: "93%",
      conduccion: "96%",
    },
    {
      posicion: 5,
      nombre: "Ana Martínez",
      empresa: "Cargas Express",
      valoracion: 4.5,
      opiniones: 87,
      puntualidad: "94%",
      comunicacion: "96%",
      conduccion: "92%",
    },
  ])

  return (
    <Tabs defaultValue="transportes">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="transportes">Transportes</TabsTrigger>
        <TabsTrigger value="choferes">Choferes</TabsTrigger>
      </TabsList>
      <TabsContent value="transportes" className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posición</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Opiniones</TableHead>
              <TableHead>Puntualidad</TableHead>
              <TableHead>Comunicación</TableHead>
              <TableHead>Cuidado de Carga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportRankings.map((transport) => (
              <TableRow key={transport.posicion}>
                <TableCell className="font-medium">{transport.posicion}</TableCell>
                <TableCell>{transport.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{transport.valoracion}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(transport.valoracion) ? "text-yellow-500" : "text-gray-300"
                          }`}
                          fill={i < Math.floor(transport.valoracion) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{transport.opiniones}</TableCell>
                <TableCell>{transport.puntualidad}</TableCell>
                <TableCell>{transport.comunicacion}</TableCell>
                <TableCell>{transport.cuidado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="choferes" className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posición</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Opiniones</TableHead>
              <TableHead>Puntualidad</TableHead>
              <TableHead>Comunicación</TableHead>
              <TableHead>Conducción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverRankings.map((driver) => (
              <TableRow key={driver.posicion}>
                <TableCell className="font-medium">{driver.posicion}</TableCell>
                <TableCell>{driver.nombre}</TableCell>
                <TableCell>{driver.empresa}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{driver.valoracion}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(driver.valoracion) ? "text-yellow-500" : "text-gray-300"
                          }`}
                          fill={i < Math.floor(driver.valoracion) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{driver.opiniones}</TableCell>
                <TableCell>{driver.puntualidad}</TableCell>
                <TableCell>{driver.comunicacion}</TableCell>
                <TableCell>{driver.conduccion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
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
