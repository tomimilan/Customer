"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Eye, MoreHorizontal, Pencil, Upload, Search, FileText, Clock, Truck } from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Hash, Package, Calendar, User, HardDrive } from "lucide-react"

export function CardsDocuments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("todos")
  const [estadoFilter, setEstadoFilter] = useState("todos")

  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc" | null
  }>({ key: "", direction: null })

  const [documents] = useState([
    {
      id: "DOC-1001",
      carga: "CRG-1001",
      tipo: "Carta de Porte",
      fechaCreacion: "12/07/2023",
      usuario: "Juan Pérez",
      tamaño: "1.2 MB",
      estado: "Aprobado",
    },
    {
      id: "DOC-1002",
      carga: "CRG-1001",
      tipo: "Manifiesto de Carga",
      fechaCreacion: "12/07/2023",
      usuario: "Juan Pérez",
      tamaño: "0.8 MB",
      estado: "Aprobado",
    },
    {
      id: "DOC-1003",
      carga: "CRG-1002",
      tipo: "Carta de Porte",
      fechaCreacion: "13/07/2023",
      usuario: "María González",
      tamaño: "1.1 MB",
      estado: "Pendiente",
    },
    {
      id: "DOC-1004",
      carga: "CRG-1003",
      tipo: "Certificado Sanitario",
      fechaCreacion: "14/07/2023",
      usuario: "Carlos Rodríguez",
      tamaño: "2.3 MB",
      estado: "Pendiente",
    },
    {
      id: "DOC-1005",
      carga: "CRG-1004",
      tipo: "Declaración Aduanera",
      fechaCreacion: "10/07/2023",
      usuario: "Ana Martínez",
      tamaño: "1.5 MB",
      estado: "Aprobado",
    },
  ])

  // Filtrar documentos
  const filteredDocuments = documents.filter((doc) => {
    // Filtro de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.carga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.usuario.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de tipo
    const matchesTipo = tipoFilter === "todos" || doc.tipo === tipoFilter

    // Filtro de estado
    const matchesEstado = estadoFilter === "todos" || doc.estado === estadoFilter

    return matchesSearch && matchesTipo && matchesEstado
  })

  // Estado para el instructivo seleccionado
  const [instructivoSeleccionado, setInstructivoSeleccionado] = useState<any | null>(null)

  // Si hay instructivo seleccionado, mostrar la vista de solo lectura
  if (instructivoSeleccionado) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-4">
          <img src="/aconcarga.png" alt="Logo Aconcarga" className="w-20 h-20 object-contain rounded bg-white" />
          <div>
            <div className="text-xl font-bold">ORDEN DE TRABAJO Nº</div>
            <div className="text-2xl font-extrabold text-primary">{instructivoSeleccionado.carga}</div>
            <div className="text-xs text-gray-500">NACIONAL</div>
          </div>
          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs text-center">Logo empresa a facturar</div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className="font-semibold">FACTURAR:</span>
          <span className="border rounded px-2 py-1 bg-gray-50">{instructivoSeleccionado.empresa || '-'}</span>
          {instructivoSeleccionado.cuit && (
            <span className="ml-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">CUIT: {instructivoSeleccionado.cuit}</span>
          )}
        </div>
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2 mt-4">INFORMACIÓN GENERAL</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">ID Instructivo:</div>
            <div className="font-bold">{instructivoSeleccionado.id}</div>
          </div>
          <div>
            <div className="text-gray-500">Viaje:</div>
            <div className="font-bold">{instructivoSeleccionado.viaje || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Tipo:</div>
            <div className="font-bold">{instructivoSeleccionado.tipo}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha:</div>
            <div className="font-bold">{instructivoSeleccionado.fechaCreacion}</div>
          </div>
        </div>
        {/* BLOQUE: PARTICIPANTES */}
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">PARTICIPANTES</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Shipper / Exportador:</div>
            <div className="font-bold">{instructivoSeleccionado.shipper || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Consignatario:</div>
            <div className="font-bold">{instructivoSeleccionado.consignatario || '-'}</div>
          </div>
        </div>
        {/* BLOQUE: INFORMACIÓN DE LA CARGA */}
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">INFORMACIÓN DE LA CARGA</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Tipo de Carga:</div>
            <div className="font-bold">{instructivoSeleccionado.tipoCarga || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Tipo de Contenedor:</div>
            <div className="font-bold">{instructivoSeleccionado.tipoContenedor || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Tarifa de Referencia:</div>
            <div className="font-bold">{instructivoSeleccionado.tarifaReferencia || '-'}</div>
          </div>
        </div>
        {/* BLOQUE: LUGARES Y FECHAS */}
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">LUGARES Y FECHAS</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Lugar de Carga:</div>
            <div className="font-bold">{instructivoSeleccionado.origen || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Lugar de Entrega:</div>
            <div className="font-bold">{instructivoSeleccionado.destino || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Lugar de Aduana Expo:</div>
            <div className="font-bold">{instructivoSeleccionado.lugarAduanaExpo || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Lugar de Aduana Impo:</div>
            <div className="font-bold">{instructivoSeleccionado.lugarAduanaImpo || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Destino Final:</div>
            <div className="font-bold">{instructivoSeleccionado.destinoFinal || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha de Carga:</div>
            <div className="font-bold">{instructivoSeleccionado.fechaCarga || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha de Entrega:</div>
            <div className="font-bold">{instructivoSeleccionado.fechaEntrega || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha de Descarga:</div>
            <div className="font-bold">{instructivoSeleccionado.fechaDescarga || '-'}</div>
          </div>
        </div>
        {/* BLOQUE: TARIFA Y OBSERVACIONES */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Tarifa:</div>
            <div className="font-bold">{instructivoSeleccionado.tarifa || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Observaciones de la tarifa:</div>
            <div className="font-bold">{instructivoSeleccionado.obsTarifa || '-'}</div>
          </div>
        </div>
        {/* BLOQUE: OBSERVACIONES GENERALES */}
        <div className="mb-4">
          <div className="text-gray-500">OBSERVACIONES:</div>
          <div className="font-bold">{instructivoSeleccionado.observaciones || '-'}</div>
        </div>
        <div className="text-center text-red-600 font-semibold text-sm mb-4">
          ENVIAR FACTURA DENTRO DE LOS 7 DÍAS DE HABER FINALIZADO EL SERVICIO.
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setInstructivoSeleccionado(null)}>Volver</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar instructivos..."
                className="pl-10 bg-white border-gray-200 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader label="ID" sortKey="id" icon={Hash} sortConfig={sortConfig} onSort={setSortConfig} className="text-center" />
            <SortableHeader label="Carga" sortKey="carga" icon={Package} sortConfig={sortConfig} onSort={setSortConfig} className="text-center" />
            <SortableHeader label="Viaje" sortKey="viaje" icon={Truck} sortConfig={sortConfig} onSort={setSortConfig} className="text-center" />
            <SortableHeader label="Fecha" sortKey="fechaCreacion" icon={Calendar} sortConfig={sortConfig} onSort={setSortConfig} className="text-center" />
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="text-center">{doc.id}</TableCell>
              <TableCell className="text-center">{doc.carga}</TableCell>
              <TableCell className="text-center">{doc.viaje || '-'}</TableCell>
              <TableCell className="text-center">{doc.fechaCreacion}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setInstructivoSeleccionado(doc)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver instructivo
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
