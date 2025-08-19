"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Suggestion {
  id: string
  title: string
  description: string
  type: "insight" | "action" | "alert"
  priority: "high" | "medium" | "low"
}

const initialSuggestions: Suggestion[] = [
  {
    id: "1",
    title: "Oportunidad de crecimiento en Mercadona",
    description: "Las ventas de Oreo han aumentado un 23% en las últimas 4 semanas en tiendas Mercadona.",
    type: "insight",
    priority: "high",
  },
  {
    id: "2",
    title: "Revisar precios en Carrefour",
    description: "Se detectaron discrepancias de precios en 3 productos en tiendas Carrefour de Madrid.",
    type: "alert",
    priority: "medium",
  },
  {
    id: "3",
    title: "Programar visitas adicionales",
    description: "Considera programar visitas extra en tiendas con bajo compliance este mes.",
    type: "action",
    priority: "low",
  },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "¡Hola! Soy tu asistente de IA para retail analytics. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [suggestions] = useState<Suggestion[]>(initialSuggestions)

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("ventas") || input.includes("sales")) {
      return "Basándome en los datos actuales, las ventas han mostrado un crecimiento del 15% este mes. Las categorías con mejor rendimiento son Galletas (+23%) y Untables (+18%). ¿Te gustaría que analice alguna cadena específica?"
    }

    if (input.includes("visitas") || input.includes("visits")) {
      return "Tienes 12 visitas programadas para esta semana. El 85% están completadas a tiempo. Te recomiendo priorizar las visitas a tiendas Carrefour donde hemos detectado algunas discrepancias de precios."
    }

    if (input.includes("precios") || input.includes("prices")) {
      return "He detectado algunas variaciones de precios en 3 tiendas. Los productos afectados son Oreo Original (diferencia de €0.15) y Nutella 400g (diferencia de €0.30). ¿Quieres que genere un reporte detallado?"
    }

    return "Entiendo tu consulta. Basándome en los datos disponibles, puedo ayudarte con análisis de ventas, programación de visitas, monitoreo de precios y insights de rendimiento. ¿Hay algo específico que te gustaría explorar?"
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "insight":
        return <TrendingUp className="w-4 h-4" />
      case "action":
        return <Target className="w-4 h-4" />
      case "alert":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Sparkles className="w-4 h-4" />
    }
  }

  const getSuggestionColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200 text-red-800"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "low":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Always visible */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Asistente IA</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Impulsado por IA
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {message.type === "user" && (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3">
                  <Input
                    placeholder="Pregúntame sobre ventas, visitas, precios o cualquier insight..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Sidebar */}
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sugerencias Inteligentes</h2>

              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${getSuggestionColor(suggestion.priority)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getSuggestionIcon(suggestion.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1">{suggestion.title}</h3>
                          <p className="text-xs opacity-80 line-clamp-2">{suggestion.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Accesos Rápidos</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Análisis de Ventas
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programar Visitas
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Monitoreo de Tiendas
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Objetivos y KPIs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
