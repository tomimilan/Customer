"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HardDrive, Cloud, Server, Database, Plus, Trash2, Edit, CheckCircle, WifiOff } from "lucide-react"
import { useState } from "react"

export function StorageManagement() {
  const [storageLocations, setStorageLocations] = useState([
    {
      id: 1,
      name: "Servidor Principal",
      type: "local",
      path: "/var/backups/logicarga",
      totalSpace: 5000, // GB
      usedSpace: 1200,
      status: "active",
      lastSync: "2024-01-15 04:00:00",
    },
    {
      id: 2,
      name: "AWS S3 Bucket",
      type: "cloud",
      path: "s3://logicarga-backups/",
      totalSpace: 10000,
      usedSpace: 800,
      status: "active",
      lastSync: "2024-01-15 04:05:00",
    },
    {
      id: 3,
      name: "NAS Oficina",
      type: "nas",
      path: "//192.168.1.100/backups",
      totalSpace: 2000,
      usedSpace: 450,
      status: "inactive",
      lastSync: "2024-01-14 22:30:00",
    },
  ])

  const getStorageIcon = (type: string) => {
    switch (type) {
      case "local":
        return <Server className="h-4 w-4" />
      case "cloud":
        return <Cloud className="h-4 w-4" />
      case "nas":
        return <HardDrive className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <WifiOff className="h-3 w-3 mr-1" />
        Inactivo
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Ubicaciones de Almacenamiento</h3>
          <p className="text-sm text-muted-foreground">
            Gestione las ubicaciones donde se almacenan las copias de seguridad
          </p>
        </div>
        <Button className="bg-[#00334a] hover:bg-[#004a6b]">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ubicación
        </Button>
      </div>

      <div className="grid gap-4">
        {storageLocations.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStorageIcon(location.type)}
                  <div>
                    <CardTitle className="text-base">{location.name}</CardTitle>
                    <CardDescription className="text-sm">{location.path}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(location.status)}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Espacio utilizado</span>
                    <span>
                      {location.usedSpace} GB / {location.totalSpace} GB
                    </span>
                  </div>
                  <Progress value={(location.usedSpace / location.totalSpace) * 100} className="h-2" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Última sincronización:</span>
                  <span>{location.lastSync}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
