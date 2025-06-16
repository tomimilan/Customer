"use client"
import { TableHead } from "@/components/ui/table"
import { ArrowDown, ArrowUp, ArrowUpDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Interfaz compatible con ambos formatos de propiedades
interface SortableHeaderProps {
  label: string
  icon: LucideIcon
  sortKey: string
  // Para compatibilidad con TransportTable, VehiclesTable, etc.
  sortConfig?: {
    key: string
    direction: "asc" | "desc" | null
  }
  onSort?: ((newSortConfig: { key: string; direction: "asc" | "desc" | null }) => void) | ((key: string) => void)
  // Para compatibilidad con el formato usado en las otras tablas
  column?: string
  currentSort?: string | null
  direction?: "asc" | "desc" | null
  className?: string
}

export function SortableHeader({
  label,
  icon: Icon,
  sortKey,
  sortConfig,
  onSort,
  column,
  currentSort,
  direction,
  className,
}: SortableHeaderProps) {
  // Determinar si está activo según el formato que se esté usando
  const isActive = sortConfig ? sortConfig.key === sortKey : currentSort === sortKey
  // Determinar la dirección según el formato que se esté usando
  const currentDirection = sortConfig ? sortConfig.direction : direction

  const handleSort = () => {
    if (sortConfig && onSort) {
      // Formato para TransportTable, etc.
      let newDirection: "asc" | "desc" | null = "asc"
      
      if (sortConfig.key === sortKey) {
        if (sortConfig.direction === "asc") {
          newDirection = "desc"
        } else if (sortConfig.direction === "desc") {
          newDirection = null
        }
      }
      
      (onSort as (newSortConfig: { key: string; direction: "asc" | "desc" | null }) => void)({ 
        key: sortKey, 
        direction: newDirection 
      })
    } else if (currentSort !== undefined && column) {
      // Formato para otras tablas
      if (onSort) (onSort as (key: string) => void)(sortKey)
    }
  }

  return (
    <TableHead className={cn("cursor-pointer select-none", className)} onClick={handleSort}>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <span>{label}</span>
        <div className="ml-1">
          {isActive ? (
            currentDirection === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 text-gray-300" />
          )}
        </div>
      </div>
    </TableHead>
  )
}
