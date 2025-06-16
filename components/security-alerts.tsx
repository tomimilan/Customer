"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  AlertTriangle,
  Shield,
  Eye,
  CheckCircle,
  Clock,
  Search,
  MoreHorizontal,
  Bell,
  Settings,
  TrendingUp,
  Users,
  Lock,
  Activity,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function SecurityAlerts() {
  const { toast } = useToast()

  const [alerts, setAlerts] = useState([
    {
      id: "ALT-1001",
      tipo: "Acceso Fallido",
      descripcion: "Múltiples intentos de acceso fallidos desde IP 192.168.1.103",
      severidad: "Alta",
      fecha: "14/07/2023 16:30:22",
      usuario: "carlos@importadoraandina.com",
      ip: "192.168.1.103",
      estado: "Pendiente",
      intentos: 5,
    },
    {
      id: "ALT-1002",
      tipo: "Actividad Sospechosa",
      descripcion: "Acceso desde ubicación inusual detectado",
      severidad: "Media",
      fecha: "14/07/2023 14:15:18",
      usuario: "maria@logisticadelsur.com",
      ip: "203.45.67.89",
      estado: "En Revisión",
      ubicacion: "Buenos Aires, Argentina",
    },
    {
      id: "ALT-1003",
      tipo: "Sesión Expirada",
      descripcion: "Sesión forzosamente cerrada por inactividad prolongada",
      severidad: "Baja",
      fecha: "14/07/2023 12:00:00",
      usuario: "juan@transportesrapidos.com",
      ip: "192.168.1.101",
      estado: "Resuelto",
    },
    {
      id: "ALT-1004",
      tipo: "Cambio de Permisos",
      descripcion: "Modificación no autorizada de permisos de usuario",
      severidad: "Crítica",
      fecha: "13/07/2023 18:45:33",
      usuario: "admin@logicarga.com",
      ip: "192.168.1.100",
      estado: "Pendiente",
      modulo: "Usuarios y Roles",
    },
    {
      id: "ALT-1005",
      tipo: "Intento de Inyección",
      descripcion: "Posible intento de inyección SQL detectado",
      severidad: "Crítica",
      fecha: "13/07/2023 15:22:11",
      usuario: "Desconocido",
      ip: "45.123.67.89",
      estado: "Bloqueado",
    },
  ])

  const [alertConfig, setAlertConfig] = useState({
    intentosFallidos: true,
    actividadSospechosa: true,
    cambiosPermisos: true,
    inyeccionSQL: true,
    sesionesMultiples: false,
    ubicacionInusual: true,
  })

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case "Crítica":
        return "bg-red-500"
      case "Alta":
        return "bg-orange-500"
      case "Media":
        return "bg-yellow-500"
      case "Baja":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-red-100 text-red-800 border-red-200"
      case "En Revisión":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Resuelto":
        return "bg-green-100 text-green-800 border-green-200"
      case "Bloqueado":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, estado: "Resuelto" } : alert)))
    toast({
      title: "Alerta resuelta",
      description: `La alerta ${alertId} ha sido marcada como resuelta.`,
    })
  }

  const handleBlockIP = (ip: string) => {
    toast({
      title: "IP bloqueada",
      description: `La dirección IP ${ip} ha sido bloqueada.`,
    })
  }

  const alertStats = {
    total: alerts.length,
    pendientes: alerts.filter((a) => a.estado === "Pendiente").length,
    criticas: alerts.filter((a) => a.severidad === "Crítica").length,
    hoy: alerts.filter((a) => a.fecha.includes("14/07/2023")).length,
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de Alertas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.total}</div>
            <p className="text-xs text-muted-foreground">Todas las alertas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{alertStats.pendientes}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertStats.criticas}</div>
            <p className="text-xs text-muted-foreground">Máxima prioridad</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{alertStats.hoy}</div>
            <p className="text-xs text-muted-foreground">En las últimas 24h</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alertas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alertas">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertas Activas
          </TabsTrigger>
          <TabsTrigger value="configuracion">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="estadisticas">
            <TrendingUp className="h-4 w-4 mr-2" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alertas de Seguridad</CardTitle>
                  <CardDescription>Monitoreo y gestión de alertas de seguridad del sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Buscar alertas..." className="pl-10 h-9" />
                  </div>
                </div>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-36 h-9">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="critica">Críticas</SelectItem>
                    <SelectItem value="alta">Altas</SelectItem>
                    <SelectItem value="media">Medias</SelectItem>
                    <SelectItem value="baja">Bajas</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="pendientes">
                  <SelectTrigger className="w-36 h-9">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendientes">Pendientes</SelectItem>
                    <SelectItem value="revision">En Revisión</SelectItem>
                    <SelectItem value="resueltos">Resueltos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {alert.tipo === "Acceso Fallido" && <Lock className="h-4 w-4 text-red-500" />}
                          {alert.tipo === "Actividad Sospechosa" && <Eye className="h-4 w-4 text-yellow-500" />}
                          {alert.tipo === "Sesión Expirada" && <Clock className="h-4 w-4 text-blue-500" />}
                          {alert.tipo === "Cambio de Permisos" && <Users className="h-4 w-4 text-purple-500" />}
                          {alert.tipo === "Intento de Inyección" && <Shield className="h-4 w-4 text-red-600" />}
                          <span className="text-sm">{alert.tipo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={alert.descripcion}>
                          {alert.descripcion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(alert.severidad)}>{alert.severidad}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{alert.usuario}</TableCell>
                      <TableCell className="font-mono text-sm">{alert.ip}</TableCell>
                      <TableCell className="text-sm">{alert.fecha}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(alert.estado)}>
                          {alert.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            {alert.estado === "Pendiente" && (
                              <DropdownMenuItem onClick={() => handleResolveAlert(alert.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marcar como resuelto
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBlockIP(alert.ip)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Bloquear IP
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              Ver actividad del usuario
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Alertas</CardTitle>
              <CardDescription>Configure qué tipos de eventos generan alertas de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Intentos de acceso fallidos</Label>
                    <div className="text-sm text-muted-foreground">
                      Alertar cuando se detecten múltiples intentos de acceso fallidos
                    </div>
                  </div>
                  <Switch
                    checked={alertConfig.intentosFallidos}
                    onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, intentosFallidos: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Actividad sospechosa</Label>
                    <div className="text-sm text-muted-foreground">Detectar patrones de comportamiento inusuales</div>
                  </div>
                  <Switch
                    checked={alertConfig.actividadSospechosa}
                    onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, actividadSospechosa: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cambios de permisos</Label>
                    <div className="text-sm text-muted-foreground">
                      Alertar sobre modificaciones en permisos de usuarios
                    </div>
                  </div>
                  <Switch
                    checked={alertConfig.cambiosPermisos}
                    onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, cambiosPermisos: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Intentos de inyección SQL</Label>
                    <div className="text-sm text-muted-foreground">Detectar posibles ataques de inyección SQL</div>
                  </div>
                  <Switch
                    checked={alertConfig.inyeccionSQL}
                    onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, inyeccionSQL: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sesiones múltiples</Label>
                    <div className="text-sm text-muted-foreground">
                      Alertar cuando un usuario tenga múltiples sesiones activas
                    </div>
                  </div>
                  <Switch
                    checked={alertConfig.sesionesMultiples}
                    onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, sesionesMultiples: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Ubicación inusual</Label>
                    <div className="text-sm text-muted-foreground">
                      Detectar accesos desde ubicaciones geográficas inusuales
                    </div>
                  </div>
                  <Switch
                    checked={alertConfig.ubicacionInusual}
                    onCheckedChange={(checked) => setAlertConfig((prev) => ({ ...prev, ubicacionInusual: checked }))}
                  />
                </div>
              </div>
              <Button className="bg-[#00334a] hover:bg-[#004a6b]">Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alertas por Tipo</CardTitle>
                <CardDescription>Distribución de alertas por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Acceso Fallido</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Actividad Sospechosa</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Intento de Inyección</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cambio de Permisos</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tendencia Semanal</CardTitle>
                <CardDescription>Alertas generadas en los últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lunes</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Martes</span>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Miércoles</span>
                    <span className="text-sm font-medium">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Jueves</span>
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Viernes</span>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sábado</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Domingo</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
