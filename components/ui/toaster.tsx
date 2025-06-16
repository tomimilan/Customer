"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle } from "lucide-react"
import React from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  React.useEffect(() => {
    if (toasts.length > 0) {
      const lastToast = toasts[0]
      if (
        lastToast.title &&
        (typeof lastToast.title === "string") &&
        (lastToast.title.toLowerCase().includes("asignado") ||
          lastToast.title.toLowerCase().includes("asignada") ||
          lastToast.title.toLowerCase().includes("cambiado"))
      ) {
        const timeout = setTimeout(() => {
          dismiss(lastToast.id)
        }, 2500)
        return () => clearTimeout(timeout)
      }
    }
  }, [toasts, dismiss])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isSuccess =
          title &&
          typeof title === "string" &&
          (title.toLowerCase().includes("asignado") ||
            title.toLowerCase().includes("asignada") ||
            title.toLowerCase().includes("cambiado"))
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle>
                  <span className="flex items-center gap-2">
                    {isSuccess && <CheckCircle className="text-green-600 w-5 h-5" />}
                    {title}
                  </span>
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
