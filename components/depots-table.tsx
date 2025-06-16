"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Badge } from "@/components/ui/badge"
import { SortableHeader } from "@/components/ui/sortable-header"
import { Plus, Search, MapPin, MoreHorizontal, Building2, Hash, Globe, Building, CheckCircle, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Depot {
  id: number
  descripcion: string
  direccion: string
  pais: string
  provincia: string
  ciudad: string
  coordMaps?: string
  latitud: number
  longitud: number
  estado: "Activo" | "Inactivo"
  comentarios?: string
}

interface DepotFormData {
  descripcion: string
  direccion: string
  pais: string
  provincia: string
  ciudad: string
  coordMaps: string
  latitud: string
  longitud: string
  comentarios?: string
}

interface FormErrors {
  descripcion?: string
  direccion?: string
  pais?: string
  ciudad?: string
  latitud?: string
  longitud?: string
  provincia?: string
}

const initialFormData: DepotFormData = {
  descripcion: "",
  direccion: "",
  pais: "",
  provincia: "",
  ciudad: "",
  coordMaps: "",
  latitud: "",
  longitud: "",
}

const countries = [
  "Argentina",
  "Brasil",
  "Chile",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "Colombia",
  "Perú",
  "Ecuador",
  "Venezuela",
  "México",
  "Estados Unidos",
] as const;

type Country = typeof countries[number];

const provinces: Record<Country, string[]> = {
  "Argentina": ["Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Mendoza"],
  "Brasil": ["São Paulo", "Río de Janeiro", "Minas Gerais", "Bahía", "Paraná"],
  "Chile": ["Región Metropolitana de Santiago", "Valparaíso", "Biobío", "La Araucanía", "Los Lagos"],
  "Uruguay": ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú"],
  "Paraguay": ["Asunción", "Alto Paraguay", "Alto Paraná", "Amambay", "Boquerón"],
  "Bolivia": ["Santa Cruz", "La Paz", "Cochabamba", "Potosí", "Oruro"],
  "Colombia": ["Antioquia", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá"],
  "Perú": ["Lima", "Arequipa", "La Libertad", "Piura", "Lambayeque"],
  "Ecuador": ["Guayas", "Pichincha", "Azuay", "Manabí", "El Oro"],
  "Venezuela": ["Zulia", "Miranda", "Carabobo", "Distrito Capital", "Aragua"],
  "México": ["Ciudad de México", "Estado de México", "Jalisco", "Nuevo León", "Veracruz"],
  "Estados Unidos": ["California", "Texas", "Florida", "Nueva York", "Illinois"]
};

const cities: Record<string, string[]> = {
  "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes"],
  "CABA": ["Buenos Aires", "Palermo", "Recoleta", "San Telmo", "Puerto Madero"],
  "Córdoba": ["Córdoba", "Villa María", "Río Cuarto", "Alta Gracia", "Villa Carlos Paz"],
  "Santa Fe": ["Rosario", "Santa Fe", "Rafaela", "Venado Tuerto", "Santo Tomé"],
  "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Las Heras", "Luján de Cuyo"],
  "São Paulo": ["São Paulo", "Campinas", "Santos", "Guarulhos", "São Bernardo do Campo"],
  "Río de Janeiro": ["Río de Janeiro", "Niterói", "Nova Iguaçu", "São Gonçalo", "Duque de Caxias"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "Región Metropolitana de Santiago": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
  "Montevideo": ["Montevideo", "Punta del Este", "Piriápolis", "Atlántida", "Las Piedras"],
  "Canelones": ["Canelones", "Santa Lucía", "Las Piedras", "Pando", "Progreso"],
  "Maldonado": ["Maldonado", "Punta del Este", "San Carlos", "Piriápolis", "Pan de Azúcar"],
  "Salto": ["Salto", "Paysandú", "Artigas", "Rivera", "Tacuarembó"],
  "Paysandú": ["Paysandú", "Salto", "Artigas", "Rivera", "Tacuarembó"],
  "Rivera": ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales", "Lapuente"]
};

// Componente de mapa simulado
function SimulatedMap({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  // Convertir coordenadas a posición en el SVG (simulando proyección)
  const mapWidth = 600
  const mapHeight = 300

  // Normalizar coordenadas para Sudamérica aproximadamente
  const normalizedX = ((lng + 80) / 40) * mapWidth // -80 a -40 lng
  const normalizedY = ((lat + 60) / 40) * mapHeight // -60 a -20 lat

  // Asegurar que esté dentro del mapa
  const x = Math.max(20, Math.min(mapWidth - 20, normalizedX))
  const y = Math.max(20, Math.min(mapHeight - 20, normalizedY))

  return (
    <div className="border rounded-lg overflow-hidden bg-blue-50">
      <svg width="100%" height="300" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        {/* Fondo del mapa */}
        <rect width={mapWidth} height={mapHeight} fill="#e0f2fe" />

        {/* Simulación de continente */}
        <path d="M50,50 Q200,30 350,80 Q380,120 320,160 Q200,180 80,150 Q30,100 50,50" fill="#22c55e" opacity="0.3" />

        {/* Grid de referencia */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Marcador de ubicación */}
        <circle cx={x} cy={y} r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
        <circle cx={x} cy={y} r="4" fill="#fff" />

        {/* Etiqueta */}
        {title && (
          <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight="bold">
            {title}
          </text>
        )}

        {/* Coordenadas */}
        <text x={10} y={mapHeight - 10} fontSize="10" fill="#6b7280">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </text>
      </svg>
    </div>
  )
}

export function DepotsTable() {
  const [depots, setDepots] = useState<Depot[]>([
    {
      id: 1,
      descripcion: "Terminal Central",
      direccion: "Av. Principal 123",
      pais: "Argentina",
      provincia: "Buenos Aires",
      ciudad: "Buenos Aires",
      coordMaps: "-34.6118,-58.3960",
      latitud: -34.6118,
      longitud: -58.396,
      estado: "Activo"
    },
    {
      id: 2,
      descripcion: "Puerto Norte",
      direccion: "Dársena A - Muelle 5",
      pais: "Argentina",
      provincia: "Santa Fe",
      ciudad: "Rosario",
      coordMaps: "-32.9442, -60.6505",
      latitud: -32.9442,
      longitud: -60.6505,
      estado: "Activo"
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("descripcion")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepot, setEditingDepot] = useState<Depot | null>(null)
  const [formData, setFormData] = useState<DepotFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()

  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedProvince, setSelectedProvince] = useState<string>("")

  const filteredDepots = depots.filter((depot) => {
    const matchesSearch =
      depot.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depot.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depot.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depot.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depot.pais.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || depot.estado === statusFilter
    const matchesCountry = countryFilter === "all" || depot.pais === countryFilter

    return matchesSearch && matchesStatus && matchesCountry
  })

  const sortedDepots = [...filteredDepots].sort((a, b) => {
    const aValue = a[sortField as keyof Depot] || ""
    const bValue = b[sortField as keyof Depot] || ""
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida"
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida"
    }

    if (!formData.pais) {
      newErrors.pais = "El país es requerido"
    }

    if (!formData.provincia) {
      newErrors.provincia = "La provincia es requerida"
    }

    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es requerida"
    }

    if (!formData.latitud.trim()) {
      newErrors.latitud = "La latitud es requerida"
    } else if (!/^-?\d+(\.\d+)?$/.test(formData.latitud)) {
      newErrors.latitud = "La latitud debe ser un número válido"
    }

    if (!formData.longitud.trim()) {
      newErrors.longitud = "La longitud es requerida"
    } else if (!/^-?\d+(\.\d+)?$/.test(formData.longitud)) {
      newErrors.longitud = "La longitud debe ser un número válido"
    }

    // Validar duplicados
    const isDuplicate = depots.some(
      (depot) =>
        depot.id !== editingDepot?.id && depot.descripcion.toLowerCase() === formData.descripcion.toLowerCase(),
    )

    if (isDuplicate) {
      newErrors.descripcion = "Ya existe un depósito con esta descripción"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof DepotFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleGetCoordinates = () => {
    if (!formData.direccion || !formData.ciudad || !formData.pais) {
      setErrors({
        ...errors,
        direccion: !formData.direccion ? "Ingresa la dirección primero" : "",
        ciudad: !formData.ciudad ? "Selecciona la ciudad primero" : "",
        pais: !formData.pais ? "Selecciona el país primero" : "",
      })
      return
    }

    // Geocodificación simulada más inteligente
    const geocodeAddress = () => {
      const address = formData.direccion.toLowerCase()
      const city = formData.ciudad.toLowerCase()
      const country = formData.pais.toLowerCase()

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
        latOffset = 0.005 // Más cerca del agua
        variation = 0.008
      } else if (address.includes("aeropuerto") || address.includes("airport")) {
        latOffset = -0.02 // Generalmente en las afueras
        lngOffset = 0.015
        variation = 0.015
      } else if (address.includes("centro") || address.includes("center")) {
        variation = 0.005 // Muy cerca del centro
      } else if (address.includes("industrial") || address.includes("zona franca")) {
        latOffset = -0.01
        lngOffset = 0.01
        variation = 0.012
      } else if (address.includes("av") || address.includes("avenida")) {
        variation = 0.008 // Avenidas principales
      }

      // Aplicar variación basada en número de calle si existe
      const streetNumber = address.match(/\d+/)
      if (streetNumber) {
        const number = Number.parseInt(streetNumber[0])
        const numberVariation = (number % 1000) / 100000 // Pequeña variación basada en numeración
        latOffset += numberVariation
        lngOffset += numberVariation * 0.5
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
      latitud: coords.lat.toString(),
      longitud: coords.lng.toString(),
      coordMaps: `${coords.lat},${coords.lng}`,
    }))
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingDepot) {
      setDepots((prev) =>
        prev.map((depot) =>
          depot.id === editingDepot.id
            ? {
                ...depot,
                descripcion: formData.descripcion,
                direccion: formData.direccion,
                pais: formData.pais,
                provincia: formData.provincia,
                ciudad: formData.ciudad,
                latitud: Number(formData.latitud),
                longitud: Number(formData.longitud),
                coordMaps: formData.coordMaps || undefined,
                comentarios: formData.comentarios || undefined,
              }
            : depot,
        ),
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Depósito actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newDepot: Depot = {
        id: Math.max(...depots.map((d) => d.id), 0) + 1,
        descripcion: formData.descripcion,
        direccion: formData.direccion,
        pais: formData.pais,
        provincia: formData.provincia,
        ciudad: formData.ciudad,
        latitud: Number(formData.latitud),
        longitud: Number(formData.longitud),
        coordMaps: formData.coordMaps || undefined,
        comentarios: formData.comentarios || undefined,
        estado: "Activo",
      }
      setDepots((prev) => [...prev, newDepot])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Depósito creado exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleEdit = (depot: Depot) => {
    setEditingDepot(depot)
    setFormData({
      descripcion: depot.descripcion,
      direccion: depot.direccion,
      pais: depot.pais,
      provincia: depot.provincia,
      ciudad: depot.ciudad,
      coordMaps: depot.coordMaps || "",
      latitud: depot.latitud.toString(),
      longitud: depot.longitud.toString(),
      comentarios: depot.comentarios || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setDepots((prev) =>
      prev.map((depot) =>
        depot.id === id ? { ...depot, estado: "Inactivo" } : depot,
      ),
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Depósito dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingDepot(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setDepots((prev) =>
      prev.map((depot) =>
        depot.id === id ? { ...depot, estado: depot.estado === "Activo" ? "Inactivo" : "Activo" } : depot,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar depósitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los países</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDepot(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Depósito
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{editingDepot ? "Editar Depósito" : "Nuevo Depósito"}</DialogTitle>
              <DialogDescription>
                {editingDepot
                  ? "Modifica los datos del depósito seleccionado."
                  : "Completa los datos para crear un nuevo depósito."}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Input
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                      className={errors.descripcion ? "border-red-500" : ""}
                    />
                    {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pais">País *</Label>
                    <Select value={formData.pais} onValueChange={(value) => { setSelectedCountry(value); setSelectedProvince(""); handleInputChange("pais", value); handleInputChange("provincia", ""); handleInputChange("ciudad", ""); }}>
                      <SelectTrigger className={errors.pais ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pais && <p className="text-xs text-red-500">{errors.pais}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provincia">Provincia *</Label>
                    <Select 
                      value={formData.provincia} 
                      onValueChange={(value) => { 
                        setSelectedProvince(value); 
                        handleInputChange("provincia", value); 
                        handleInputChange("ciudad", ""); 
                      }}
                      disabled={!formData.pais}
                    >
                      <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.pais && provinces[formData.pais as keyof typeof provinces]?.map((province) => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.provincia && <p className="text-xs text-red-500">{errors.provincia}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Select 
                      value={formData.ciudad} 
                      onValueChange={(value) => handleInputChange("ciudad", value)}
                      disabled={!formData.provincia}
                    >
                      <SelectTrigger className={errors.ciudad ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.provincia && cities[formData.provincia as keyof typeof cities]?.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ciudad && <p className="text-xs text-red-500">{errors.ciudad}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    placeholder="Ej: Av. General Paz 1234"
                    className={errors.direccion ? "border-red-500" : ""}
                  />
                  {errors.direccion && <p className="text-xs text-red-500">{errors.direccion}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitud">Latitud *</Label>
                    <Input
                      id="latitud"
                      value={formData.latitud}
                      onChange={(e) => handleInputChange("latitud", e.target.value)}
                      placeholder="-34.6118"
                      className={errors.latitud ? "border-red-500" : ""}
                    />
                    {errors.latitud && <p className="text-xs text-red-500">{errors.latitud}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitud">Longitud *</Label>
                    <Input
                      id="longitud"
                      value={formData.longitud}
                      onChange={(e) => handleInputChange("longitud", e.target.value)}
                      placeholder="-58.3960"
                      className={errors.longitud ? "border-red-500" : ""}
                    />
                    {errors.longitud && <p className="text-xs text-red-500">{errors.longitud}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGetCoordinates} 
                      className="w-full"
                      disabled={!formData.direccion}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Obtener coordenadas
                    </Button>
                  </div>
                </div>

                {formData.latitud && formData.longitud && (
                  <div className="space-y-2">
                    <Label>Vista previa del mapa</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/view?key=demo&center=${formData.latitud},${formData.longitud}&zoom=15`}
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
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingDepot ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="descripcion"
                label="Descripción"
                icon={Building2}
                sortKey="descripcion"
                currentSort={sortField}
                direction={sortField === "descripcion" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="direccion"
                label="Dirección"
                icon={MapPin}
                sortKey="direccion"
                currentSort={sortField}
                direction={sortField === "direccion" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="pais"
                label="País"
                icon={Globe}
                sortKey="pais"
                currentSort={sortField}
                direction={sortField === "pais" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="provincia"
                label="Provincia"
                icon={MapPin}
                sortKey="provincia"
                currentSort={sortField}
                direction={sortField === "provincia" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="ciudad"
                label="Ciudad"
                icon={Building}
                sortKey="ciudad"
                currentSort={sortField}
                direction={sortField === "ciudad" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="estado"
                label="Estado"
                icon={CheckCircle}
                sortKey="estado"
                currentSort={sortField}
                direction={sortField === "estado" ? sortDirection : null}
                onSort={handleSort}
              />
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDepots.map((depot) => (
              <TableRow key={depot.id}>
                <TableCell className="font-medium">{depot.descripcion}</TableCell>
                <TableCell>{depot.direccion}</TableCell>
                <TableCell>{depot.pais}</TableCell>
                <TableCell>{depot.provincia}</TableCell>
                <TableCell>{depot.ciudad}</TableCell>
                <TableCell>
                  <Badge
                    variant={depot.estado === "Activo" ? "default" : "secondary"}
                    className={`cursor-pointer ${
                      depot.estado === "Activo"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => toggleStatus(depot.id)}
                  >
                    {depot.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(depot)}>
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
                              Esta acción dará de baja al depósito <strong>{depot.descripcion}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(depot.id)}>
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

      {sortedDepots.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron depósitos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
