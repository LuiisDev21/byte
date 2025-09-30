# Byte Chat

**Asistente AI especializado en perros para Nicaragua**

Byte Chat es una aplicación web de chat inteligente que proporciona orientación especializada sobre el cuidado, salud, comportamiento y bienestar de perros, adaptada específicamente al contexto nicaragüense.


## Tech Stack

### Frontend
- **Next.js 15.5.4** - Framework React con App Router
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático

### Backend & AI
- **Vercel AI SDK** - Integración con modelos de IA
- **Google AI (Gemini)** - Modelo de lenguaje principal
- **Edge Runtime** - Ejecución optimizada en el edge

### Componentes
- **React Markdown** - Renderizado de markdown

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/chat/          # API endpoint para el chat
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal del chat
├── components/            # Componentes React reutilizables
│   ├── chat-composer.tsx # Campo de entrada de mensajes
│   ├── chat-message.tsx  # Componente individual de mensaje
│   ├── chat-messages.tsx # Lista de mensajes del chat
│   ├── empty-state.tsx   # Estado vacío inicial
│   ├── layout-shell.tsx  # Shell principal
│   ├── markdown.tsx      # Renderizador de markdown
│   └── ...              # Otros componentes
├── config/               # Configuración de la aplicación
│   └── ai.ts            # Configuración del modelo AI y prompts
├── hooks/               # Hooks personalizados de React
│   ├── use-chat.ts     # Hook principal del chat con streaming
│   └── use-auto-scroll.ts # Auto-scroll del chat
├── lib/                # Utilidades y helpers
└── types/              # Definiciones de tipos TypeScript
```

## Configuración y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm
- Clave API de Google AI (Gemini)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd byte-chat
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
```

Editar `.env.local`:
```env
GOOGLE_GENERATIVE_AI_API_KEY=tu_clave_api_aqui
DEFAULT_MODEL=gemini-2.5-flash
```

4. **Ejecutar en desarrollo**
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo con Turbopack
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting con ESLint
```

## Arquitectura del Chat

### Flujo de Datos

1. **Usuario escribe mensaje** → `ChatComposer`
2. **Hook `useChat`** maneja el estado y envía a `/api/chat`
3. **API Route** procesa con Google AI y retorna stream
4. **Respuesta streaming** se actualiza en tiempo real
5. **`ChatMessages`** renderiza la conversación

### Componentes Clave

#### `useChat` Hook
- Maneja estado del chat (mensajes, input, loading)
- Implementa streaming de respuestas (texto plano y SSE)
- Control de cancelación con AbortController
- Manejo de errores robusto

#### `ChatComposer`
- Campo de entrada con validación
- Integración con el layout

#### `ChatMessage`
- Renderizado individual de mensajes
- Soporte para markdown en respuestas del asistente

#### `LayoutShell`
- Shell principal de la aplicación
- Context provider para estado UI

## Configuración de IA

### Modelo Principal
- **Gemini 2.5 Flash** - Modelo rápido y eficiente de Google
- **Temperatura**: 0.7 (balance creatividad/precisión)
- **Streaming**: Respuestas en tiempo real

### Prompt del Sistema
El asistente está configurado con un prompt especializado que:
- Limita respuestas exclusivamente a temas de perros
- Adapta consejos al contexto nicaragüense
- Prioriza seguridad (no da dosis ni diagnósticos)
- Maneja emergencias dirigiendo a veterinarios
- Usa español nicaragüense y unidades métricas

## Performance
- **Edge Runtime** para respuestas rápidas
- **Streaming** para percepción de velocidad
- **Turbopack** para desarrollo optimizado

## Despliegue

### Vercel (Recomendado)
1. Conectar repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático en cada push

### Variables de Entorno Requeridas
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
DEFAULT_MODEL=gemini-2.5-flash
SYSTEM_PROMPT=optional_custom_prompt
```

## Contribución

### Flujo de Desarrollo
1. **Fork** del repositorio
2. **Crear rama** para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commits** descriptivos siguiendo [Conventional Commits](https://conventionalcommits.org/)
4. **Push** y crear **Pull Request**

### Estándares de Código
- **TypeScript** estricto - todos los tipos definidos
- **ESLint** - configuración Next.js
- **Prettier** - formateo automático
- **Componentes** - un componente por archivo
- **Hooks** - lógica reutilizable extraída


## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.



