"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, Users, Plus } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    teamCode: "",
    createNewTeam: false,
    teamName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      window.location.href = "/"
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("") // Clear error when user starts typing
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    })
    setError("") // Clear error when user starts typing
  }

  const validateForm = () => {
    // Check basic required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    
    // Check team-specific validation
    if (formData.createNewTeam && !formData.teamName.trim()) {
      setError("Team name is required when creating a new team")
      return false
    }
    if (!formData.createNewTeam && !formData.teamCode.trim()) {
      setError("Team code is required when joining an existing team")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const requestData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        teamCode: formData.createNewTeam ? null : formData.teamCode,
        createNewTeam: formData.createNewTeam,
        teamName: formData.createNewTeam ? formData.teamName : null,
      };
      
  
      
      const response = await axios.post("/api/auth/register", requestData)
      
      if (response.data.token) {
        setSuccess("Registration successful! Redirecting to login...")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl flex items-center justify-center mr-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Retail Analytics
            </h1>
          </div>
          <p className="text-neutral-600">
            Crea tu cuenta para comenzar
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-white/70 border-neutral-200/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center text-neutral-900">
              Crear Cuenta
            </CardTitle>
            <p className="text-sm text-center text-neutral-600">
              Completa tus datos para crear tu cuenta
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-neutral-700">
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-white/50 border-neutral-200 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-neutral-700">
                    Apellidos
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-white/50 border-neutral-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-neutral-700">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="juanperez"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/50 border-neutral-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/50 border-neutral-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/50 border-neutral-200 focus:border-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-neutral-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-neutral-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-neutral-500">
                  Debe tener al menos 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/50 border-neutral-200 focus:border-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-neutral-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-neutral-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Team Section */}
              <div className="space-y-4 border-t border-neutral-200 pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-neutral-800">Configuración del Equipo</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Team Option Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="joinTeam"
                        name="teamOption"
                        checked={!formData.createNewTeam}
                        onChange={() => setFormData({ ...formData, createNewTeam: false })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="joinTeam" className="text-sm font-medium text-neutral-700">
                        Unirse a un equipo existente
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="createTeam"
                        name="teamOption"
                        checked={formData.createNewTeam}
                        onChange={() => setFormData({ ...formData, createNewTeam: true })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="createTeam" className="text-sm font-medium text-neutral-700">
                        Crear un nuevo equipo
                      </Label>
                    </div>
                  </div>

                  {/* Team Code Input */}
                  {!formData.createNewTeam && (
                    <div className="space-y-2">
                      <Label htmlFor="teamCode" className="text-sm font-medium text-neutral-700">
                        Código del Equipo
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                          id="teamCode"
                          name="teamCode"
                          type="text"
                          placeholder="Ingresa el código de 6 dígitos (ej: ABC123)"
                          value={formData.teamCode}
                          onChange={handleInputChange}
                          className="pl-10 bg-white/50 border-neutral-200 focus:border-blue-500"
                          maxLength={6}
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500">
                        Pregunta a tu gerente de equipo por el código
                      </p>
                    </div>
                  )}

                  {/* Team Name Input */}
                  {formData.createNewTeam && (
                    <div className="space-y-2">
                      <Label htmlFor="teamName" className="text-sm font-medium text-neutral-700">
                        Nombre del Equipo
                      </Label>
                      <div className="relative">
                        <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                          id="teamName"
                          name="teamName"
                          type="text"
                          placeholder="Ingresa el nombre de tu equipo"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          className="pl-10 bg-white/50 border-neutral-200 focus:border-blue-500"
                        />
                      </div>
                      <p className="text-xs text-neutral-500">
                        Serás el gerente del equipo y podrás invitar a otros usando el código generado
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium py-2.5"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Crear Cuenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500">
            © 2024 Panel de Análisis de Retail. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
} 