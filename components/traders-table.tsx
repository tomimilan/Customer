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
import { Plus, Search, MoreHorizontal, Building2, Hash, User, Phone, Mail, CheckCircle, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Trader {
  id: number
  razonSocial: string
  cuitRutNic: string
  contacto: string
  contactoCelular?: string
  contactoEmail?: string
  estado: "Activo" | "Inactivo"
}

interface TraderFormData {
  razonSocial: string
  cuitRutNic: string
  contacto: string
  contactoCelular: string
  contactoEmail: string
}

interface FormErrors {
  razonSocial?: string
  cuitRutNic?: string
  contacto?: string
  contactoEmail?: string
}

const initialFormData: TraderFormData = {
  razonSocial: "",
  cuitRutNic: "",
  contacto: "",
  contactoCelular: "",
  contactoEmail: "",
}

export function TradersTable() {
  const [traders, setTraders] = useState<Trader[]>([
    {
      id: 1,
      razonSocial: "Comercial Internacional S.A.",
      cuitRutNic: "20123456789",
      contacto: "Juan Pérez",
      contactoCelular: "+54 9 11 1234-5678",
      contactoEmail: "juan.perez@comercial.com",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "Global Trade Corp",
      cuitRutNic: "30987654321",
      contacto: "María González",
      contactoCelular: "+54 9 11 8765-4321",
      contactoEmail: "maria.gonzalez@globaltrade.com",
      estado: "Activo",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("razonSocial")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTrader, setEditingTrader] = useState<Trader | null>(null)
  const [formData, setFormData] = useState<TraderFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredTraders = traders.filter((trader) => {
    const matchesSearch =
      trader.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trader.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trader.cuitRutNic.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || trader.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedTraders = [...filteredTraders].sort((a, b) => {
    const aValue = a[sortField as keyof Trader] || ""
    const bValue = b[sortField as keyof Trader] || ""
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

    if (!formData.contacto.trim()) {
      newErrors.contacto = "El contacto es obligatorio"
    }

    if (formData.contactoEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactoEmail)) {
      newErrors.contactoEmail = "El formato del email no es válido"
    }

    // Validar duplicados
    const isDuplicate = traders.some(
      (trader) =>
        trader.id !== editingTrader?.id &&
        (trader.cuitRutNic === formData.cuitRutNic ||
          trader.razonSocial.toLowerCase() === formData.razonSocial.toLowerCase()),
    )

    if (isDuplicate) {
      newErrors.cuitRutNic = "Ya existe un trader con este CUIT/RUT/NIC/SP"
      newErrors.razonSocial = "Ya existe un trader con esta razón social"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof TraderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingTrader) {
      setTraders((prev) =>
        prev.map((trader) =>
          trader.id === editingTrader.id
            ? {
                ...trader,
                ...formData,
                contactoCelular: formData.contactoCelular || undefined,
                contactoEmail: formData.contactoEmail || undefined,
              }
            : trader,
        ),
      )
      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Trader actualizado exitosamente
          </div>
        ),
      })
    } else {
      const newTrader: Trader = {
        id: Math.max(...traders.map((t) => t.id), 0) + 1,
        ...formData,
        contactoCelular: formData.contactoCelular || undefined,
        contactoEmail: formData.contactoEmail || undefined,
        estado: "Activo",
      }
      setTraders((prev) => [...prev, newTrader])
      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            Trader creado exitosamente
          </div>
        ),
      })
    }

    handleCloseDialog()
  }

  const handleEdit = (trader: Trader) => {
    setEditingTrader(trader)
    setFormData({
      razonSocial: trader.razonSocial,
      cuitRutNic: trader.cuitRutNic,
      contacto: trader.contacto,
      contactoCelular: trader.contactoCelular || "",
      contactoEmail: trader.contactoEmail || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setTraders((prev) =>
      prev.map((trader) =>
        trader.id === id ? { ...trader, estado: "Inactivo" } : trader,
      ),
    )
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          Trader dado de baja exitosamente
        </div>
      ),
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTrader(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const toggleStatus = (id: number) => {
    setTraders((prev) =>
      prev.map((trader) =>
        trader.id === id ? { ...trader, estado: trader.estado === "Activo" ? "Inactivo" : "Activo" } : trader,
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
              placeholder="Buscar traders..."
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
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTrader(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Trader
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTrader ? "Editar Trader" : "Nuevo Trader"}</DialogTitle>
              <DialogDescription>
                {editingTrader
                  ? "Modifica los datos del trader seleccionado."
                  : "Completa los datos para crear un nuevo trader."}
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
              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto *</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => handleInputChange("contacto", e.target.value)}
                  placeholder="Nombre de la persona de contacto"
                  className={errors.contacto ? "border-red-500" : ""}
                />
                {errors.contacto && <p className="text-sm text-red-500">{errors.contacto}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoCelular">Contacto Celular</Label>
                  <Input
                    id="contactoCelular"
                    value={formData.contactoCelular}
                    onChange={(e) => handleInputChange("contactoCelular", e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoEmail">Contacto Email</Label>
                  <Input
                    id="contactoEmail"
                    type="email"
                    value={formData.contactoEmail}
                    onChange={(e) => handleInputChange("contactoEmail", e.target.value)}
                    placeholder="contacto@empresa.com"
                    className={errors.contactoEmail ? "border-red-500" : ""}
                  />
                  {errors.contactoEmail && <p className="text-sm text-red-500">{errors.contactoEmail}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>{editingTrader ? "Actualizar" : "Crear"}</Button>
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
                column="contacto"
                label="Contacto"
                icon={User}
                sortKey="contacto"
                currentSort={sortField}
                direction={sortField === "contacto" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="contactoCelular"
                label="Celular"
                icon={Phone}
                sortKey="contactoCelular"
                currentSort={sortField}
                direction={sortField === "contactoCelular" ? sortDirection : null}
                onSort={handleSort}
              />
              <SortableHeader
                column="contactoEmail"
                label="Email"
                icon={Mail}
                sortKey="contactoEmail"
                currentSort={sortField}
                direction={sortField === "contactoEmail" ? sortDirection : null}
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
            {sortedTraders.map((trader) => (
              <TableRow key={trader.id}>
                <TableCell className="font-medium">{trader.razonSocial}</TableCell>
                <TableCell>{trader.cuitRutNic}</TableCell>
                <TableCell>{trader.contacto}</TableCell>
                <TableCell>{trader.contactoCelular || "-"}</TableCell>
                <TableCell>{trader.contactoEmail || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={trader.estado === "Activo" ? "default" : "secondary"}
                    className={`cursor-pointer ${
                      trader.estado === "Activo"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => toggleStatus(trader.id)}
                  >
                    {trader.estado}
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
                      <DropdownMenuItem onClick={() => handleEdit(trader)}>
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
                              Esta acción dará de baja al trader <strong>{trader.razonSocial}</strong>.
                              El registro cambiará su estado a inactivo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(trader.id)}>
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

      {sortedTraders.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron traders que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
