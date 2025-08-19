export interface Visit {
  id: string
  title: string
  date: Date
  time: string
  status: "planned" | "in-progress" | "completed"
  assignee: string
  store: string
  address: string
  duration: number
  actualDuration?: number
  priority: "low" | "medium" | "high" | "urgent"
  notes?: string
  progress: number
  startTime?: Date
  pausedTime?: number
  isActive?: boolean
  tasks?: {
    id: string
    name: string
    completed: boolean
    photos?: string[]
  }[]
  photos?: string[]
}

// Sample visits data - shared between calendar and visits pages
export const visitsData: Visit[] = [
  {
    id: "1",
    title: "ECI Sanchinarro",
    date: new Date(2025, 6, 20), // July 20, 2025
    time: "09:30",
    status: "completed",
    assignee: "María García",
    store: "ECI Sanchinarro",
    address: "C/ de Alcalá, 658, 28022 Madrid",
    duration: 120,
    actualDuration: 115,
    priority: "high",
    notes: "Verificar displays de productos nuevos y actualizar precios promocionales",
    progress: 100,
    tasks: [
      { id: "1", name: "Check product displays", completed: true },
      { id: "2", name: "Verify pricing accuracy", completed: true },
      { id: "3", name: "Take photos of new products", completed: true },
    ],
  },
  {
    id: "2",
    title: "Carrefour Alcalá",
    date: new Date(2025, 6, 20), // July 20, 2025
    time: "14:30",
    status: "in-progress",
    assignee: "Carlos López",
    store: "Carrefour Alcalá",
    address: "Av. de América, 7, 28002 Madrid",
    duration: 90,
    priority: "medium",
    notes: "Inspección rutinaria de lineales",
    progress: 60,
    startTime: new Date(Date.now() - 45 * 60 * 1000), // Started 45 minutes ago
    isActive: true,
    tasks: [
      { id: "1", name: "Inventory check", completed: true },
      { id: "2", name: "Price verification", completed: true },
      { id: "3", name: "Staff interview", completed: false },
    ],
  },
  {
    id: "3",
    title: "Día Malasaña",
    date: new Date(2025, 6, 20), // July 20, 2025
    time: "17:00",
    status: "planned",
    assignee: "Ana Martínez",
    store: "Día Malasaña",
    address: "C/ de Fuencarral, 45, 28004 Madrid",
    duration: 60,
    priority: "low",
    progress: 0,
    tasks: [
      { id: "1", name: "Store layout check", completed: false },
      { id: "2", name: "Product availability", completed: false },
    ],
  },
  {
    id: "4",
    title: "Mercadona Chamberí",
    date: new Date(2025, 6, 20), // July 20, 2025
    time: "19:30",
    status: "planned",
    assignee: "Luis Rodríguez",
    store: "Mercadona Chamberí",
    address: "C/ de Bravo Murillo, 123, 28003 Madrid",
    duration: 75,
    priority: "medium",
    progress: 0,
    tasks: [
      { id: "1", name: "Compliance verification", completed: false },
      { id: "2", name: "Documentation review", completed: false },
    ],
  },
]

// Helper function to get a visit by ID
export const getVisitById = (id: string): Visit | undefined => {
  return visitsData.find((visit) => visit.id === id)
}

// Helper function to update a visit
export const updateVisit = (updatedVisit: Visit) => {
  const index = visitsData.findIndex((visit) => visit.id === updatedVisit.id)
  if (index !== -1) {
    visitsData[index] = updatedVisit
  }
}

// Helper function to add a new visit
export const addVisit = (newVisit: Visit) => {
  visitsData.push(newVisit)
}

// Helper function to delete a visit
export const deleteVisit = (visitId: string) => {
  const index = visitsData.findIndex((visit) => visit.id === visitId)
  if (index !== -1) {
    visitsData.splice(index, 1)
  }
}
