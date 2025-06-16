"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CargoForm } from "@/components/cargo-form"

export default function NuevaCargaPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      console.log("Datos de la nueva carga:", data)
      // Aquí iría la lógica para guardar en el backend

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mostrar mensaje de éxito y redirigir
      alert("Carga creada exitosamente")
      router.push("/modules/cargas")
    } catch (error) {
      console.error("Error al crear carga:", error)
      alert("Error al crear la carga. Intente nuevamente.")
    }
  }

  const handleCancel = () => {
    router.push("/modules/cargas")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/modules/cargas")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Cargas
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Carga</h1>
          <p className="text-muted-foreground">Complete el formulario para registrar una nueva carga en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <CargoForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
