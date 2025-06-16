"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Target, MapPin, Type, FileText, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InterestPoint {
  id: string
  name: string
  type: string
  latitude: number
  longitude: number
  description: string
  status: "active" | "inactive"
  createdAt: string
}

interface ValidationErrors {
  name?: string
  type?: string
  latitude?: string
  longitude?: string
  description?: string
}

const POINT_TYPES = [
  {
    value: "punto",
    label: "De punto",
    description: "1000 Metros - Cuando entra y cuando sale",
  },
  {
    value: "proceso",
    label: "De proceso",
    description: "5000 Metros - Solo cuando entra",
  },
]

export function InterestPointsTable() {
  const [interestPoints, setInterestPoints] = useState<InterestPoint[]>([
    {
      id: "1",
      name: "Puerto de Buenos Aires",
      type: "punto",
      latitude: -34.6118,
      longitude: -58.396,
      description: "Principal puerto de la ciudad de Buenos Aires",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Centro de Distribución Norte",
      type: "proceso",
      latitude: -34.55,
      longitude: -58.45,
      description: "Centro de distribución para la zona norte",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Zona de Control Autopista",
      type: "punto",
      latitude: -34.6,
      longitude: -58.4,
      description: "Punto de control en autopista",
      status: "inactive",
      createdAt: "2024-01-25",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPoint, setEditingPoint] = useState<InterestPoint | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    latitude: "",
    longitude: "",
    description: "",
    status: "active" as "active" | "inactive",
  })

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (
      interestPoints.some(
        (point) => point.name.toLowerCase() === formData.name.toLowerCase() && point.id !== editingPoint?.id,
      )
    ) {
      newErrors.name = "Ya existe un punto de interés con este nombre"
    }

    if (!formData.type) {
      newErrors.type = "El tipo es requerido"
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = "La latitud es requerida"
    } else {
      const lat = Number.parseFloat(formData.latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = "La latitud debe estar entre -90 y 90"
      }
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = "La longitud es requerida"
    } else {
      const lng = Number.parseFloat(formData.longitude)
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = "La longitud debe estar entre -180 y 180"
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      latitude: "",
      longitude: "",
      description: "",
      status: "active",
    })
    setErrors({})
  }

  const handleAdd = () => {
    if (!validateForm()) return

    const newPoint: InterestPoint = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      latitude: Number.parseFloat(formData.latitude),
      longitude: Number.parseFloat(formData.longitude),
      description: formData.description,
      status: formData.status,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setInterestPoints([...interestPoints, newPoint])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Punto de interés creado exitosamente
        </div>
      ),
    })
  }

  const handleEdit = (point: InterestPoint) => {
    setEditingPoint(point)
    setFormData({
      name: point.name,
      type: point.type,
      latitude: point.latitude.toString(),
      longitude: point.longitude.toString(),
      description: point.description,
      status: point.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!validateForm()) return

    setInterestPoints(
      interestPoints.map((point) =>
        point.id === editingPoint?.id
          ? {
              ...point,
              name: formData.name,
              type: formData.type,
              latitude: Number.parseFloat(formData.latitude),
              longitude: Number.parseFloat(formData.longitude),
              description: formData.description,
              status: formData.status,
            }
          : point,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingPoint(null)
    resetForm()
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Punto de interés actualizado exitosamente
        </div>
      ),
    })
  }

  const handleDelete = (id: string) => {
    setInterestPoints(interestPoints.map((point) => (point.id === id ? { ...point, status: "inactive" } : point)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Punto de interés dado de baja exitosamente
        </div>
      ),
    })
  }

  const getTypeLabel = (type: string) => {
    const pointType = POINT_TYPES.find((t) => t.value === type)
    return pointType ? `${pointType.label} (${pointType.description})` : type
  }

  const filteredPoints = interestPoints.filter(
    (point) =>
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTypeLabel(point.type).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedPoints = [...filteredPoints].sort((a, b) => {
    const aValue = a[sortField as keyof InterestPoint]
    const bValue = b[sortField as keyof InterestPoint]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDialogClose = (isOpen: boolean, isEdit = false) => {
    if (!isOpen) {
      resetForm()
      if (isEdit) {
        setEditingPoint(null)
      }
    }
    if (isEdit) {
      setIsEditDialogOpen(isOpen)
    } else {
      setIsAddDialogOpen(isOpen)
    }
  }

  const getTypeLabelShort = (type: string) => {
    return POINT_TYPES.find((t) => t.value === type)?.label || type
  }

  const handleGetCoordinates = () => {
    if (!formData.name) {
      setErrors({ ...errors, name: "Ingresa el nombre primero para obtener coordenadas" })
      return
    }

    // Geocodificación simulada más inteligente
    const geocodeAddress = () => {
      const name = formData.name.toLowerCase()

      // Base de coordenadas por tipo de punto de interés
      const locationTypes = {
        puerto: [
          { name: "Puerto Buenos Aires", lat: -34.6118, lng: -58.396 },
          { name: "Puerto Santos", lat: -23.9608, lng: -46.3331 },
          { name: "Puerto Valparaíso", lat: -33.0472, lng: -71.6127 },
        ],
        aeropuerto: [
          { name: "Aeropuerto Ezeiza", lat: -34.8222, lng: -58.5358 },
          { name: "Aeropuerto Guarulhos", lat: -23.4356, lng: -46.4731 },
          { name: "Aeropuerto Santiago", lat: -33.393, lng: -70.7858 },
        ],
        centro: [
          { name: "Centro Buenos Aires", lat: -34.6037, lng: -58.3816 },
          { name: "Centro São Paulo", lat: -23.5505, lng: -46.6333 },
          { name: "Centro Santiago", lat: -33.4489, lng: -70.6693 },
        ],
        autopista: [
          { name: "Autopista Panamericana", lat: -34.55, lng: -58.45 },
          { name: "Autopista Bandeirantes", lat: -23.2, lng: -46.8 },
        ],
        deposito: [
          { name: "Zona Industrial", lat: -34.65, lng: -58.5 },
          { name: "Parque Industrial", lat: -23.6, lng: -46.7 },
        ],
        distribucion: [
          { name: "Centro Distribución Norte", lat: -34.55, lng: -58.45 },
          { name: "Centro Distribución Sur", lat: -34.65, lng: -58.37 },
        ],
        control: [
          { name: "Punto Control Autopista", lat: -34.6, lng: -58.4 },
          { name: "Zona Control Acceso", lat: -34.58, lng: -58.42 },
        ],
      }

      // Analizar el nombre para determinar el tipo de ubicación
      let selectedLocation = null

      for (const [type, locations] of Object.entries(locationTypes)) {
        if (name.includes(type)) {
          selectedLocation = locations[Math.floor(Math.random() * locations.length)]
          break
        }
      }

      // Si no encuentra un tipo específico, usar ubicación por defecto
      if (!selectedLocation) {
        selectedLocation = { lat: -34.6, lng: -58.4 } // Buenos Aires por defecto
      }

      // Agregar variación aleatoria pequeña
      const variation = 0.02
      const lat = selectedLocation.lat + (Math.random() - 0.5) * variation
      const lng = selectedLocation.lng + (Math.random() - 0.5) * variation

      return {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      }
    }

    const coords = geocodeAddress()

    setFormData({
      ...formData,
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar puntos de interés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Punto de Interés
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Agregar Punto de Interés
              </DialogTitle>
              <DialogDescription>Completa la información del nuevo punto de interés.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid gap-3 py-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (errors.name) setErrors({ ...errors, name: undefined })
                      }}
                      className={cn(errors.name && "border-red-500")}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => {
                        setFormData({ ...formData, type: value })
                        if (errors.type) setErrors({ ...errors, type: undefined })
                      }}
                    >
                      <SelectTrigger className={cn(errors.type && "border-red-500")}>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {POINT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.type && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {POINT_TYPES.find((t) => t.value === formData.type)?.description}
                      </p>
                    )}
                    {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="latitude">Latitud *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="-34.6118"
                      value={formData.latitude}
                      onChange={(e) => {
                        setFormData({ ...formData, latitude: e.target.value })
                        if (errors.latitude) setErrors({ ...errors, latitude: undefined })
                      }}
                      className={cn(errors.latitude && "border-red-500")}
                    />
                    {errors.latitude && <p className="text-xs text-red-500">{errors.latitude}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="longitude">Longitud *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="-58.3960"
                      value={formData.longitude}
                      onChange={(e) => {
                        setFormData({ ...formData, longitude: e.target.value })
                        if (errors.longitude) setErrors({ ...errors, longitude: undefined })
                      }}
                      className={cn(errors.longitude && "border-red-500")}
                    />
                    {errors.longitude && <p className="text-xs text-red-500">{errors.longitude}</p>}
                  </div>
                </div>
                {formData.latitude && formData.longitude && (
                  <div className="space-y-1 mt-2">
                    <Label>Vista previa del mapa</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/view?key=demo&center=${formData.latitude},${formData.longitude}&zoom=15`}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación en el mapa"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del punto de interés"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value })
                      if (errors.description) setErrors({ ...errors, description: undefined })
                    }}
                    className={cn(errors.description && "border-red-500")}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleDialogClose(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Agregar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border w-full overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="name"
                label="Nombre"
                icon={Target}
                sortKey="name"
                currentSort={sortField}
                direction={sortField === "name" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="type"
                label="Tipo"
                icon={Type}
                sortKey="type"
                currentSort={sortField}
                direction={sortField === "type" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="coordinates"
                label="Coordenadas"
                icon={MapPin}
                sortKey="latitude"
                currentSort={sortField}
                direction={sortField === "latitude" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="description"
                label="Descripción"
                icon={FileText}
                sortKey="description"
                currentSort={sortField}
                direction={sortField === "description" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="status"
                label="Estado"
                icon={CheckCircle}
                sortKey="status"
                currentSort={sortField}
                direction={sortField === "status" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell className="text-center">{point.name}</TableCell>
                <TableCell className="text-center">{point.type}</TableCell>
                <TableCell className="text-center">
                  {point.latitude}, {point.longitude}
                </TableCell>
                <TableCell className="text-center">{point.description}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      point.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {point.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(point)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Dar de Baja
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción dará de baja al punto de interés <strong>{point.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(point.id)}>
                              Dar de Baja
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => handleDialogClose(open, true)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Editar Punto de Interés
            </DialogTitle>
            <DialogDescription>Modifica la información del punto de interés.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-3 py-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-name">Nombre *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={cn(errors.name && "border-red-500")}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData({ ...formData, type: value })
                      if (errors.type) setErrors({ ...errors, type: undefined })
                    }}
                  >
                    <SelectTrigger className={cn(errors.type && "border-red-500")}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {POINT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.type && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {POINT_TYPES.find((t) => t.value === formData.type)?.description}
                    </p>
                  )}
                  {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-latitude">Latitud *</Label>
                  <Input
                    id="edit-latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => {
                      setFormData({ ...formData, latitude: e.target.value })
                      if (errors.latitude) setErrors({ ...errors, latitude: undefined })
                    }}
                    className={cn(errors.latitude && "border-red-500")}
                  />
                  {errors.latitude && <p className="text-xs text-red-500">{errors.latitude}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-longitude">Longitud *</Label>
                  <Input
                    id="edit-longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => {
                      setFormData({ ...formData, longitude: e.target.value })
                      if (errors.longitude) setErrors({ ...errors, longitude: undefined })
                    }}
                    className={cn(errors.longitude && "border-red-500")}
                  />
                  {errors.longitude && <p className="text-xs text-red-500">{errors.longitude}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-description">Descripción *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    if (errors.description) setErrors({ ...errors, description: undefined })
                  }}
                  className={cn(errors.description && "border-red-500")}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false, true)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
