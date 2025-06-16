"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CountriesTable } from "@/components/countries-table"
import { ProvincesTable } from "@/components/provinces-table"
import { CitiesTable } from "@/components/cities-table"
import { CustomsTable } from "@/components/customs-table"
import { CargoTypesTable } from "@/components/cargo-types-table"
import { ContainerTypesTable } from "@/components/container-types-table"
import { InterestPointsTable } from "@/components/interest-points-table"
import { TradersTable } from "@/components/traders-table"
import { ExportadoresTable } from "@/components/shippers-table"
import { ImportadoresTable } from "@/components/consignees-table"
import { AtaTable } from "@/components/ata-table"
import { DispatchersTable } from "@/components/dispatchers-table"
import { IngressAgenciesTable } from "@/components/ingress-agencies-table"
import { DepotsTable } from "@/components/depots-table"
import { ArmadoresPortuariosTable } from "@/components/armadores-portuarios-table"
import {
  Globe,
  MapPin,
  Building2,
  Anchor,
  Package,
  Container,
  Target,
  Users,
  Truck,
  UserCheck,
  MapPinned,
  FileText,
  UserCog,
  Building,
  Warehouse,
  ArrowLeft,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type EntityType =
  | "countries"
  | "provinces"
  | "cities"
  | "customs"
  | "interest-points"
  | "depots"
  | "cargo-types"
  | "container-types"
  | "traders"
  | "shippers"
  | "consignees"
  | "ata"
  | "dispatchers"
  | "ingress-agencies"
  | "armadores-portuarios"

interface EntityConfig {
  id: EntityType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
}

const locationEntities: EntityConfig[] = [
  {
    id: "countries",
    title: "Países",
    description: "Gestión de países disponibles en el sistema",
    icon: Globe,
    component: CountriesTable,
  },
  {
    id: "provinces",
    title: "Provincias",
    description: "Administra provincias y estados por país",
    icon: MapPin,
    component: ProvincesTable,
  },
  {
    id: "cities",
    title: "Ciudades",
    description: "Administra ciudades por provincia",
    icon: Building2,
    component: CitiesTable,
  },
  {
    id: "customs",
    title: "Aduanas",
    description: "Gestión de aduanas con ubicación y coordenadas",
    icon: Anchor,
    component: CustomsTable,
  },
  {
    id: "interest-points",
    title: "Puntos de Interés",
    description: "Administra puntos de interés con ubicación y tipo",
    icon: Target,
    component: InterestPointsTable,
  },
  {
    id: "depots",
    title: "Depósitos",
    description: "Administra depósitos con ubicación y coordenadas",
    icon: Warehouse,
    component: DepotsTable,
  },
]

const cargoEntities: EntityConfig[] = [
  {
    id: "cargo-types",
    title: "Tipos de Carga",
    description: "Administra los diferentes tipos de carga disponibles",
    icon: Package,
    component: CargoTypesTable,
  },
  {
    id: "container-types",
    title: "Tipos de Contenedor",
    description: "Gestión de tipos de contenedor con especificaciones",
    icon: Container,
    component: ContainerTypesTable,
  },
]

const commercialEntities: EntityConfig[] = [
  {
    id: "traders",
    title: "Traders",
    description: "Administra traders con información de contacto",
    icon: Users,
    component: TradersTable,
  },
  {
    id: "shippers",
    title: "Exportadores",
    description: "Gestión de exportadores con información de ubicación",
    icon: Truck,
    component: ExportadoresTable,
  },
  {
    id: "consignees",
    title: "Importadores",
    description: "Administra importadores con información de ubicación",
    icon: UserCheck,
    component: ImportadoresTable,
  },
  {
    id: "ata",
    title: "ATA",
    description: "Gestión de ATA con información de contacto",
    icon: FileText,
    component: AtaTable,
  },
  {
    id: "dispatchers",
    title: "Despachantes",
    description: "Administra despachantes con información de ubicación",
    icon: UserCog,
    component: DispatchersTable,
  },
  {
    id: "ingress-agencies",
    title: "Agencias de Ingreso",
    description: "Gestión de agencias de ingreso con información de contacto",
    icon: Building,
    component: IngressAgenciesTable,
  },
  {
    id: "armadores-portuarios",
    title: "Armadores Portuarios",
    description: "Gestión de armadores portuarios con información de contacto",
    icon: Anchor,
    component: ArmadoresPortuariosTable,
  },
]

export default function ParametrizacionPage() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(null)

  const renderEntityComponent = () => {
    if (!selectedEntity) return null

    const allEntities = [...locationEntities, ...cargoEntities, ...commercialEntities]
    const entity = allEntities.find((e) => e.id === selectedEntity)

    if (!entity) return null

    const Component = entity.component
    const Icon = entity.icon

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedEntity(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{entity.title}</h2>
              <p className="text-sm text-muted-foreground">{entity.description}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <Component />
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderEntityGrid = (entities: EntityConfig[], title: string, description: string) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {entities.map((entity) => {
          const Icon = entity.icon
          return (
            <Card
              key={entity.id}
              className="cursor-pointer transition-all hover:shadow-md hover:scale-105 border-2 hover:border-primary/20"
              onClick={() => setSelectedEntity(entity.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{entity.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">{entity.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  if (selectedEntity) {
    return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{renderEntityComponent()}</div>
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Parametrización</h2>
        </div>
        <p className="text-muted-foreground">Gestión de datos maestros del sistema organizados por categorías</p>
      </div>

      <div className="space-y-8">
        {renderEntityGrid(
          locationEntities,
          "📍 Ubicaciones y Geografía",
          "Gestión de datos geográficos, ubicaciones y puntos de referencia",
        )}

        {renderEntityGrid(
          cargoEntities,
          "📦 Tipos de Carga",
          "Configuración de tipos de carga y especificaciones de tipos de contenedor",
        )}

        {renderEntityGrid(
          commercialEntities,
          "🏢 Entidades Comerciales",
          "Gestión de empresas, contactos y entidades del proceso logístico",
        )}
      </div>
    </div>
  )
}
