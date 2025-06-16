"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReportsChart() {
  const monthlyData = [
    { name: "Ene", cargas: 65, entregas: 63 },
    { name: "Feb", cargas: 59, entregas: 60 },
    { name: "Mar", cargas: 80, entregas: 77 },
    { name: "Abr", cargas: 81, entregas: 79 },
    { name: "May", cargas: 56, entregas: 58 },
    { name: "Jun", cargas: 55, entregas: 56 },
    { name: "Jul", cargas: 40, entregas: 42 },
  ]

  const performanceData = [
    { name: "Ene", eficiencia: 85, tiempoPromedio: 4.2 },
    { name: "Feb", eficiencia: 87, tiempoPromedio: 4.0 },
    { name: "Mar", eficiencia: 89, tiempoPromedio: 3.8 },
    { name: "Abr", eficiencia: 90, tiempoPromedio: 3.6 },
    { name: "May", eficiencia: 91, tiempoPromedio: 3.4 },
    { name: "Jun", eficiencia: 92, tiempoPromedio: 3.3 },
    { name: "Jul", eficiencia: 92, tiempoPromedio: 3.2 },
  ]

  const typeData = [
    { name: "Nacional", cantidad: 245 },
    { name: "Internacional", cantidad: 156 },
    { name: "Peligrosa", cantidad: 42 },
    { name: "Refrigerada", cantidad: 78 },
    { name: "Frágil", cantidad: 65 },
  ]

  return (
    <Tabs defaultValue="volumen">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="volumen">Volumen</TabsTrigger>
        <TabsTrigger value="rendimiento">Rendimiento</TabsTrigger>
        <TabsTrigger value="tipos">Tipos de Carga</TabsTrigger>
      </TabsList>
      <TabsContent value="volumen" className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cargas" fill="#00334a" name="Cargas Registradas" />
              <Bar dataKey="entregas" fill="#4caf50" name="Entregas Completadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="rendimiento" className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" domain={[80, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[3, 5]} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="eficiencia"
                stroke="#00334a"
                name="Eficiencia (%)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tiempoPromedio"
                stroke="#ff9800"
                name="Tiempo Promedio (días)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="tipos" className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#00334a" name="Cantidad de Cargas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
