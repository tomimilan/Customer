"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function DashboardChart() {
  const data = [
    { name: "Ene", cargas: 65, entregas: 63 },
    { name: "Feb", cargas: 59, entregas: 60 },
    { name: "Mar", cargas: 80, entregas: 77 },
    { name: "Abr", cargas: 81, entregas: 79 },
    { name: "May", cargas: 56, entregas: 58 },
    { name: "Jun", cargas: 55, entregas: 56 },
    { name: "Jul", cargas: 40, entregas: 42 },
  ]

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  )
}
