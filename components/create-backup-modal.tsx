"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  HardDrive,
  Cloud,
  Database,
  Server,
  Users,
  Truck,
  Package,
  FileText,
  Settings,
  Shield,
  BarChart,
} from "lucide-react"

interface CreateBackupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBackupModal({ open, onOpenChange }: CreateBackupModalProps) {
  const { toast } = useToast()
  const [backupType, setBackupType] = useState<"completo" | "selectivo">("completo")
  const [storageLocation, setStorageLocation] = useState("local")
  const [backupName, setBackupName] = useState(`backup-${new Date().toISOString().split("T")[0]}`)
  const [isCreating, setIsCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "usuarios",
    "cargas",
    "transporte",
    "reportes",
    "seguridad",
    "parametrizacion",
  ])

  const modules = [
    { id: "usuarios", name: "Usuarios", icon: <Users className="h-4 w-4" /> },
    { id: "cargas", name: "Cargas", icon: <Package className="h-4 w-4" /> },
    { id: "transporte", name: "Transporte", icon: <Truck className="h-4 w-4" /> },
    { id: "reportes", name: "Reportes", icon: <FileText className="h-4 w-4" /> },
    { id: "seguridad", name: "Seguridad", icon: <Shield className="h-4 w-4" /> },
    { id: "parametrizacion", name: "Parametrización", icon: <Settings className="h-4 w-4" /> },
    { id: "estadisticas", name: "Estadísticas", icon: <BarChart className="h-4 w-4" /> },
  ]

  const storageOptions = [
    { id: "local", name: "Servidor Local", icon: <Server className="h-5 w-5" />, space: "120 GB disponibles" },
    { id: "aws", name: "AWS S3", icon: <Cloud className="h-5 w-5" />, space: "Ilimitado" },
    { id: "nas", name: "NAS", icon: <HardDrive className="h-5 w-5" />, space: "500 GB disponibles" },
    { id: "db", name: "Base de Datos", icon: <Database className="h-5 w-5" />, space: "50 GB disponibles" },
  ]

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleCreateBackup = () => {
    setIsCreating(true)

    // Toast de inicio
    toast({
      title: "Backup iniciado",
      description: `Creando backup "${backupName}" en ${storageOptions.find((opt) => opt.id === storageLocation)?.name}`,
    })

    // Simulación de progreso
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsCreating(false)
          setProgress(0)
          onOpenChange(false)

          // Toast de éxito
          toast({
            title: "Backup creado exitosamente",
            description: `El backup "${backupName}" se ha creado correctamente y está disponible en ${storageOptions.find((opt) => opt.id === storageLocation)?.name}`,
          })
        }, 500)
      }
    }, 300)
  }

  const estimatedSize = backupType === "completo" ? "~2.5 GB" : `~${(selectedModules.length * 0.4).toFixed(1)} GB`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Backup Manual</DialogTitle>
          <DialogDescription>Configure las opciones para crear un nuevo backup del sistema</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="backup-name" className="text-sm font-medium">
              Nombre del Backup
            </Label>
            <Input
              id="backup-name"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="backup-2023-06-07"
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Ubicación de Almacenamiento</Label>
            <RadioGroup value={storageLocation} onValueChange={setStorageLocation} className="grid grid-cols-2 gap-4">
              {storageOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`location-${option.id}`} />
                  <Label
                    htmlFor={`location-${option.id}`}
                    className="flex items-center cursor-pointer rounded-md border p-2 w-full"
                  >
                    <div className="mr-2 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {option.icon}
                    </div>
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-gray-500">{option.space}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Backup</Label>
            <RadioGroup
              value={backupType}
              onValueChange={(value: "completo" | "selectivo") => setBackupType(value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completo" id="backup-completo" />
                <Label htmlFor="backup-completo" className="cursor-pointer">
                  Backup Completo (Todos los módulos)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selectivo" id="backup-selectivo" />
                <Label htmlFor="backup-selectivo" className="cursor-pointer">
                  Backup Selectivo (Módulos específicos)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {backupType === "selectivo" && (
            <div className="space-y-2 border rounded-md p-3 bg-gray-50">
              <Label className="text-sm font-medium">
                Seleccione Módulos ({selectedModules.length}/{modules.length})
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <Label htmlFor={`module-${module.id}`} className="flex items-center cursor-pointer">
                      {module.icon}
                      <span className="ml-2">{module.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded-md">
            <span>Tamaño estimado:</span>
            <span className="font-medium">{estimatedSize}</span>
          </div>
        </div>

        {isCreating && (
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Creando backup...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateBackup}
            className="bg-[#00334a] hover:bg-[#004a6b]"
            disabled={isCreating || (backupType === "selectivo" && selectedModules.length === 0)}
          >
            {isCreating ? (
              <span className="flex items-center">
                Creando
                <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              </span>
            ) : (
              "Crear Backup"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
