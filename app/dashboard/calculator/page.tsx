import CalculatorForm from "@/components/calculator/calculator-form"

export default function CalculatorPage() {
  return (
    <div className="layout-container">
      {/* Header con imagen */}
      <div className="w-full bg-white shadow-md mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Foto%20para%20calculadora.jpg-5yVWygH5BfjD8kaejNKUaBNHGkhJWp.jpeg"
              alt="Equipo de nutrición parenteral automatizado"
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
            <div className="text-right">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-f5nDdo9a88OwB8ZX5sUkbCt01JSPaf.png"
                alt="B Braun Logo"
                className="inline-block h-20 transform scale-150" /* Aumentado 1.5 veces */
              />
            </div>
            <div className="mt-4">
              <h2 className="text-3xl text-green-500 font-medium">CALCULADORA</h2>
              <h1 className="text-4xl text-purple-700 font-bold">NUTRICIÓN HOSPITALARIA</h1>
            </div>
          </div>
        </div>
      </div>

      <CalculatorForm />
    </div>
  )
}
