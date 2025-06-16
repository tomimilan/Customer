"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardsTable } from "@/components/cards-table"
import { CardsDocuments } from "@/components/cards-documents"
import { Package, FileText, Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function CardsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [typeFilter, setTypeFilter] = useState("todos")

  const handleNuevaCarga = () => {
    router.push("/modules/cargas/nueva-carga")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Cargas</h1>
          </div>
          <p className="text-muted-foreground">
            Administre las cargas, sus características y estados en el sistema logístico
          </p>
        </div>
      </div>

      <Tabs defaultValue="cargas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cargas" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Cargas
          </TabsTrigger>
          <TabsTrigger value="instructivos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Instructivos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cargas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Cargas</CardTitle>
                  <CardDescription>Administre todas las cargas del sistema logístico</CardDescription>
                </div>
                <Button className="bg-[#00334a] hover:bg-[#004a6b]" onClick={handleNuevaCarga}>
                  Nueva Carga
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar cargas..."
                      className="pl-10 bg-white border-gray-200 h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-white h-9 border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Estados" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="en-transito">En tránsito</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                    <SelectItem value="en-aduana">En aduana</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36 bg-white h-9 border-gray-200">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Tipos" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="exportacion-portuaria">Exportación Portuaria</SelectItem>
                    <SelectItem value="exportacion-terrestre">Exportación Terrestre</SelectItem>
                    <SelectItem value="importacion-portuaria">Importación Portuaria</SelectItem>
                    <SelectItem value="importacion-terrestre">Importación Terrestre</SelectItem>
                    <SelectItem value="puesta-fob">Puesta FOB</SelectItem>
                    <SelectItem value="carga-nacional">Carga Nacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardsTable searchTerm={searchTerm} statusFilter={statusFilter} typeFilter={typeFilter} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="instructivos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructivos de Cargas</CardTitle>
              <CardDescription>Gestión de instructivos asociados a las cargas</CardDescription>
            </CardHeader>
            <CardContent>
              <CardsDocuments />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
