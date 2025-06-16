"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { FileText, FileIcon as FilePdf, FileSpreadsheet, Download } from "lucide-react"

export function ReportsExport() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    // Simulación de exportación
    setTimeout(() => {
      setIsExporting(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <FilePdf className="h-10 w-10 text-red-500" />
              <div>
                <h3 className="text-lg font-medium">Exportar a PDF</h3>
                <p className="text-sm text-muted-foreground">Generar informe en formato PDF</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-template">Plantilla</Label>
                <Select>
                  <SelectTrigger id="pdf-template">
                    <SelectValue placeholder="Seleccionar plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resumen">Resumen Ejecutivo</SelectItem>
                    <SelectItem value="detallado">Informe Detallado</SelectItem>
                    <SelectItem value="estadistico">Informe Estadístico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#00334a] hover:bg-[#004a6b]" onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Exportando..." : "Exportar a PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <FileSpreadsheet className="h-10 w-10 text-green-500" />
              <div>
                <h3 className="text-lg font-medium">Exportar a Excel</h3>
                <p className="text-sm text-muted-foreground">Generar informe en formato Excel</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excel-template">Plantilla</Label>
                <Select>
                  <SelectTrigger id="excel-template">
                    <SelectValue placeholder="Seleccionar plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="datos-crudos">Datos Crudos</SelectItem>
                    <SelectItem value="con-graficos">Con Gráficos</SelectItem>
                    <SelectItem value="analisis">Análisis Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#00334a] hover:bg-[#004a6b]" onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Exportando..." : "Exportar a Excel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personalizar Informe</h3>
        <div className="space-y-2">
          <Label htmlFor="report-name">Nombre del Informe</Label>
          <Input id="report-name" placeholder="Informe de Cargas - Julio 2023" />
        </div>
        <div className="space-y-2">
          <Label>Incluir Secciones</Label>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="section-summary" defaultChecked />
              <label htmlFor="section-summary" className="text-sm">
                Resumen Ejecutivo
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="section-stats" defaultChecked />
              <label htmlFor="section-stats" className="text-sm">
                Estadísticas
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="section-details" defaultChecked />
              <label htmlFor="section-details" className="text-sm">
                Detalles de Cargas
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="section-charts" defaultChecked />
              <label htmlFor="section-charts" className="text-sm">
                Gráficos
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="section-performance" defaultChecked />
              <label htmlFor="section-performance" className="text-sm">
                Métricas de Rendimiento
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="section-recommendations" />
              <label htmlFor="section-recommendations" className="text-sm">
                Recomendaciones
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-[#00334a] hover:bg-[#004a6b]">
            <FileText className="mr-2 h-4 w-4" />
            Generar Informe Personalizado
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informes Recientes</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center space-x-3">
              <FilePdf className="h-6 w-6 text-red-500" />
              <div>
                <p className="text-sm font-medium">Informe de Cargas - Junio 2023.pdf</p>
                <p className="text-xs text-muted-foreground">Generado el 01/07/2023</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium">Análisis de Rendimiento - Q2 2023.xlsx</p>
                <p className="text-xs text-muted-foreground">Generado el 30/06/2023</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center space-x-3">
              <FilePdf className="h-6 w-6 text-red-500" />
              <div>
                <p className="text-sm font-medium">Resumen Ejecutivo - Mayo 2023.pdf</p>
                <p className="text-xs text-muted-foreground">Generado el 05/06/2023</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
