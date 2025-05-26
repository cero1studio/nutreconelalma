"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ImageButton } from "@/components/ui/image-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, only allow specific credentials
      if (values.email === "info@nutreconelalma.com" && values.password === "Nutre2025##") {
        router.push("/dashboard/calculator")
      } else {
        setError("Credenciales inválidas. Por favor intente nuevamente.")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Por favor intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Usuario"
                  {...field}
                  className="h-12 rounded-full bg-white text-gray-900 placeholder:text-gray-500 border-0"
                  aria-label="Correo electrónico"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500 ml-4" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  {...field}
                  className="h-12 rounded-full bg-white text-gray-900 placeholder:text-gray-500 border-0"
                  aria-label="Contraseña"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500 ml-4" />
            </FormItem>
          )}
        />

        <div className="pt-2 flex justify-center">
          <ImageButton
            type="submit"
            variant="purple"
            text="INGRESAR"
            loading={isLoading}
            className="w-full max-w-[240px]"
          />
        </div>
      </form>
    </Form>
  )
}
