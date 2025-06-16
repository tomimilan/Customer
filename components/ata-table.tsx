"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Search, MoreHorizontal, Building2, Hash, Globe, Building, Phone, Mail, CheckCircle, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Ata {
  id: number
  razonSocial: string
  cuitRutNic: string
  pais: string
  provincia: string
  ciudad: string
  direccion: string
  celular?: string
  email?: string
  estado: "Activo" | "Inactivo"
}

interface AtaFormData {
  razonSocial: string
  cuitRutNic: string
  pais: string
  provincia: string
  ciudad: string
  direccion: string
  celular: string
  email: string
}

interface FormErrors {
  razonSocial?: string
  cuitRutNic?: string
  pais?: string
  provincia?: string
  ciudad?: string
  direccion?: string
  email?: string
}

const initialFormData: AtaFormData = {
  razonSocial: "",
  cuitRutNic: "",
  pais: "",
  provincia: "",
  ciudad: "",
  direccion: "",
  celular: "",
  email: "",
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
type ProvinceMap = Record<Country, string[]>;
const provinces: ProvinceMap = {
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Salta", "Misiones", "Chaco", "Corrientes"],
  Brasil: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"],
  Chile: ["Región Metropolitana", "Valparaíso", "Biobío", "Araucanía", "Los Lagos", "Antofagasta"],
  Uruguay: ["Montevideo", "Canelones", "Maldonado", "Salto", "Paysandú", "Rivera"],
  Paraguay: [],
  Bolivia: [],
  Colombia: [],
  Perú: [],
  Ecuador: [],
  Venezuela: [],
  México: [],
  "Estados Unidos": [],
};
type Province = string;
type CityMap = Record<Province, string[]>;
const cities: CityMap = {
  "Buenos Aires": ["Ciudad Autónoma de Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes"],
  "Córdoba": ["Córdoba", "Río Cuarto", "Villa María", "San Francisco", "Villa Carlos Paz"],
  "Santa Fe": ["Santa Fe", "Rosario", "Rafaela", "Venado Tuerto", "Santo Tomé"],
  "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Las Heras", "Luján de Cuyo"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Aguilares", "Banda del Río Salí"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay", "Victoria"],
  "Salta": ["Salta", "San Ramón de la Nueva Orán", "Tartagal", "Metán", "Cafayate"],
  "Misiones": ["Posadas", "Oberá", "Eldorado", "Puerto Iguazú", "San Vicente"],
  "Chaco": ["Resistencia", "Barranqueras", "Villa Ángela", "Presidencia Roque Sáenz Peña", "Charata"],
  "Corrientes": ["Corrientes", "Goya", "Mercedes", "Curuzú Cuatiá", "Paso de los Libres"],
  "São Paulo": ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
  "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
  "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
  "Biobío": ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel"],
  "Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal"],
  "Montevideo": ["Montevideo", "Punta del Este", "Piriápolis", "Atlántida", "Las Piedras"],
  "Canelones": ["Canelones", "Santa Lucía", "Las Piedras", "Pando", "Progreso"],
  "Maldonado": ["Maldonado", "Punta del Este", "San Carlos", "Piriápolis", "Pan de Azúcar"],
  "Salto": ["Salto", "Paysandú", "Artigas", "Rivera", "Tacuarembó"],
  "Paysandú": ["Paysandú", "Salto", "Artigas", "Rivera", "Tacuarembó"],
  "Rivera": ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales", "Lapuente"],
};

export function AtaTable() {
  const [atas, setAtas] = useState<Ata[]>([
    {
      id: 1,
      razonSocial: "ATA Logística Internacional",
      cuitRutNic: "20123456789",
      pais: "Argentina",
      provincia: "Buenos Aires",
      ciudad: "Buenos Aires",
      direccion: "Av. Siempre Viva 123",
      celular: "+54 9 11 1234-5678",
      email: "info@atalogistica.com",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "Global ATA Services",
      cuitRutNic: "30987654321",
      pais: "Brasil",
      provincia: "São Paulo",
      ciudad: "São Paulo",
      direccion: "Rua Central 456",
      celular: "+55 11 98765-4321",
      email: "contato@globalata.com.br",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("razonSocial")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAta, setEditingAta] = useState<Ata | null>(null)
  const [formData, setFormData] = useState<AtaFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()

  // Estados para selects dependientes
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedProvince, setSelectedProvince] = useState<string>("")

  const filteredAtas = atas.filter((ata) => {
    const matchesSearch =
      ata.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.cuitRutNic.includes(searchTerm) ||
      (ata.pais && ata.pais.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ata.ciudad && ata.ciudad.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || ata.estado === statusFilter
    const matchesCountry = countryFilter === "all" || ata.pais === countryFilter

    return matchesSearch && matchesStatus && matchesCountry
  })

  const sortedAtas = [...filteredAtas].sort((a, b) => {
    const aValue = a[sortField as keyof Ata] || ""
    const bValue = b[sortField as keyof Ata] || ""
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

    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = "La razón social es obligatoria"
    }

    if (!formData.cuitRutNic.trim()) {
      newErrors.cuitRutNic = "El CUIT/RUT/NIC/SP es obligatorio"
    } else if (!/^\d+$/.test(formData.cuitRutNic)) {
      newErrors.cuitRutNic = "Solo se permiten números sin guiones"
    } else if (formData.cuitRutNic.length < 8) {
      newErrors.cuitRutNic = "Debe tener al menos 8 dígitos"
    }

    if (!formData.pais) {
      newErrors.pais = "El país es obligatorio"
    }

    if (!formData.provincia) {
      newErrors.provincia = "La provincia es obligatoria"
    }

    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es obligatoria"
    }

    if (!formData.direccion?.trim()) {
      newErrors.direccion = "La dirección es obligatoria"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Validar duplicados
    const isDuplicate = atas.some(
      (ata) =>
        ata.id !== editingAta?.id &&
        (ata.cuitRutNic === formData.cuitRutNic ||
          ata.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase()),
    )

    if (isDuplicate) {
      newErrors.cuitRutNic = "Ya existe un ATA con este CUIT/RUT/NIC/SP"
      newErrors.razonSocial = "Ya existe un ATA con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof AtaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingAta) {
      setAtas((prev) =>
        prev.map((ata) =>
          ata.id === editingAta.id
            ? {
                ...ata,
                ...formData,
                celular: formData.celular || undefined,
                email: formData.email || undefined,
              }
            : ata,
        ),
      )
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            ATA actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newAta: Ata = {
        id: Math.max(...atas.map((a) => a.id), 0) + 1,
        ...formData,
        celular: formData.celular || undefined,
        email: formData.email || undefined,
        estado: "Activo",
      }
      setAtas((prev) => [...prev, newAta])
      toast({
        description: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            ATA creado exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleEdit = (ata: Ata) => {
    setEditingAta(ata)
    setFormData({
      razonSocial: ata.razonSocial,
      cuitRutNic: ata.cuitRutNic,
      pais: ata.pais || "",
      provincia: ata.provincia || "",
      ciudad: ata.ciudad || "",
      celular: ata.celular || "",
      email: ata.email || "",
      direccion: ata.direccion || "",
    })
    setSelectedCountry(ata.pais || "")
    setSelectedProvince("")
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setAtas((prev) =>
      prev.map((ata) =>
        ata.id === id ? { ...ata, estado: "Inactivo" } : ata,
      ),
    )
    toast({
      description: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          ATA dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingAta(null)
    setFormData(initialFormData)
    setErrors({})
    setSelectedCountry("")
    setSelectedProvince("")
  }

  const toggleStatus = (id: number) => {
    setAtas((prev) =>
      prev.map((ata) => (ata.id === id ? { ...ata, estado: ata.estado === "Activo" ? "Inactivo" : "Activo" } : ata)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ATAs..."
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
            <Button onClick={() => setEditingAta(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo ATA
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingAta ? "Editar ATA" : "Nuevo ATA"}</DialogTitle>
              <DialogDescription>
                {editingAta
                  ? "Modifica los datos del ATA seleccionado."
                  : "Completa los datos para crear un nuevo ATA."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social *</Label>
                  <Input
                    id="razonSocial"
                    value={formData.razonSocial}
                    onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                    className={errors.razonSocial ? "border-red-500" : ""}
                  />
                  {errors.razonSocial && <p className="text-sm text-red-500">{errors.razonSocial}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuitRutNic">CUIT/RUT/NIC/SP *</Label>
                  <Input
                    id="cuitRutNic"
                    value={formData.cuitRutNic}
                    onChange={(e) => handleInputChange("cuitRutNic", e.target.value.replace(/\D/g, ""))}
                    placeholder="Solo números sin guiones"
                    className={errors.cuitRutNic ? "border-red-500" : ""}
                  />
                  {errors.cuitRutNic && <p className="text-sm text-red-500">{errors.cuitRutNic}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  {errors.pais && <p className="text-sm text-red-500">{errors.pais}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Select value={formData.provincia || ""} onValueChange={(value) => { setSelectedProvince(value); handleInputChange("provincia", value); handleInputChange("ciudad", ""); }} disabled={!selectedCountry}>
                    <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCountry && provinces[selectedCountry as Country]?.map((province: string) => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.provincia && <p className="text-sm text-red-500">{errors.provincia}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Select value={formData.ciudad || ""} onValueChange={(value) => handleInputChange("ciudad", value)} disabled={!selectedProvince}>
                    <SelectTrigger className={errors.ciudad ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvince && cities[selectedProvince as Province]?.map((city: string) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ciudad && <p className="text-sm text-red-500">{errors.ciudad}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input 
                    id="direccion" 
                    value={formData.direccion || ""} 
                    onChange={(e) => handleInputChange("direccion", e.target.value)} 
                    placeholder="Dirección completa" 
                    className={errors.direccion ? "border-red-500" : ""}
                  />
                  {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@ata.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingAta ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="razonSocial"
                label="Razón Social"
                icon={Building2}
                sortKey="razonSocial"
                currentSort={sortField}
                direction={sortField === "razonSocial" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="cuitRutNic"
                label="CUIT/RUT/NIC/SP"
                icon={Hash}
                sortKey="cuitRutNic"
                currentSort={sortField}
                direction={sortField === "cuitRutNic" ? sortDirection : null}
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
                column="ciudad"
                label="Ciudad"
                icon={Building}
                sortKey="ciudad"
                currentSort={sortField}
                direction={sortField === "ciudad" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="celular"
                label="Celular"
                icon={Phone}
                sortKey="celular"
                currentSort={sortField}
                direction={sortField === "celular" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="email"
                label="Email"
                icon={Mail}
                sortKey="email"
                currentSort={sortField}
                direction={sortField === "email" ? sortDirection : null}
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
            {sortedAtas.map((ata) => (
              <TableRow key={ata.id}>
                <TableCell className="font-medium">{ata.razonSocial}</TableCell>
                <TableCell>{ata.cuitRutNic}</TableCell>
                <TableCell>{ata.pais || "-"}</TableCell>
                <TableCell>{ata.ciudad || "-"}</TableCell>
                <TableCell>{ata.celular || "-"}</TableCell>
                <TableCell>{ata.email || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={ata.estado === "Activo" ? "default" : "secondary"}
                    className={`cursor-pointer ${
                      ata.estado === "Activo"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => toggleStatus(ata.id)}
                  >
                    {ata.estado}
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
                      <DropdownMenuItem onClick={() => handleEdit(ata)}>
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
                              Esta acción dará de baja al ATA <strong>{ata.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(ata.id)}>
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

      {sortedAtas.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron ATAs que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
