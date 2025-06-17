"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, TruckIcon, UserIcon, ContainerIcon, Pencil, MoreHorizontal, BadgeCheck, PackageIcon, DollarSign, Calendar, MapPin, FileText, Hash, Ship, Landmark, Clock, BuildingIcon, LockIcon, CheckCircle, ArrowUpDownIcon, PaperclipIcon, Trash2, Upload, ArrowLeft, Users, Star, Search, Phone, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"

interface CargoDetailViewProps {
  cargoId: string
}

interface Viaje {
  id: string
  numero: string
  estado: string
  fechaInicio: string
  fechaFin: string
  empresa?: { id: string; nombre: string } | null
  camion?: string | null
  chofer: { id: string; nombre: string } | null
  contenedor: { id: string; numero: string; tipo: string } | null
  precinto?: string | null
  ata?: string | null
  acoplado?: string | null
  crt?: string | null
  empresaCrt?: string | null
  valorPorCntr?: number | null
}

interface Adjunto {
  id: string
  nombre: string
  tipo: string
  fechaSubida: string
  url: string
}

export function CargoDetailView({ cargoId }: CargoDetailViewProps) {
  const [modalViaje, setModalViaje] = useState<Viaje | null>(null)
  const [modalTipo, setModalTipo] = useState<null | "transporte" | "chofer" | "contenedor" | "estado" | "empresa">(null)
  const [contenedorForm, setContenedorForm] = useState({ numero: "", precinto: "" })
  const [empresaForm, setEmpresaForm] = useState({ empresa: "", ata: "" })
  const [transporteForm, setTransporteForm] = useState({
    empresa: "",
    ata: "",
    camion: "",
    chofer: "",
    acoplado: "",
    crt: "",
    empresaCrt: ""
  })
  const [estadoForm, setEstadoForm] = useState({ estado: "" })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const { toast } = useToast()
  const [instructivoView, setInstructivoView] = useState<{
    viaje: Viaje,
    carga: {
      id: string;
      tipoOperacion: string;
      booking: string;
      numeroOperacion: string;
      participantes: {
        shipper: string;
        consignatario: string;
        trader?: string;
        importador?: string;
        consignee?: string;
        cliente?: string;
      };
      tipoCarga: string;
      tipoContenedor: string;
      tarifa: string;
      origen: string;
      destino: string;
      lugaresIntermedios: string[];
      fechas: {
        carga: string;
        entrega: string;
      };
      estado: string;
      descripcion: string;
      codigoOperacion?: string;
      cantidadViajes?: number;
      lugarAduanaExpo?: string;
      lugarAduanaImpo?: string;
      destinoFinal?: string;
      fechaCarga?: string;
      fechaEntrega?: string;
      fechaDescarga?: string;
      viajes: Viaje[];
    }
  } | null>(null)
  const [instructivoForm, setInstructivoForm] = useState({ empresa: '', tarifa: '', obsTarifa: '' })
  const [adjuntosView, setAdjuntosView] = useState<{ viaje: Viaje } | null>(null)
  const [postulantesView, setPostulantesView] = useState<{ viaje: Viaje } | null>(null)
  const [calificacionView, setCalificacionView] = useState<{ viaje: Viaje } | null>(null)
  const [historialReputacionView, setHistorialReputacionView] = useState<{ postulante: any } | null>(null)
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([
    {
      id: "1",
      nombre: "documento_aduana.pdf",
      tipo: "pdf",
      fechaSubida: "2024-03-15",
      url: "/adjuntos/documento_aduana.pdf"
    },
    {
      id: "2",
      nombre: "foto_contenedor.jpg",
      tipo: "image",
      fechaSubida: "2024-03-14",
      url: "/adjuntos/foto_contenedor.jpg"
    }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [adjuntoAEliminar, setAdjuntoAEliminar] = useState<Adjunto | null>(null)
  const [isMapa, setIsMapa] = useState(false)
  // Estados para calificación de chofer
  const [calificacion, setCalificacion] = useState({
    puntualidad: 0,
    calidad: 0,
    comunicacion: 0,
    estadoCarga: 0,
    experiencia: 0,
    comentarios: ""
  })
  const [erroresCalificacion, setErroresCalificacion] = useState({
    puntualidad: "",
    calidad: "",
    comunicacion: "",
    estadoCarga: "",
    experiencia: "",
    comentarios: ""
  })
  const [cargoDataState, setCargoDataState] = useState<any>(null)

  const handleSetStar = (campo: string, valor: number) => {
    setCalificacion((prev) => ({ ...prev, [campo]: valor }))
    setErroresCalificacion((prev) => ({ ...prev, [campo]: "" }))
  }

  const handleGuardarCalificacion = () => {
    const nuevosErrores: any = {}
    if (calificacion.puntualidad === 0) nuevosErrores.puntualidad = "El campo Puntualidad es requerido"
    if (calificacion.calidad === 0) nuevosErrores.calidad = "El campo Calidad del servicio es requerido"
    if (calificacion.comunicacion === 0) nuevosErrores.comunicacion = "El campo Comunicación es requerido"
    if (calificacion.estadoCarga === 0) nuevosErrores.estadoCarga = "El campo Estado de la carga al llegar es requerido"
    if (calificacion.experiencia === 0) nuevosErrores.experiencia = "El campo Experiencia general es requerido"
    if (!calificacion.comentarios.trim()) nuevosErrores.comentarios = "El campo Comentarios es requerido"
    setErroresCalificacion(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 bg-green-100 rounded-full p-0.5" />
          <span>Calificación guardada exitosamente</span>
        </div>
      ),
      variant: "default"
    })
    setCalificacionView(null)
  }

  // Datos simulados de ejemplo
  const cargoData = {
    id: cargoId,
    tipoOperacion: "Exportación Marítima",
    booking: "BK123456",
    numeroOperacion: "EM-0001",
    participantes: {
      shipper: "Shipper S.A.",
      consignatario: "Consignatario Ltda.",
    },
    tipoCarga: "Mercancía General",
    tipoContenedor: "40' Dry",
    tarifa: "$ 2.500",
    origen: "Puerto de Buenos Aires, Argentina",
    destino: "Bodega Central, Santiago, Chile",
    lugaresIntermedios: ["Depósito Zona Franca, Montevideo, Uruguay"],
    fechas: {
      carga: "2023-07-12",
      entrega: "2023-07-18",
    },
    estado: "En Proceso",
    descripcion: "Carga de productos electrónicos y textiles.",
    viajes: [
      {
        id: "VJ000",
        numero: "01",
        estado: "Finalizado",
        fechaInicio: "2023-07-10",
        fechaFin: "2023-07-11",
        empresa: { id: "EMP001", nombre: "Transportes Rápidos S.A." },
        camion: "ABC123",
        chofer: { id: "CHF001", nombre: "Carlos Rodríguez" },
        contenedor: { id: "CNT001", numero: "CONT1234567", tipo: "40' Dry" },
        precinto: "PRC-98765",
        ata: "ATA-001",
        acoplado: "ACOP-001",
        crt: "CRT-12345",
        empresaCrt: "CRT Express",
        valorPorCntr: 2500
      },
      {
        id: "VJ001",
        numero: "02",
        estado: "En progreso",
        fechaInicio: "2023-07-12",
        fechaFin: "2023-07-13",
        empresa: { id: "EMP001", nombre: "Transportes Rápidos S.A." },
        camion: "ABC123",
        chofer: { id: "CHF001", nombre: "Carlos Rodríguez" },
        contenedor: { id: "CNT001", numero: "CONT1234567", tipo: "40' Dry" },
        precinto: "PRC-98765",
        ata: "ATA-001",
        acoplado: "ACOP-001",
        crt: "CRT-12345",
        empresaCrt: "CRT Express",
        valorPorCntr: 2500
      },
      {
        id: "VJ002",
        numero: "03",
        estado: "Pendiente",
        fechaInicio: "2023-07-14",
        fechaFin: "2023-07-15",
        empresa: null,
        camion: null,
        chofer: null,
        contenedor: null,
        precinto: null,
        ata: null,
        acoplado: null,
        crt: null,
        empresaCrt: null,
        valorPorCntr: null
      },
    ],
  }

  // Opciones de empresa a facturar con CUIT
  const empresasFacturar = [
    { nombre: "Empresa A S.A.", cuit: "30-12345678-9" },
    { nombre: "Empresa B S.A.", cuit: "30-87654321-0" },
    { nombre: "Empresa C S.A.", cuit: "30-11223344-5" },
  ]

  const empresaSeleccionada = empresasFacturar.find(e => e.nombre === instructivoForm.empresa)

  // Datos de ejemplo para los postulantes
  const postulantes = [
    {
      id: "CHF-1001",
      nombre: "Juan Pérez",
      empresa: "Transportes Rápidos S.A.",
      camion: "ABC123",
      acoplado: "XYZ789",
      telefono: "+54 11 2345-6789",
      email: "juan.perez@transportesrapidos.com",
      reputacion: 4,
      cantidadViajes: 23,
      historial: [
        {
          fecha: "2023-07-01",
          viaje: "VJ-001",
          puntualidad: 5,
          calidad: 4,
          comunicacion: 4,
          estadoCarga: 5,
          experiencia: 4,
          comentario: "Excelente servicio, muy puntual y profesional."
        },
        {
          fecha: "2023-06-15",
          viaje: "VJ-002",
          puntualidad: 4,
          calidad: 5,
          comunicacion: 5,
          estadoCarga: 4,
          experiencia: 5,
          comentario: "Muy buen manejo y comunicación constante."
        }
      ]
    },
    {
      id: "CHF-1002",
      nombre: "María González",
      empresa: "Logística del Sur",
      camion: "DEF456",
      acoplado: "UVW123",
      telefono: "+54 351 987-6543",
      email: "maria.gonzalez@logisticasur.com",
      reputacion: 5,
      cantidadViajes: 14,
      historial: [
        {
          fecha: "2023-07-05",
          viaje: "VJ-003",
          puntualidad: 5,
          calidad: 5,
          comunicacion: 5,
          estadoCarga: 5,
          experiencia: 5,
          comentario: "Servicio impecable en todos los aspectos."
        }
      ]
    }
  ]

  // Precargar datos cuando se abre el modal
  useEffect(() => {
    if (modalViaje && modalTipo) {
      if (modalTipo === "contenedor") {
        setContenedorForm({
          numero: modalViaje.contenedor?.numero || "",
          precinto: modalViaje.precinto || ""
        })
      } else if (modalTipo === "transporte") {
        setTransporteForm({
          empresa: modalViaje.empresa?.nombre || "",
          ata: modalViaje.ata || "",
          camion: modalViaje.camion || "",
          chofer: modalViaje.chofer?.nombre || "",
          acoplado: modalViaje.acoplado || "",
          crt: modalViaje.crt || "",
          empresaCrt: modalViaje.empresaCrt || ""
        })
      } else if (modalTipo === "estado") {
        setEstadoForm({ estado: modalViaje.estado })
      }
    }
  }, [modalViaje, modalTipo])

  useEffect(() => {
    setCargoDataState(cargoData)
  }, [])

  function handleAsignarContenedor(e: React.FormEvent) {
    e.preventDefault()
    let newErrors: any = {}
    if (!contenedorForm.numero) newErrors.numero = "El número de contenedor es obligatorio"
    if (!contenedorForm.precinto) newErrors.precinto = "El precinto es obligatorio"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    // Aquí iría la lógica real de asignación
    toast({ title: "Contenedor asignado", description: `Contenedor ${contenedorForm.numero} y precinto ${contenedorForm.precinto} asignados.` })
    setModalViaje(null); setModalTipo(null)
    setContenedorForm({ numero: "", precinto: "" })
  }

  function handleAsignarEmpresa(e: React.FormEvent) {
    e.preventDefault()
    let newErrors: any = {}
    if (!empresaForm.empresa) newErrors.empresa = "La empresa es obligatoria"
    if (!empresaForm.ata) newErrors.ata = "El ATA es obligatorio"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    // Aquí iría la lógica real de asignación
    toast({
      title: "Empresa asignada",
      description: `Empresa ${empresaForm.empresa} y ATA ${empresaForm.ata} asignados.`
    })
    setModalViaje(null); setModalTipo(null)
    setEmpresaForm({ empresa: "", ata: "" })
  }

  function handleAsignarTransporte(e: React.FormEvent) {
    e.preventDefault()
    toast({
      title: "Transporte asignado",
      description: `Transporte asignado correctamente al viaje.`
    })
    setModalViaje(null); setModalTipo(null)
    setTransporteForm({ empresa: "", ata: "", camion: "", chofer: "", acoplado: "", crt: "", empresaCrt: "" })
  }

  function handleCambiarEstado(e: React.FormEvent) {
    e.preventDefault()
    toast({
      title: "Estado cambiado",
      description: `El estado del viaje fue actualizado correctamente.`
    })
    setModalViaje(null); setModalTipo(null)
    setEstadoForm({ estado: "" })
  }

  const handleEliminarAdjunto = (adjunto: Adjunto) => {
    setAdjuntoAEliminar(adjunto)
  }

  const confirmarEliminacion = () => {
    if (adjuntoAEliminar) {
      setAdjuntos(adjuntos.filter(adjunto => adjunto.id !== adjuntoAEliminar.id))
      toast({
        title: "Archivo eliminado",
        description: "El archivo ha sido eliminado correctamente.",
      })
      setAdjuntoAEliminar(null)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      // Simulamos la subida de archivos
      const newAdjuntos = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        nombre: file.name,
        tipo: file.type.includes('pdf') ? 'pdf' : 'image',
        fechaSubida: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }))

      setAdjuntos(prev => [...prev, ...newAdjuntos])
      toast({
        title: "Archivos subidos",
        description: `${files.length} archivo(s) subido(s) correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error al subir archivos",
        description: "Hubo un error al subir los archivos. Por favor, intente nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      // Limpiamos el input
      event.target.value = ''
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      // Simulamos la subida de archivos
      const newAdjuntos = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        nombre: file.name,
        tipo: file.type.includes('pdf') ? 'pdf' : 'image',
        fechaSubida: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }))

      setAdjuntos(prev => [...prev, ...newAdjuntos])
      toast({
        title: "Archivos subidos",
        description: `${files.length} archivo(s) subido(s) correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error al subir archivos",
        description: "Hubo un error al subir los archivos. Por favor, intente nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleSeleccionarPostulante = (postulante: any) => {
    // Buscar el viaje pendiente y actualizar su estado y todos los campos
    setCargoDataState((prev: any) => {
      if (!prev) return prev
      return {
        ...prev,
        viajes: prev.viajes.map((viaje: any) =>
          viaje.estado === "Pendiente"
            ? {
                ...viaje,
                estado: "En progreso",
                chofer: { id: postulante.id, nombre: postulante.nombre },
                camion: postulante.camion,
                empresa: { nombre: postulante.empresa },
                acoplado: postulante.acoplado || "ACOP-002",
                contenedor: { id: "CNT002", numero: "CONT7654321", tipo: "20' Dry" },
                precinto: "PRC-12345",
                ata: "ATA-002",
                crt: "CRT-54321",
                empresaCrt: "CRT Cargo",
                valorPorCntr: 1800
              }
            : viaje
        )
      }
    })
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 bg-green-100 rounded-full p-0.5" />
          <span>Chofer asignado exitosamente</span>
        </div>
      ),
      variant: "default"
    })
    setPostulantesView(null)
  }

  if (instructivoView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img src="/aconcarga.png" alt="Logo Aconcarga" className="w-20 h-20 object-contain rounded bg-white" />
            <div>
              <div className="text-xl font-bold">ORDEN DE TRABAJO Nº</div>
              <div className="text-2xl font-extrabold text-primary">{instructivoView.carga.id}</div>
              <div className="text-xs text-gray-500">NACIONAL</div>
            </div>
          </div>
          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs text-center">Logo empresa a facturar</div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className="font-semibold">FACTURAR:</span>
          <select className="border rounded px-2 py-1" value={instructivoForm.empresa} onChange={e => setInstructivoForm(f => ({ ...f, empresa: e.target.value }))}>
            <option value="">Seleccionar empresa</option>
            {empresasFacturar.map(e => (
              <option key={e.nombre} value={e.nombre}>{e.nombre}</option>
            ))}
          </select>
          {empresaSeleccionada && (
            <span className="ml-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">CUIT: {empresaSeleccionada.cuit}</span>
          )}
        </div>
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">INFORMACIÓN GENERAL</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Tipo de Operación:</div>
            <div className="font-bold">{instructivoView.carga.tipoOperacion || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Booking / Referencia:</div>
            <div className="font-bold">{instructivoView.carga.booking || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Código de Operación:</div>
            <div className="font-bold">{instructivoView.carga.codigoOperacion || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Cantidad de Viajes:</div>
            <div className="font-bold">{instructivoView.carga.cantidadViajes || '-'}</div>
          </div>
        </div>
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">PARTICIPANTES</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Trader:</div>
            <div className="font-bold">{instructivoView.carga.participantes?.trader || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Shipper / Exportador:</div>
            <div className="font-bold">{instructivoView.carga.participantes?.shipper || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Importador / Consignee / Cliente:</div>
            <div className="font-bold">{instructivoView.carga.participantes?.importador || instructivoView.carga.participantes?.consignee || instructivoView.carga.participantes?.cliente || '-'}</div>
          </div>
        </div>
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">INFORMACIÓN DE LA CARGA</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Tipo de Carga:</div>
            <div className="font-bold">{instructivoView.carga.tipoCarga || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Tipo de Contenedor:</div>
            <div className="font-bold">{instructivoView.carga.tipoContenedor || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Tarifa de Referencia:</div>
            <div className="font-bold">{instructivoView.carga.tarifa || '-'}</div>
          </div>
        </div>
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">LUGARES Y FECHAS</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Lugar de Carga:</div>
            <div className="font-bold">{instructivoView.carga.origen || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Lugar de Entrega:</div>
            <div className="font-bold">{instructivoView.carga.destino || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Lugar de Aduana Expo:</div>
            <div className="font-bold">{instructivoView.carga.lugarAduanaExpo || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Lugar de Aduana Impo:</div>
            <div className="font-bold">{instructivoView.carga.lugarAduanaImpo || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Destino Final:</div>
            <div className="font-bold">{instructivoView.carga.destinoFinal || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha de Carga:</div>
            <div className="font-bold">{instructivoView.carga.fechaCarga || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha de Entrega Desde:</div>
            <div className="font-bold">{instructivoView.carga.fechaEntrega || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Fecha de Entrega Hasta:</div>
            <div className="font-bold">{instructivoView.carga.fechaDescarga || '-'}</div>
          </div>
        </div>
        <div className="bg-blue-100 rounded px-4 py-2 font-semibold mb-2">DESCRIPCIÓN DE LA OPERACIÓN:</div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">DEPÓSITO DE RETIRO:</div>
            <div className="font-bold">{instructivoView.carga.origen}</div>
          </div>
          <div>
            <div className="text-gray-500">SHIPPER:</div>
            <div className="font-bold">{instructivoView.carga.participantes.shipper}</div>
          </div>
          <div>
            <div className="text-gray-500">LUGAR DE CARGA:</div>
            <div className="font-bold">{instructivoView.carga.lugaresIntermedios?.[0] || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">TARA:</div>
            <div className="font-bold">NO -</div>
          </div>
          <div>
            <div className="text-gray-500">TRANSPORTE:</div>
            <div className="font-bold">{instructivoView.viaje.empresa?.nombre || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">CONTENEDOR N°:</div>
            <div className="font-bold">{instructivoView.viaje.contenedor?.numero || 'SIN CONFIRMAR'}</div>
          </div>
          <div>
            <div className="text-gray-500">PRECINTO:</div>
            <div className="font-bold">{instructivoView.viaje.precinto || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">VALOR POR CNTR:</div>
            <div className="font-bold">{instructivoView.viaje.valorPorCntr || '-'}</div>
          </div>
          <div>
            <div className="text-gray-500">Tarifa:</div>
            <input className="border rounded px-2 py-1 w-full" value={instructivoForm.tarifa} onChange={e => setInstructivoForm(f => ({ ...f, tarifa: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <div className="text-gray-500">OBSERVACIONES TARIFA:</div>
            <input className="border rounded px-2 py-1 w-full" value={instructivoForm.obsTarifa} onChange={e => setInstructivoForm(f => ({ ...f, obsTarifa: e.target.value }))} />
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-500">OBSERVACIONES:</div>
          <div className="font-bold">{instructivoView.carga.descripcion}</div>
        </div>
        <div className="text-center text-red-600 font-semibold text-sm mb-4">
          ENVIAR FACTURA DENTRO DE LOS 7 DÍAS DE HABER FINALIZADO EL SERVICIO.
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setInstructivoView(null)}>Volver</button>
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={e => { e.preventDefault(); toast({ title: 'Instructivo generado', description: 'El instructivo se generó correctamente.' }) }}>Generar</button>
        </div>
      </div>
    )
  }

  if (adjuntosView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Adjuntos del Viaje {adjuntosView.viaje.numero}</h2>
            <p className="text-muted-foreground">Gestione los documentos e imágenes asociados a este viaje.</p>
          </div>
          <Button variant="outline" onClick={() => setAdjuntosView(null)}>Volver</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección de Subir Archivos */}
          <Card>
            <CardHeader>
              <CardTitle>Subir Nuevos Archivos</CardTitle>
              <CardDescription>Seleccione los archivos que desea adjuntar al viaje.</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isUploading 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex flex-col items-center gap-2 ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-8 w-8 text-primary animate-bounce" />
                      <span className="text-sm text-primary font-medium">
                        Subiendo archivos...
                      </span>
                    </>
                  ) : (
                    <>
                      <PaperclipIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Arrastre archivos aquí o haga clic para seleccionar
                      </span>
                      <span className="text-xs text-gray-500">
                        Formatos permitidos: PDF, DOC, DOCX, JPG, JPEG, PNG
                      </span>
                    </>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Archivos Existentes */}
          <Card>
            <CardHeader>
              <CardTitle>Archivos Adjuntos</CardTitle>
              <CardDescription>Lista de archivos adjuntos al viaje.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adjuntos.map((adjunto) => (
                  <div key={adjunto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className={`h-5 w-5 ${adjunto.tipo === 'pdf' ? 'text-blue-500' : 'text-green-500'}`} />
                      <div>
                        <p className="font-medium">{adjunto.nombre}</p>
                        <p className="text-xs text-gray-500">Subido el {new Date(adjunto.fechaSubida).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(adjunto.url, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleEliminarAdjunto(adjunto)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {adjuntos.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No hay archivos adjuntos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de confirmación de eliminación */}
        <Dialog open={!!adjuntoAEliminar} onOpenChange={(open) => !open && setAdjuntoAEliminar(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar el archivo "{adjuntoAEliminar?.nombre}"?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setAdjuntoAEliminar(null)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmarEliminacion}
              >
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (historialReputacionView) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setHistorialReputacionView(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Historial de Reputación</h1>
            <p className="text-muted-foreground">Evaluaciones anteriores de {historialReputacionView.postulante.nombre}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Información del Chofer</CardTitle>
                <CardDescription>Detalles del chofer evaluado</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Nombre del Chofer</Label>
                  <p className="text-lg font-medium">{historialReputacionView.postulante.nombre}</p>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <p className="text-lg font-medium">{historialReputacionView.postulante.empresa}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Reputación Actual</Label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-5 w-5 ${i < historialReputacionView.postulante.reputacion ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Evaluaciones</CardTitle>
            <CardDescription>Evaluaciones anteriores del chofer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {historialReputacionView.postulante.historial.map((evaluacion: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha</p>
                        <p className="font-medium">{new Date(evaluacion.fecha).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Viaje</p>
                        <p className="font-medium">{evaluacion.viaje}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Puntualidad</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < (evaluacion.puntualidad && evaluacion.puntualidad > 0 ? evaluacion.puntualidad : 3) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Calidad del servicio</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < (evaluacion.calidad && evaluacion.calidad > 0 ? evaluacion.calidad : 3) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Comunicación</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < (evaluacion.comunicacion && evaluacion.comunicacion > 0 ? evaluacion.comunicacion : 3) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estado de la carga al llegar</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < (evaluacion.estadoCarga && evaluacion.estadoCarga > 0 ? evaluacion.estadoCarga : 3) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Experiencia general</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < (evaluacion.experiencia && evaluacion.experiencia > 0 ? evaluacion.experiencia : 3) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Comentario</p>
                        <p className="font-medium">{evaluacion.comentario}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (postulantesView) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setPostulantesView(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Postulantes del Viaje {postulantesView.viaje.numero}</h1>
            <p className="text-muted-foreground">Listado de choferes postulados para este viaje.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Listado de Postulantes</CardTitle>
                <CardDescription>Seleccione un chofer para asignar al viaje.</CardDescription>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar postulantes..."
                      className="pl-10 h-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><span className="flex items-center gap-1"><UserIcon className="h-4 w-4 text-primary" /> Nombre</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><BuildingIcon className="h-4 w-4 text-primary" /> Empresa</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><TruckIcon className="h-4 w-4 text-primary" /> Camión</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><TruckIcon className="h-4 w-4 text-primary" /> Acoplado</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><Phone className="h-4 w-4 text-primary" /> Teléfono</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" /> Email</span></TableHead>
                  <TableHead className="text-center"><span className="flex items-center justify-center gap-1"><TruckIcon className="h-4 w-4 text-primary" /> Cantidad de viajes</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><Star className="h-4 w-4 text-primary" /> Reputación</span></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postulantes.map((postulante) => (
                  <TableRow 
                    key={postulante.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{postulante.nombre}</TableCell>
                    <TableCell>{postulante.empresa}</TableCell>
                    <TableCell>{postulante.camion}</TableCell>
                    <TableCell>{postulante.acoplado}</TableCell>
                    <TableCell>{postulante.telefono}</TableCell>
                    <TableCell>{postulante.email}</TableCell>
                    <TableCell className="text-center">{postulante.cantidadViajes}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < postulante.reputacion ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleSeleccionarPostulante(postulante);
                          }}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aceptar Chofer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setHistorialReputacionView({ postulante });
                          }}>
                            <FileText className="mr-2 h-4 w-4" />
                            Consultar historial de reputación
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (calificacionView) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => setCalificacionView(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Calificar Chofer - Viaje {calificacionView.viaje.numero}</h1>
            <p className="text-muted-foreground">Evalúe el desempeño del chofer en este viaje.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Información del Chofer</CardTitle>
                <CardDescription>Detalles del chofer a calificar</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Nombre del Chofer</Label>
                  <p className="text-lg font-medium">{calificacionView.viaje.chofer?.nombre}</p>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <p className="text-lg font-medium">{calificacionView.viaje.empresa?.nombre}</p>
                </div>
                <div>
                  <Label>Vehículo</Label>
                  <p className="text-lg font-medium">{calificacionView.viaje.camion}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Lugar de origen</Label>
                  <p className="text-lg font-medium">{cargoData.origen}</p>
                </div>
                <div>
                  <Label>Lugar de destino</Label>
                  <p className="text-lg font-medium">{cargoData.destino}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calificación</CardTitle>
            <CardDescription>Evalúe los siguientes aspectos del viaje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Puntualidad</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetStar("puntualidad", star)}
                    >
                      <Star className={`h-5 w-5 ${calificacion.puntualidad >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </Button>
                  ))}
                </div>
                {erroresCalificacion.puntualidad && <p className="text-sm text-red-500 mt-1">{erroresCalificacion.puntualidad}</p>}
              </div>
              <div className="space-y-2">
                <Label>Calidad del servicio</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetStar("calidad", star)}
                    >
                      <Star className={`h-5 w-5 ${calificacion.calidad >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </Button>
                  ))}
                </div>
                {erroresCalificacion.calidad && <p className="text-sm text-red-500 mt-1">{erroresCalificacion.calidad}</p>}
              </div>
              <div className="space-y-2">
                <Label>Comunicación</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetStar("comunicacion", star)}
                    >
                      <Star className={`h-5 w-5 ${calificacion.comunicacion >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </Button>
                  ))}
                </div>
                {erroresCalificacion.comunicacion && <p className="text-sm text-red-500 mt-1">{erroresCalificacion.comunicacion}</p>}
              </div>
              <div className="space-y-2">
                <Label>Estado de la carga al llegar</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetStar("estadoCarga", star)}
                    >
                      <Star className={`h-5 w-5 ${calificacion.estadoCarga >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </Button>
                  ))}
                </div>
                {erroresCalificacion.estadoCarga && <p className="text-sm text-red-500 mt-1">{erroresCalificacion.estadoCarga}</p>}
              </div>
              <div className="space-y-2">
                <Label>Experiencia general</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSetStar("experiencia", star)}
                    >
                      <Star className={`h-5 w-5 ${calificacion.experiencia >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </Button>
                  ))}
                </div>
                {erroresCalificacion.experiencia && <p className="text-sm text-red-500 mt-1">{erroresCalificacion.experiencia}</p>}
              </div>
              <div className="space-y-2">
                <Label>Comentarios</Label>
                <Textarea
                  placeholder="Escriba sus comentarios sobre el viaje..."
                  className="min-h-[100px]"
                  value={calificacion.comentarios}
                  onChange={e => { setCalificacion(f => ({ ...f, comentarios: e.target.value })); setErroresCalificacion(prev => ({ ...prev, comentarios: "" })) }}
                />
                {erroresCalificacion.comentarios && <p className="text-sm text-red-500 mt-1">{erroresCalificacion.comentarios}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCalificacionView(null)}>
                  Cancelar
                </Button>
                <Button className="bg-[#00334a] hover:bg-[#004a6b]" onClick={handleGuardarCalificacion}>
                  Guardar Calificación
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 mb-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <PackageIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Detalles de Carga</h1>
          </div>
          <p className="text-muted-foreground text-base mt-0.5">Información completa de la carga y sus viajes asociados.</p>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">Información General de la Carga</span>
          </div>
          <div className="text-lg font-bold text-black/80">#EM-Aceite-000001</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {/* Columna 1: Booking, Operación, tipo de carga/contenedor/tarifa */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                <FileText className="h-4 w-4 text-primary" /> Booking/Ref.
              </div>
              <div className="font-bold text-base mb-1 flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" /> CRG-1001
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-2">
                <Ship className="h-4 w-4 text-primary" /> Operación
              </div>
              <div className="mb-1">
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold bg-gray-50">
                  <TruckIcon className="h-4 w-4 text-primary" /> Exportación Terrestre
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <PackageIcon className="h-4 w-4" /> Mercancía General
                <ContainerIcon className="h-4 w-4" /> 40' Dry
                <DollarSign className="h-4 w-4" /> $2.500
              </div>
            </div>
            {/* Columna 2: Importador-Exportador, Estado */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                <Users className="h-4 w-4 text-primary" /> Importador-Exportador
              </div>
              <div className="font-bold text-base text-blue-700 leading-tight flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-blue-700" /> COMERCIALIZADORA LA VEREDA SAS
              </div>
              <div className="text-xs text-blue-400 mb-1 ml-6">COMERCIALIZADORA LA VEREDA SAS</div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> Estado Actual
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold mt-1">
                <Clock className="h-4 w-4 text-primary" /> En tránsito
              </span>
            </div>
            {/* Columna 3: Origen y Destino */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <MapPin className="h-4 w-4 text-green-600" /> Origen
                </div>
                <div className="flex items-center gap-2 font-bold text-base mt-1">
                  <Landmark className="h-4 w-4 text-green-600" /> Buenos Aires, Argentina
                </div>
                <div className="text-xs text-gray-400 mt-0.5 ml-6 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" /> 2023-07-12
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <MapPin className="h-4 w-4 text-red-600" /> Destino Final
                </div>
                <div className="flex items-center gap-2 font-bold text-base mt-1">
                  <Landmark className="h-4 w-4 text-red-600" /> Santiago, Chile
                </div>
                <div className="text-xs text-gray-400 mt-0.5 ml-6 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" /> 2023-07-12
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl">Viajes Asociados</CardTitle>
            <CardDescription>Tabla de todos los viajes para esta carga.</CardDescription>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <span className="text-sm text-muted-foreground">Lista</span>
            <Switch checked={isMapa} onCheckedChange={setIsMapa} className="mx-1 align-middle" />
            <span className="text-sm text-muted-foreground">Mapa</span>
          </div>
        </CardHeader>
        {isMapa ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] border rounded-lg p-4 bg-white">
            <Image src="/mapaSeg.png" alt="Mapa Seguridad" width={700} height={400} style={{maxWidth:'100%',height:'auto',borderRadius:'12px',boxShadow:'0 2px 8px #0001'}} />
          </div>
        ) : (
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[48px] text-center"><span className="flex items-center justify-center gap-1"><Hash className="h-4 w-4 text-primary" /> Viaje</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><BuildingIcon className="h-4 w-4 text-primary" /> Empresa</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><TruckIcon className="h-4 w-4 text-primary" /> Camión</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><UserIcon className="h-4 w-4 text-primary" /> Chofer</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><ContainerIcon className="h-4 w-4 text-primary" /> Contenedor</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><LockIcon className="h-4 w-4 text-primary" /> Precinto</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><FileText className="h-4 w-4 text-primary" /> ATA</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><TruckIcon className="h-4 w-4 text-primary" /> Acoplado</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><FileText className="h-4 w-4 text-primary" /> CRT</span></TableHead>
                  <TableHead><span className="flex items-center gap-1"><BuildingIcon className="h-4 w-4 text-primary" /> Empresa CRT</span></TableHead>
                  <TableHead className="text-center"><span className="flex items-center gap-1"><BadgeCheck className="h-4 w-4 text-primary" /> Estado</span></TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(cargoDataState ? cargoDataState.viajes : cargoData.viajes).map((viaje) => (
                  <TableRow key={viaje.id}>
                    <TableCell className="font-medium text-center">{viaje.numero}</TableCell>
                    <TableCell>{viaje.empresa?.nombre || "-"}</TableCell>
                    <TableCell>{viaje.camion || "-"}</TableCell>
                    <TableCell>{viaje.chofer?.nombre || "-"}</TableCell>
                    <TableCell>{viaje.contenedor?.numero || "-"}</TableCell>
                    <TableCell>{viaje.precinto || "-"}</TableCell>
                    <TableCell>{viaje.ata || "-"}</TableCell>
                    <TableCell>{viaje.acoplado || "-"}</TableCell>
                    <TableCell>{viaje.crt || "-"}</TableCell>
                    <TableCell>{viaje.empresaCrt || "-"}</TableCell>
                    <TableCell className="text-center">
                      <span className={
                        viaje.estado === "En tránsito"
                          ? "inline-block rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold"
                          : viaje.estado === "En aduana"
                          ? "inline-block rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-semibold"
                          : viaje.estado === "Pendiente"
                          ? "inline-block rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold"
                          : "inline-block rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold"
                      }>
                        {viaje.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {viaje.estado === "Finalizado" && (
                            <DropdownMenuItem onClick={() => setCalificacionView({ viaje })}>
                              <Star className="mr-2 h-4 w-4" />
                              Calificar Chofer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => { setModalViaje(viaje); setModalTipo("contenedor") }}>
                            <ContainerIcon className="mr-2 h-4 w-4" />
                            Asignar contenedor y precinto
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setModalViaje(viaje); setModalTipo("estado") }}>
                            <ArrowUpDownIcon className="mr-2 h-4 w-4" />
                            Cambiar estado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setInstructivoView({ viaje, carga: cargoData })}>
                            <FileText className="mr-2 h-4 w-4" />
                            Generar instructivo
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAdjuntosView({ viaje })}>
                            <PaperclipIcon className="mr-2 h-4 w-4" />
                            Gestionar adjuntos
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setPostulantesView({ viaje }) }}>
                            <Users className="mr-2 h-4 w-4" />
                            Ver postulantes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {/* Aquí iría la lógica para ver en el mapa */}}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver en el mapa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Modales de edición (simples, solo para ejemplo visual) */}
      {modalViaje && modalTipo && (
        <Dialog open={!!modalViaje} onOpenChange={(open) => { if (!open) { setModalViaje(null); setModalTipo(null); setErrors({}) } }}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            {modalTipo === "contenedor" && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Asignar Contenedor y Precinto</DialogTitle>
                  <DialogDescription>Ingrese el número de contenedor y el precinto para el viaje {modalViaje.numero}.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAsignarContenedor} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroContenedor">N° Contenedor</Label>
                      <Input id="numeroContenedor" value={contenedorForm.numero} onChange={e => setContenedorForm(f => ({ ...f, numero: e.target.value }))} placeholder="Ej: CONT1234567" />
                      {errors.numero && <p className="text-sm text-red-500">{errors.numero}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precinto">Precinto</Label>
                      <Input id="precinto" value={contenedorForm.precinto} onChange={e => setContenedorForm(f => ({ ...f, precinto: e.target.value }))} placeholder="Ej: PRC-98765" />
                      {errors.precinto && <p className="text-sm text-red-500">{errors.precinto}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setModalViaje(null); setModalTipo(null); setErrors({}) }}>Cancelar</Button>
                    <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]">Guardar</Button>
                  </div>
                </form>
              </>
            )}
            {modalTipo === "empresa" && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Asignar Empresa y ATA</DialogTitle>
                  <DialogDescription>Seleccione la empresa y el ATA para el viaje {modalViaje.numero}.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAsignarEmpresa} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Select value={empresaForm.empresa} onValueChange={v => setEmpresaForm(f => ({ ...f, empresa: v }))}>
                        <SelectTrigger className={errors.empresa ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Transportes Rápidos S.A.">Transportes Rápidos S.A.</SelectItem>
                          <SelectItem value="Logística del Sur">Logística del Sur</SelectItem>
                          <SelectItem value="Transportes Andinos">Transportes Andinos</SelectItem>
                          <SelectItem value="Carga Express">Carga Express</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.empresa && <p className="text-sm text-red-500">{errors.empresa}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ata">ATA</Label>
                      <Select value={empresaForm.ata} onValueChange={v => setEmpresaForm(f => ({ ...f, ata: v }))}>
                        <SelectTrigger className={errors.ata ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar ATA" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ATA-001">ATA-001</SelectItem>
                          <SelectItem value="ATA-002">ATA-002</SelectItem>
                          <SelectItem value="ATA-003">ATA-003</SelectItem>
                          <SelectItem value="ATA-004">ATA-004</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.ata && <p className="text-sm text-red-500">{errors.ata}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setModalViaje(null); setModalTipo(null); setErrors({}) }}>Cancelar</Button>
                    <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]">Guardar</Button>
                  </div>
                </form>
              </>
            )}
            {modalTipo === "chofer" && (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Asignar Chofer al Viaje {modalViaje.numero}</DialogTitle>
                  <DialogDescription>Aquí iría el formulario para asignar chofer.</DialogDescription>
                </DialogHeader>
                <Button onClick={() => { setModalViaje(null); setModalTipo(null) }} className="mt-4">Cerrar</Button>
              </div>
            )}
            {modalTipo === "estado" && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Cambiar Estado</DialogTitle>
                  <DialogDescription>Seleccione el nuevo estado para el viaje {modalViaje.numero}.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCambiarEstado} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={estadoForm.estado} onValueChange={v => setEstadoForm({ estado: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setModalViaje(null); setModalTipo(null); setErrors({}) }}>Cancelar</Button>
                    <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]">Guardar</Button>
                  </div>
                </form>
              </>
            )}
            {modalTipo === "transporte" && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Asignar Transporte</DialogTitle>
                  <DialogDescription>Complete los datos de transporte para el viaje {modalViaje.numero}.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAsignarTransporte} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Select value={transporteForm.empresa} onValueChange={v => setTransporteForm(f => ({ ...f, empresa: v }))}>
                        <SelectTrigger className={errors.empresa ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Transportes Rápidos S.A.">Transportes Rápidos S.A.</SelectItem>
                          <SelectItem value="Logística del Sur">Logística del Sur</SelectItem>
                          <SelectItem value="Transportes Andinos">Transportes Andinos</SelectItem>
                          <SelectItem value="Carga Express">Carga Express</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.empresa && <p className="text-sm text-red-500">{errors.empresa}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ata">ATA</Label>
                      <Select value={transporteForm.ata} onValueChange={v => setTransporteForm(f => ({ ...f, ata: v }))}>
                        <SelectTrigger className={errors.ata ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar ATA" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ATA-001">ATA-001</SelectItem>
                          <SelectItem value="ATA-002">ATA-002</SelectItem>
                          <SelectItem value="ATA-003">ATA-003</SelectItem>
                          <SelectItem value="ATA-004">ATA-004</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.ata && <p className="text-sm text-red-500">{errors.ata}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="camion">Camión</Label>
                      <Select value={transporteForm.camion} onValueChange={v => setTransporteForm(f => ({ ...f, camion: v }))}>
                        <SelectTrigger className={errors.camion ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar camión" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ABC123">ABC123</SelectItem>
                          <SelectItem value="DEF456">DEF456</SelectItem>
                          <SelectItem value="GHI789">GHI789</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.camion && <p className="text-sm text-red-500">{errors.camion}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chofer">Chofer</Label>
                      <Select value={transporteForm.chofer} onValueChange={v => setTransporteForm(f => ({ ...f, chofer: v }))}>
                        <SelectTrigger className={errors.chofer ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar chofer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carlos Rodríguez">Carlos Rodríguez</SelectItem>
                          <SelectItem value="María González">María González</SelectItem>
                          <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.chofer && <p className="text-sm text-red-500">{errors.chofer}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="acoplado">Acoplado</Label>
                      <Select value={transporteForm.acoplado} onValueChange={v => setTransporteForm(f => ({ ...f, acoplado: v }))}>
                        <SelectTrigger className={errors.acoplado ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar acoplado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACOP-001">ACOP-001</SelectItem>
                          <SelectItem value="ACOP-002">ACOP-002</SelectItem>
                          <SelectItem value="ACOP-003">ACOP-003</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.acoplado && <p className="text-sm text-red-500">{errors.acoplado}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crt">CRT</Label>
                      <Input id="crt" value={transporteForm.crt} onChange={e => setTransporteForm(f => ({ ...f, crt: e.target.value }))} placeholder="Ej: CRT-12345" />
                      {errors.crt && <p className="text-sm text-red-500">{errors.crt}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresaCrt">Empresa CRT</Label>
                      <Select value={transporteForm.empresaCrt} onValueChange={v => setTransporteForm(f => ({ ...f, empresaCrt: v }))}>
                        <SelectTrigger className={errors.empresaCrt ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar empresa CRT" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CRT Express">CRT Express</SelectItem>
                          <SelectItem value="CRT Cargo">CRT Cargo</SelectItem>
                          <SelectItem value="CRT Andina">CRT Andina</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.empresaCrt && <p className="text-sm text-red-500">{errors.empresaCrt}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setModalViaje(null); setModalTipo(null); setErrors({}) }}>Cancelar</Button>
                    <Button type="submit" className="bg-[#00334a] hover:bg-[#004a6b]">Guardar</Button>
                  </div>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 