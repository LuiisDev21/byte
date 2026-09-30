/**
 * Tipos y constantes para la configuración de proveedores personalizados (BYOK - Bring Your Own Key)
 * y selección de modelos de IA guardados en el navegador del usuario.
 */

export interface ProveedorPersonalizadoConfig {
  nombre: string
  baseURL: string
  apiKey: string
  modelosDisponibles: string[]
  modeloSeleccionado: string
  activo: boolean
}

export interface PresetProveedor {
  id: string
  nombre: string
  baseURL: string
  descripcion: string
  placeholderKey: string
}

export const PRESETS_PROVEEDORES: PresetProveedor[] = [
  {
    id: "openrouter",
    nombre: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1",
    descripcion: "Acceso a cientos de modelos (OpenAI, Claude, Llama, DeepSeek, etc.)",
    placeholderKey: "sk-or-v1-...",
  },
  {
    id: "groq",
    nombre: "Groq",
    baseURL: "https://api.groq.com/openai/v1",
    descripcion: "Inferencia ultrarrápida LPU (Llama 3, Mixtral, Gemma)",
    placeholderKey: "gsk_...",
  },
  {
    id: "deepseek",
    nombre: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    descripcion: "Modelos DeepSeek Chat (V3) y DeepSeek Reasoner (R1)",
    placeholderKey: "sk-...",
  },
  {
    id: "ollama",
    nombre: "Ollama (Local)",
    baseURL: "http://localhost:11434/v1",
    descripcion: "Modelos locales ejecutados en tu propia máquina (sin coste)",
    placeholderKey: "ollama (opcional)",
  },
  {
    id: "openai",
    nombre: "OpenAI Directo",
    baseURL: "https://api.openai.com/v1",
    descripcion: "Modelos oficiales de OpenAI (GPT-4o, GPT-4o-mini, o1, o3)",
    placeholderKey: "sk-proj-...",
  },
  {
    id: "personalizado",
    nombre: "Otro (Compatible)",
    baseURL: "",
    descripcion: "Cualquier endpoint compatible con la especificación de OpenAI",
    placeholderKey: "Clave de API del proveedor",
  },
]

export const MODELOS_PREDETERMINADOS_SERVIDOR = [
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "qwen/qwen3.8-27b:free",
]
