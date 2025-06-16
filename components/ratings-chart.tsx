"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RatingsChart() {
  const ratingDistribution = [
    { rating: "5 estrellas", count: 845, percentage: 68 },
    { rating: "4 estrellas", count: 256, percentage: 20 },
    { rating: "3 estrellas", count: 98, percentage: 8 },
    { rating: "2 estrellas", count: 32, percentage: 3 },
    { rating: "1 estrella", count: 17, percentage: 1 },
  ]

  const ratingTrend = [
    { mes: "Ene", valoracion: 4.5 },
    { mes: "Feb", valoracion: 4.6 },
    { mes: "Mar", valoracion: 4.5 },
    { mes: "Abr", valoracion: 4.7 },
    { mes: "May", valoracion: 4.6 },
    { mes: "Jun", valoracion: 4.8 },
    { mes: "Jul", valoracion: 4.7 },
  ]

  const transportRatings = [
    { nombre: "Transportes Rápidos S.A.", valoracion: 4.8 },
    { nombre: "Logística del Sur", valoracion: 4.6 },
    { nombre: "Transportes Andinos", valoracion: 4.3 },
    { nombre: "Cargas Express", valoracion: 4.1 },
    { nombre: "Transportes del Norte", valoracion: 4.7 },
  ]

  return (
    <Tabs defaultValue="distribucion">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="distribucion">Distribución</TabsTrigger>
        <TabsTrigger value="tendencia">Tendencia</TabsTrigger>
        <TabsTrigger value="transportes">Por Transporte</TabsTrigger>
      </TabsList>
      <TabsContent value="distribucion" className="pt-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00334a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="tendencia" className="pt-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis domain={[3, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="valoracion" stroke="#00334a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="transportes" className="pt-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transportRatings} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis type="category" dataKey="nombre" width={100} />
              <Tooltip />
              <Bar dataKey="valoracion" fill="#00334a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
