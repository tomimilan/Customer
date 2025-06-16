"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TransportCompanyForm } from "@/components/transport-company-form"

export default function NuevaEmpresaPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      console.log("Datos de la nueva empresa:", data)
      // Aquí iría la lógica para guardar en el backend

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir sin alert, el toast se muestra desde el formulario
      router.push("/modules/flota")
    } catch (error) {
      console.error("Error al crear empresa:", error)
      // El error también se maneja desde el formulario con toast
      throw error
    }
  }

  const handleCancel = () => {
    router.push("/modules/flota")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/modules/flota")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Flota
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Empresa de Transporte</h1>
          <p className="text-muted-foreground">
            Complete el formulario para registrar una nueva empresa de transporte en el sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <TransportCompanyForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
