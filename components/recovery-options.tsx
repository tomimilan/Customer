"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Database, ArchiveRestoreIcon as FileRestore } from "lucide-react"

export function RecoveryOptions() {
  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Precaución</AlertTitle>
        <AlertDescription>
          Las operaciones de recuperación pueden sobrescribir datos existentes. Asegúrese de entender las implicaciones
          antes de proceder.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Restauración Completa
            </CardTitle>
            <CardDescription>Restaurar todo el sistema desde una copia de seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar backup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkp-1001">BKP-1001 (14/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1002">BKP-1002 (13/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1003">BKP-1003 (12/07/2023 15:30)</SelectItem>
                    <SelectItem value="bkp-1004">BKP-1004 (12/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1005">BKP-1005 (11/07/2023 04:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full">
              Iniciar Restauración Completa
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileRestore className="mr-2 h-5 w-5" />
              Restauración Selectiva
            </CardTitle>
            <CardDescription>Restaurar módulos o datos específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar backup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkp-1001">BKP-1001 (14/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1002">BKP-1002 (13/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1003">BKP-1003 (12/07/2023 15:30)</SelectItem>
                    <SelectItem value="bkp-1004">BKP-1004 (12/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1005">BKP-1005 (11/07/2023 04:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Usuarios</SelectItem>
                    <SelectItem value="loads">Cargas</SelectItem>
                    <SelectItem value="transports">Transportes</SelectItem>
                    <SelectItem value="assignments">Asignaciones</SelectItem>
                    <SelectItem value="tracking">Seguimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full">
              Iniciar Restauración Selectiva
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Verificación de Integridad
            </CardTitle>
            <CardDescription>Verificar la integridad de las copias de seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar backup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkp-1001">BKP-1001 (14/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1002">BKP-1002 (13/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1003">BKP-1003 (12/07/2023 15:30)</SelectItem>
                    <SelectItem value="bkp-1004">BKP-1004 (12/07/2023 04:00)</SelectItem>
                    <SelectItem value="bkp-1005">BKP-1005 (11/07/2023 04:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#00334a] hover:bg-[#004a6b]">Verificar Integridad</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
