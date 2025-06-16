"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { TransportTable } from "@/components/transport-table"
import { DriversTable } from "@/components/drivers-table"
import { VehiclesTable } from "@/components/vehicles-table"
import { TrailersTable } from "@/components/trailers-table"
import { TransportStats } from "@/components/transport-stats"
import { Search, CheckCircle, Building, Truck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { NewTruckModal } from "@/components/new-truck-modal"
import { NewTrailerModal } from "@/components/new-trailer-modal"
import { NewDriverModal } from "@/components/new-driver-modal"

export default function TransportPage() {
  const [showNewTruckModal, setShowNewTruckModal] = useState(false)
  const [showNewTrailerModal, setShowNewTrailerModal] = useState(false)
  const [showNewDriverModal, setShowNewDriverModal] = useState(false)

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState("todos")
  const [vehicleCompanyFilter, setVehicleCompanyFilter] = useState("todas")
  const [driverStatusFilter, setDriverStatusFilter] = useState("todos")
  const [driverCompanyFilter, setDriverCompanyFilter] = useState("todas")
  const [trailerStatusFilter, setTrailerStatusFilter] = useState("todos")
  const [trailerCompanyFilter, setTrailerCompanyFilter] = useState("todas")

  // Estados para filtros de empresas
  const [empresaSearchTerm, setEmpresaSearchTerm] = useState("")
  const [empresaStatusFilter, setEmpresaStatusFilter] = useState("todos")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Flota</h1>
          </div>
          <p className="text-muted-foreground">Administre empresas de transporte, camiones, choferes y acoplados</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TransportStats />
      </div>

      <Tabs defaultValue="empresas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="camiones">Camiones</TabsTrigger>
          <TabsTrigger value="choferes">Choferes</TabsTrigger>
          <TabsTrigger value="acoplados">Acoplados</TabsTrigger>
        </TabsList>
        <TabsContent value="empresas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Empresas de Transporte</CardTitle>
                  <CardDescription>Listado de empresas de transporte registradas</CardDescription>
                </div>
                <Link href="/modules/flota/nueva-empresa">
                  <Button className="bg-[#00334a] hover:bg-[#004a6b]">Nueva Empresa</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar empresas..."
                      className="pl-10 h-9"
                      value={empresaSearchTerm}
                      onChange={(e) => setEmpresaSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={empresaStatusFilter} onValueChange={setEmpresaStatusFilter}>
                  <SelectTrigger className="w-36 h-9">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <TransportTable searchTerm={empresaSearchTerm} statusFilter={empresaStatusFilter} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="camiones" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Camiones</CardTitle>
                  <CardDescription>Listado de camiones registrados por empresa</CardDescription>
                </div>
                <Button className="bg-[#00334a] hover:bg-[#004a6b]" onClick={() => setShowNewTruckModal(true)}>
                  Nuevo Camión
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar camiones..."
                      className="pl-10 h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={vehicleStatusFilter} onValueChange={setVehicleStatusFilter}>
                  <SelectTrigger className="w-36 h-9">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="operativo">Operativo</SelectItem>
                    <SelectItem value="en-ruta">En Ruta</SelectItem>
                    <SelectItem value="en-mantenimiento">En Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={vehicleCompanyFilter} onValueChange={setVehicleCompanyFilter}>
                  <SelectTrigger className="w-48 h-9">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las empresas</SelectItem>
                    <SelectItem value="transportes-rapidos">Transportes Rápidos S.A.</SelectItem>
                    <SelectItem value="logistica-sur">Logística del Sur</SelectItem>
                    <SelectItem value="transportes-andinos">Transportes Andinos</SelectItem>
                    <SelectItem value="cargas-express">Cargas Express</SelectItem>
                    <SelectItem value="transportes-norte">Transportes del Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <VehiclesTable
                searchTerm={searchTerm}
                statusFilter={vehicleStatusFilter}
                companyFilter={vehicleCompanyFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="choferes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Choferes</CardTitle>
                  <CardDescription>Listado de choferes registrados por empresa</CardDescription>
                </div>
                <Button className="bg-[#00334a] hover:bg-[#004a6b]" onClick={() => setShowNewDriverModal(true)}>
                  Nuevo Chofer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar choferes..."
                      className="pl-10 h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={driverStatusFilter} onValueChange={setDriverStatusFilter}>
                  <SelectTrigger className="w-36 h-9">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="en-ruta">En Ruta</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={driverCompanyFilter} onValueChange={setDriverCompanyFilter}>
                  <SelectTrigger className="w-48 h-9">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las empresas</SelectItem>
                    <SelectItem value="transportes-rapidos">Transportes Rápidos S.A.</SelectItem>
                    <SelectItem value="logistica-sur">Logística del Sur</SelectItem>
                    <SelectItem value="transportes-andinos">Transportes Andinos</SelectItem>
                    <SelectItem value="cargas-express">Cargas Express</SelectItem>
                    <SelectItem value="transportes-norte">Transportes del Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DriversTable
                searchTerm={searchTerm}
                statusFilter={driverStatusFilter}
                companyFilter={driverCompanyFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="acoplados" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acoplados</CardTitle>
                  <CardDescription>Listado de acoplados registrados por empresa</CardDescription>
                </div>
                <Button className="bg-[#00334a] hover:bg-[#004a6b]" onClick={() => setShowNewTrailerModal(true)}>
                  Nuevo Acoplado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar acoplados..."
                      className="pl-10 h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={trailerStatusFilter} onValueChange={setTrailerStatusFilter}>
                  <SelectTrigger className="w-36 h-9">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={trailerCompanyFilter} onValueChange={setTrailerCompanyFilter}>
                  <SelectTrigger className="w-48 h-9">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las empresas</SelectItem>
                    <SelectItem value="transportes-rapidos">Transportes Rápidos S.A.</SelectItem>
                    <SelectItem value="logistica-sur">Logística del Sur</SelectItem>
                    <SelectItem value="transportes-andinos">Transportes Andinos</SelectItem>
                    <SelectItem value="cargas-express">Cargas Express</SelectItem>
                    <SelectItem value="transportes-norte">Transportes del Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <TrailersTable
                searchTerm={searchTerm}
                statusFilter={trailerStatusFilter}
                companyFilter={trailerCompanyFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <NewTruckModal open={showNewTruckModal} onOpenChange={setShowNewTruckModal} />
      <NewTrailerModal open={showNewTrailerModal} onOpenChange={setShowNewTrailerModal} />
      <NewDriverModal open={showNewDriverModal} onOpenChange={setShowNewDriverModal} />
    </div>
  )
}
