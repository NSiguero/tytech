"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { 
  Edit, 
  Settings, 
  Users, 
  Save, 
  X, 
  Copy, 
  Mail, 
  Share2,
  UserPlus,
  Crown,
  RefreshCw,
  User,
  Camera,
  Lock,
  LogOut
} from "lucide-react"

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  is_team_manager: boolean
  team_code: string
  team_name: string
}

export default function SettingsPage() {
  // Fetch data on component mount
  useEffect(() => {
    fetchTeamData()
    fetchProfileData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoadingTeam(false)
        return
      }

      const response = await fetch('/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Team data received:', data) // Debug log
        if (data.team) {
          setTeamCode(data.team.team_code)
          setTeamName(data.team.team_name)
        }
        if (data.members) {
          setTeamMembers(data.members)
        }
      } else if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        console.error('Failed to fetch team data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setIsLoadingTeam(false)
    }
  }

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }



  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamCode, setTeamCode] = useState("")
  const [teamName, setTeamName] = useState("")
  const [isLoadingTeam, setIsLoadingTeam] = useState(true)

  // Modal states
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false)

  // Form states
  const [inviteEmail, setInviteEmail] = useState("")





  // Profile states
  const [profile, setProfile] = useState({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    avatar_url: "/placeholder-user.jpg",
    is_active: true
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "bg-gray-200",
    isValid: false
  })



  // Team functions
  const handleInviteMember = () => {
    if (inviteEmail) {
      // Aquí se enviaría la invitación por email
      toast.success(`Invitación enviada a ${inviteEmail}`)
      setInviteEmail("")
      setIsInviteMemberOpen(false)
    }
  }

  // Profile functions
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("No autorizado")
        return
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          avatar_url: profile.avatar_url
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        toast.success("Perfil actualizado correctamente")
        setIsEditingProfile(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Error al actualizar el perfil")
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Error al actualizar el perfil")
    }
  }

  // Password validation function
  const validatePasswordStrength = (password: string) => {
    let score = 0
    let feedback = ""
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    // Determine color and feedback
    let color = "bg-gray-200"
    let isValid = false
    
    if (score <= 2) {
      color = "bg-red-500"
      feedback = "Muy débil"
    } else if (score <= 3) {
      color = "bg-orange-500"
      feedback = "Débil"
    } else if (score <= 4) {
      color = "bg-yellow-500"
      feedback = "Media"
    } else if (score <= 5) {
      color = "bg-blue-500"
      feedback = "Buena"
    } else {
      color = "bg-green-500"
      feedback = "Excelente"
      isValid = true
    }
    
    setPasswordStrength({ score, feedback, color, isValid })
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    
    if (!passwordStrength.isValid) {
      toast.error("La contraseña no cumple con los requisitos de seguridad mínimos")
      return
    }

    if (!passwordData.currentPassword) {
      toast.error("Debes ingresar tu contraseña actual")
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("No autorizado")
        return
      }

      console.log('Attempting to change password...', {
        hasCurrentPassword: !!passwordData.currentPassword,
        hasNewPassword: !!passwordData.newPassword,
        passwordStrength: passwordStrength.isValid,
        tokenExists: !!token
      })

      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('Password change successful:', result)
        toast.success("Contraseña cambiada correctamente")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setIsChangingPassword(false)
        setPasswordStrength({ score: 0, feedback: "", color: "bg-gray-200", isValid: false })
      } else {
        const errorData = await response.json()
        console.error('Password change failed:', errorData)
        toast.error(errorData.error || "Error al cambiar la contraseña")
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error("Error al cambiar la contraseña")
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Aquí se subiría la imagen al servidor
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({ ...profile, avatar_url: e.target?.result as string })
      }
      reader.readAsDataURL(file)
      toast.success("Foto de perfil actualizada")
    }
  }

  // Validate password strength when newPassword changes
  useEffect(() => {
    if (passwordData.newPassword) {
      console.log('Validating password:', passwordData.newPassword)
      validatePasswordStrength(passwordData.newPassword)
    } else {
      setPasswordStrength({ score: 0, feedback: "", color: "bg-gray-200", isValid: false })
    }
  }, [passwordData.newPassword])



  const copyTeamCode = () => {
    navigator.clipboard.writeText(teamCode)
    toast.success("Código del equipo copiado al portapapeles")
  }

  const shareTeamCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Código del Equipo',
        text: `Únete a mi equipo usando este código: ${teamCode}`,
        url: window.location.origin
      })
    } else {
      copyTeamCode()
    }
  }

  const sendTeamCodeEmail = () => {
    const subject = encodeURIComponent('Código para unirse al equipo')
    const body = encodeURIComponent(`Hola,\n\nTe invito a unirte a mi equipo en Retail Analytics Dashboard.\n\nCódigo del equipo: ${teamCode}\n\nSaludos`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Always visible */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Buenas Tardes, {profile?.first_name || "Usuario"}
                </h1>
                <p className="text-gray-600">Aquí puedes gestionar tu perfil y configuración del equipo.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Mi Perfil
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Mi Equipo
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* Profile Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información Personal
                    </CardTitle>
                    {!isEditingProfile && (
                      <Button onClick={() => setIsEditingProfile(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={profile.avatar_url || "/placeholder-user.jpg"}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      />
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {profile.first_name} {profile.last_name}
                      </h3>
                      <p className="text-gray-600">{profile.email}</p>
                      <p className="text-gray-600">@{profile.username}</p>
                      <Badge variant="secondary">{profile.role}</Badge>
                    </div>
                  </div>

                  {/* Profile Form */}
                  {isEditingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellidos</Label>
                        <Input
                          id="lastName"
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Nombre de Usuario</Label>
                        <Input
                          id="username"
                          value={profile.username}
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">El nombre de usuario no se puede cambiar</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Nombre</Label>
                        <p className="text-lg font-semibold text-gray-900">{profile.first_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Apellidos</Label>
                        <p className="text-lg font-semibold text-gray-900">{profile.last_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Nombre de Usuario</Label>
                        <p className="text-lg font-semibold text-gray-900">@{profile.username}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isEditingProfile && (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Change Password Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Cambiar Contraseña
                    </CardTitle>
                    {!isChangingPassword && (
                      <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                        <Lock className="w-4 h-4 mr-2" />
                        Cambiar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isChangingPassword ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Contraseña Actual</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Ingresa tu contraseña actual"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Ingresa tu nueva contraseña"
                        />
                        
                        {/* Password Strength Bar */}
                        {passwordData.newPassword && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Seguridad de la contraseña:</span>
                              <span className={`font-medium ${
                                passwordStrength.score <= 2 ? 'text-red-600' :
                                passwordStrength.score <= 3 ? 'text-orange-600' :
                                passwordStrength.score <= 4 ? 'text-yellow-600' :
                                passwordStrength.score <= 5 ? 'text-blue-600' : 'text-green-600'
                              }`}>
                                {passwordStrength.feedback}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                              ></div>
                            </div>
                            
                            {/* Requirements List */}
                            <div className="text-xs text-gray-500 space-y-1">
                              <div className={`flex items-center gap-2 ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordData.newPassword.length >= 8 ? '✓' : '○'}</span>
                                Mínimo 8 caracteres
                              </div>
                              <div className={`flex items-center gap-2 ${passwordData.newPassword.length >= 12 ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordData.newPassword.length >= 12 ? '✓' : '○'}</span>
                                Idealmente 12+ caracteres
                              </div>
                              <div className={`flex items-center gap-2 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{/[a-z]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                                Al menos una minúscula
                              </div>
                              <div className={`flex items-center gap-2 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{/[A-Z]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                                Al menos una mayúscula
                              </div>
                              <div className={`flex items-center gap-2 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{/[0-9]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                                Al menos un número
                              </div>
                              <div className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{/[^A-Za-z0-9]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                                Al menos un carácter especial
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Repite la nueva contraseña"
                        />
                      </div>
                                              <div className="flex gap-2">
                          <Button 
                            onClick={handleChangePassword}
                            disabled={!passwordStrength.isValid || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.currentPassword}
                            className="flex-1"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Cambiar Contraseña
                          </Button>
                          <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                        
                        {/* Help text */}
                        {!passwordStrength.isValid && passwordData.newPassword && (
                          <p className="text-sm text-red-600 mt-2">
                            La contraseña debe cumplir todos los requisitos de seguridad para poder cambiarla.
                          </p>
                        )}
                        
                        {/* Debug info for development */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                            <div>Estado del botón:</div>
                            <div>• Contraseña válida: {passwordStrength.isValid ? '✓' : '✗'}</div>
                            <div>• Contraseñas coinciden: {passwordData.newPassword === passwordData.confirmPassword ? '✓' : '✗'}</div>
                            <div>• Contraseña actual: {passwordData.currentPassword ? '✓' : '✗'}</div>
                            <div>• Score: {passwordStrength.score}/6</div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Cambia tu contraseña regularmente para mantener tu cuenta segura.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              {isLoadingTeam ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : teamCode && teamName ? (
                <>
                  {/* Team Info Card */}
                  <Card>
                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Información del Equipo
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={fetchTeamData}
                      className="ml-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Nombre del Equipo</Label>
                          <p className="text-lg font-semibold text-gray-900">{teamName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Código del Equipo</Label>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-2 bg-gray-100 rounded-md font-mono text-lg">{teamCode}</code>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={copyTeamCode}>
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={shareTeamCode}>
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={sendTeamCodeEmail}>
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No estás en un equipo</h3>
                    <p className="text-gray-600 mb-4">Únete a un equipo existente o crea uno nuevo para comenzar a colaborar.</p>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Unirse a un Equipo
                    </Button>
                  </CardContent>
                </Card>
              )}

                            {/* Team Members Card - Only show when there's a team */}
              {teamCode && teamName && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Miembros del Equipo
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={fetchTeamData}
                          className="ml-auto"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                      <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invitar Miembro
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invitar Nuevo Miembro</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="invite-email">Email</Label>
                              <Input
                                id="invite-email"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="email@ejemplo.com"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleInviteMember} className="flex-1">
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar Invitación
                              </Button>
                              <Button variant="outline" onClick={() => setIsInviteMemberOpen(false)}>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {member.is_team_manager && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                                <div>
                                  <h3 className="font-medium">{member.name}</h3>
                                  <p className="text-sm text-gray-600">{member.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary">{member.role}</Badge>
                                    <span className="text-xs text-gray-500">
                                      {member.is_team_manager ? 'Team Manager' : 'Team Member'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No hay miembros en el equipo aún.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>


          </Tabs>
        </div>
      </div>


    </div>
  )
}
