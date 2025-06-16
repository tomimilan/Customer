"use client"

import { CargoDetailView } from "@/components/cargo-detail-view"
import { use } from "react"

interface CargoDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CargoDetailPage({ params }: CargoDetailPageProps) {
  const { id } = use(params)
  return (
    <div className="container mx-auto py-6">
      <CargoDetailView cargoId={id} />
    </div>
  )
} 