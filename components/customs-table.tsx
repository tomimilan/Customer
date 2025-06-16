"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SortableHeader } from "@/components/ui/sortable-header"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Anchor,
  Hash,
  MapPin,
  Building2,
  Globe,
  Navigation,
  CheckCircle,
  Pencil,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Custom {
  id: number
  name: string
  address: string
  country: string
  province: string
  city: string
  latitude: string
  longitude: string
  status: "activo" | "inactivo"
}

const mockCustoms: Custom[] = [
  {
    id: 1,
    name: "Aduana Buenos Aires",
    address: "Av. Antártida Argentina 355",
    country: "Argentina",
    province: "Buenos Aires",
    city: "Buenos Aires",
    latitude: "-34.6118",
    longitude: "-58.3960",
    status: "activo",
  },
  {
    id: 2,
    name: "Aduana Santos",
    address: "Av. Conselheiro Nébias, 1000",
    country: "Brasil",
    province: "São Paulo",
    city: "Santos",
    latitude: "-23.9608",
    longitude: "-46.3331",
    status: "activo",
  },
]

const countries = ["Argentina", "Brasil", "Chile", "Uruguay", "Paraguay"]
const provinces: Record<string, string[]> = {
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe"],
  Brasil: ["São Paulo", "Rio de Janeiro", "Minas Gerais"],
  Chile: ["Santiago", "Valparaíso", "Concepción"],
  Uruguay: ["Montevideo", "Canelones", "Maldonado"],
}
const cities: Record<string, string[]> = {
  "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata"],
  "Córdoba": ["Córdoba", "Río Cuarto", "Villa María"],
  "Santa Fe": ["Santa Fe", "Rosario", "Rafaela"],
  "São Paulo": ["São Paulo", "Santos", "Campinas"],
  "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Nova Iguaçu"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem"],
  "Santiago": ["Santiago", "Puente Alto", "Maipú"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Concepción": ["Concepción", "Talcahuano", "Chillán"],
  "Montevideo": ["Montevideo", "Salto", "Paysandú"],
  "Canelones": ["Canelones", "Las Piedras", "Pando"],
  "Maldonado": ["Maldonado", "Punta del Este", "San Carlos"],
}

interface CustomFormData {
  name: string
  address: string
  country: string
  province: string
  city: string
  latitude: string
  longitude: string
  status: "activo" | "inactivo"
}

interface FormErrors {
  name?: string
  address?: string
  country?: string
  province?: string
  city?: string
  latitude?: string
  longitude?: string
}

const initialFormData: CustomFormData = {
  name: "",
  address: "",
  country: "",
  province: "",
  city: "",
  latitude: "",
  longitude: "",
  status: "activo",
}

export function CustomsTable() {
  const [customs, setCustoms] = useState<Custom[]>([
    {
      id: 1,
      name: "Aduana Buenos Aires",
      address: "Av. Antártida Argentina 2000",
      country: "Argentina",
      province: "Buenos Aires",
      city: "Buenos Aires",
      latitude: "-34.6118",
      longitude: "-58.3960",
      status: "activo",
    },
    {
      id: 2,
      name: "Aduana Santos",
      address: "Av. Conselheiro Nébias, 1000",
      country: "Brasil",
      province: "São Paulo",
      city: "Santos",
      latitude: "-23.9608",
      longitude: "-46.3339",
      status: "activo",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isNewCustomOpen, setIsNewCustomOpen] = useState(false)
  const [isEditCustomOpen, setIsEditCustomOpen] = useState(false)
  const [formData, setFormData] = useState<CustomFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingCustom, setEditingCustom] = useState<Custom | null>(null)
  const { toast } = useToast()

  const filteredCustoms = customs.filter(
    (custom) =>
      custom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custom.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custom.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedCustoms = [...filteredCustoms].sort((a, b) => {
    const aValue = a[sortField as keyof Custom]
    const bValue = b[sortField as keyof Custom]
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

  const handleInputChange = (field: keyof CustomFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida"
    }

    if (!formData.country) {
      newErrors.country = "El país es requerido"
    }

    if (!formData.province) {
      newErrors.province = "La provincia es requerida"
    }

    if (!formData.city) {
      newErrors.city = "La ciudad es requerida"
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = "La latitud es requerida"
    } else if (!/^-?\d+(\.\d+)?$/.test(formData.latitude)) {
      newErrors.latitude = "La latitud debe ser un número válido"
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = "La longitud es requerida"
    } else if (!/^-?\d+(\.\d+)?$/.test(formData.longitude)) {
      newErrors.longitude = "La longitud debe ser un número válido"
    }

    // Validar duplicados
    const isDuplicate = customs.some(
      (custom) => custom.id !== editingCustom?.id && custom.name.toLowerCase() === formData.name.toLowerCase(),
    )

    if (isDuplicate) {
      newErrors.name = "Ya existe una aduana con este nombre"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGetCoordinates = () => {
    if (!formData.address || !formData.city || !formData.country) {
      setErrors({
        ...errors,
        address: !formData.address ? "Ingresa la dirección primero" : "",
        city: !formData.city ? "Selecciona la ciudad primero" : "",
        country: !formData.country ? "Selecciona el país primero" : "",
      })
      return
    }

    // Geocodificación simulada más inteligente
    const geocodeAddress = () => {
      const address = formData.address.toLowerCase()
      const city = formData.city.toLowerCase()
      const country = formData.country.toLowerCase()

      // Base de coordenadas por país y ciudad
      const locationDB = {
        argentina: {
          "buenos aires": { lat: -34.6118, lng: -58.396 },
          córdoba: { lat: -31.4201, lng: -64.1888 },
          rosario: { lat: -32.9442, lng: -60.6505 },
        },
        brasil: {
          santos: { lat: -23.9608, lng: -46.3331 },
          "são paulo": { lat: -23.5505, lng: -46.6333 },
          "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
        },
        chile: {
          santiago: { lat: -33.4489, lng: -70.6693 },
          valparaíso: { lat: -33.0472, lng: -71.6127 },
        },
        uruguay: {
          montevideo: { lat: -34.9011, lng: -56.1645 },
        },
      }

      // Obtener coordenadas base
      const countryData = locationDB[country as keyof typeof locationDB]
      let baseCoords = { lat: -25.0, lng: -60.0 } // Default Sudamérica

      if (countryData) {
        const cityCoords = countryData[city as keyof typeof countryData]
        if (cityCoords) {
          baseCoords = cityCoords
        }
      }

      // Ajustar según elementos de la dirección
      let latOffset = 0
      let lngOffset = 0
      let variation = 0.01

      // Analizar la dirección para mayor precisión
      if (address.includes("puerto") || address.includes("port")) {
        latOffset = 0.005
        variation = 0.008
      } else if (address.includes("aeropuerto") || address.includes("airport")) {
        latOffset = -0.02
        lngOffset = 0.015
        variation = 0.015
      } else if (address.includes("centro") || address.includes("center")) {
        variation = 0.005
      } else if (address.includes("industrial") || address.includes("zona franca")) {
        latOffset = -0.01
        lngOffset = 0.01
        variation = 0.012
      }

      // Calcular coordenadas finales
      const finalLat = baseCoords.lat + latOffset + (Math.random() - 0.5) * variation
      const finalLng = baseCoords.lng + lngOffset + (Math.random() - 0.5) * variation

      return {
        lat: Number(finalLat.toFixed(6)),
        lng: Number(finalLng.toFixed(6)),
      }
    }

    const coords = geocodeAddress()

    setFormData((prev) => ({
      ...prev,
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
    }))
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingCustom) {
      setCustoms((prev) =>
        prev.map((custom) =>
          custom.id === editingCustom.id
            ? {
                ...custom,
                name: formData.name,
                address: formData.address,
                country: formData.country,
                province: formData.province,
                city: formData.city,
                latitude: formData.latitude,
                longitude: formData.longitude,
                status: formData.status,
              }
            : custom,
        ),
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Aduana actualizada exitosamente
          </div>
        ),
      })
    } else {
      const newCustom: Custom = {
        id: Math.max(...customs.map((c) => c.id), 0) + 1,
        name: formData.name,
        address: formData.address,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        status: formData.status,
      }
      setCustoms((prev) => [...prev, newCustom])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Aduana creada exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setIsNewCustomOpen(false)
    setIsEditCustomOpen(false)
    setFormData(initialFormData)
    setErrors({})
    setEditingCustom(null)
  }

  const handleEdit = (custom: Custom) => {
    setEditingCustom(custom)
    setFormData({
      name: custom.name,
      address: custom.address,
      country: custom.country,
      province: custom.province,
      city: custom.city,
      latitude: custom.latitude.toString(),
      longitude: custom.longitude.toString(),
      status: custom.status,
    })
    setIsEditCustomOpen(true)
  }

  const handleDeleteCustom = (id: number) => {
    setCustoms(customs.map((c) => (c.id === id ? { ...c, status: "inactivo" } : c)))
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Aduana dada de baja exitosamente
        </div>
      ),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aduanas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[300px]"
          />
        </div>
        <Button onClick={() => setIsNewCustomOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Aduana
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="name"
                label="Nombre"
                icon={Anchor}
                sortKey="name"
                currentSort={sortField}
                direction={sortField === "name" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="country"
                label="País"
                icon={Globe}
                sortKey="country"
                currentSort={sortField}
                direction={sortField === "country" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="province"
                label="Provincia"
                icon={MapPin}
                sortKey="province"
                currentSort={sortField}
                direction={sortField === "province" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="city"
                label="Ciudad"
                icon={Building2}
                sortKey="city"
                currentSort={sortField}
                direction={sortField === "city" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="address"
                label="Dirección"
                icon={Navigation}
                sortKey="address"
                currentSort={sortField}
                direction={sortField === "address" ? sortDirection : null}
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
            {sortedCustoms.map((custom) => (
              <TableRow key={custom.id}>
                <TableCell className="text-center">{custom.name}</TableCell>
                <TableCell className="text-center">{custom.country}</TableCell>
                <TableCell className="text-center">{custom.province}</TableCell>
                <TableCell className="text-center">{custom.city}</TableCell>
                <TableCell className="text-center">{custom.address}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      custom.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {custom.status === "activo" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem onClick={() => handleEdit(custom)}>
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
                              Esta acción dará de baja a la aduana <strong>{custom.name}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCustom(custom.id)}>
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

      <Dialog open={isNewCustomOpen || isEditCustomOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCustom ? "Editar Aduana" : "Nueva Aduana"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
              <div className="space-y-4">
                  <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                    <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                    />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                    <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange("country", value)}
                    >
                    <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Provincia *</Label>
                    <Select
                    value={formData.province}
                    onValueChange={(value) => handleInputChange("province", value)}
                    >
                    <SelectTrigger className={errors.province ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecciona una provincia" />
                      </SelectTrigger>
                      <SelectContent>
                      {provinces[formData.country as keyof typeof provinces]?.map((province: string) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
                  </div>

                  <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                    <Select
                    value={formData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                    >
                    <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecciona una ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                      {cities[formData.province as keyof typeof cities]?.map((city: string) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                  </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="latitude">Latitud *</Label>
                    <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    placeholder="-34.6118"
                    className={errors.latitude ? "border-red-500" : ""}
                    />
                  {errors.latitude && <p className="text-sm text-red-500">{errors.latitude}</p>}
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="longitude">Longitud *</Label>
                    <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    placeholder="-58.3960"
                    className={errors.longitude ? "border-red-500" : ""}
                    />
                  {errors.longitude && <p className="text-sm text-red-500">{errors.longitude}</p>}
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGetCoordinates} 
                    className="w-full"
                    disabled={!formData.address}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Obtener coordenadas
                  </Button>
                  </div>
                </div>

              {formData.latitude && formData.longitude && (
                  <div className="space-y-2">
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

              {editingCustom && (
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "activo" | "inactivo") => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>{editingCustom ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
