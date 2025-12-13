<div align="center">
  <img height="200" src="https://kowinature.es/img/cms/perrito.jpg"  />
</div>

<br>

![Next](https://ziadoua.github.io/m3-Markdown-Badges/badges/NextJS/nextjs1.svg)
![Supabase](https://ziadoua.github.io/m3-Markdown-Badges/badges/Supabase/supabase1.svg)
[![License: MIT](https://ziadoua.github.io/m3-Markdown-Badges/badges/LicenceMIT/licencemit1.svg)](LICENSE)
![Stars](https://m3-markdown-badges.vercel.app/stars/3/2/Luiisdev21/byte)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/LuiisDev21/byte)
# Byte Chat - Asistente AI Experto en perros


###


Byte chat es una aplicacion web de chat con IA construida con **Next.js (App Router)**, que permite conversar con un asistente (Google Gemini vía AI SDK) entrenado para asistir exclusivamente temas relacionados a perros y cuidado canino.

Este repositorio está organizado con una arquitectura en capas (Presentación / Negocio / Datos) para mantener separadas la UI, la lógica de aplicación y el acceso a servicios externos.

## Características

- Chat con respuestas generadas por IA.
- Soporte para mensajes con **texto e imágenes**.
- Modo anónimo: permite usar el chat sin guardar historial.
- Modo autenticado: creación, visualización y eliminación de conversaciones persistidas.
- Persistencia con Supabase (tablas `usuarios`, `conversaciones` y `mensajes`) y RLS.

## Tecnologías

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI (ScrollArea, Separator, Slot)

### Backend (API)

- Rutas de API de Next.js (`src/app/api/...`)
- AI SDK + proveedor de Google (`ai`, `@ai-sdk/google`)

### Datos y autenticación

- Supabase (`@supabase/supabase-js`)
- PostgreSQL (gestionado por Supabase)
- Row Level Security (RLS)

## Requisitos

- Node.js (recomendado: 18+)
- pnpm
- Proyecto de Supabase (URL + anon key)
- API key de Google Generative AI

## Estructura del proyecto

La aplicación usa el App Router de Next en `src/app` y además organiza el código por capas:

```
src/
  app/                         # Rutas Next.js (UI + API)
    api/chat/route.ts          # Endpoint de chat
    chat/                      # Rutas de UI para el chat
    login/                     # Ruta de login
  CapaPresentacion/            # Componentes y páginas (UI)
  CapaNegocio/                 # Hooks, contextos, utilidades
  CapaDatos/                   # Repositorios, configuración, supabase, tipos
```

### Arquitectura por capas (resumen)

- **CapaPresentacion**: componentes y composición visual.
- **CapaNegocio**: estado, hooks y reglas de interacción (ej. chat persistente vs local).
- **CapaDatos**: repositorios, cliente Supabase, tipos y configuración de IA.

## Roles y permisos

### Usuario anónimo

- Puede chatear desde la UI.
- Puede enviar texto e imágenes.
- No guarda conversaciones; el historial se pierde al cerrar el navegador.

### Usuario registrado

- Todo lo anterior.
- Puede guardar conversaciones y ver historial.
- Puede eliminar conversaciones.
- Puede continuar conversaciones desde distintos dispositivos (según sesión de Supabase).

## Configuración

### 1) Instalar dependencias

Este proyecto usa **pnpm**.

```powershell
pnpm install
```

### 2) Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

Notas:

- `NEXT_PUBLIC_*` se expone al cliente. No pongas secretos ahí.
- La clave de Google se usa en el servidor (rutas API). Mantén el archivo `.env.local` fuera de control de versiones.

### 3) Configurar Supabase (SQL + RLS)

Antes de usar el modo autenticado (persistencia), debes crear las tablas y políticas.

Consulta la guía: `SETUP_SUPABASE.md`.

Checklist típico:

- Ejecutar el SQL que crea tablas `usuarios`, `conversaciones`, `mensajes`.
- Activar RLS y políticas.
- Verificar el trigger que sincroniza `auth.users` → `public.usuarios`.
- Confirmar que el proveedor de autenticación por email esté habilitado en Supabase.

## Desarrollo

Ejecuta el servidor de desarrollo:

```powershell
pnpm dev
```

Luego abre la URL que indique la consola (por defecto suele ser `http://localhost:3000`).

## Scripts disponibles

Los scripts vienen definidos en `package.json`:

- `pnpm dev`: desarrollo con Turbopack.
- `pnpm build`: build de producción.
- `pnpm start`: iniciar en modo producción.
- `pnpm lint`: lint con ESLint.

## Despliegue

El proyecto está configurado con `output: 'standalone'` en `next.config.ts`, lo que facilita el despliegue (por ejemplo en Docker o plataformas que soporten modo standalone).

Flujo recomendado:

```powershell
pnpm build
pnpm start
```

## Modelo de datos (Supabase)

Las tablas principales (ver `SETUP_SUPABASE.md`) son:

- `usuarios`: perfil mínimo asociado a `auth.users`.
- `conversaciones`: conversaciones por usuario.
- `mensajes`: mensajes por conversación (rol y contenido JSONB).

El campo `contenido` soporta texto o estructuras con imagen (por ejemplo, contenido multimodal).



## Apéndice: documentación técnica previa

El README anterior contenía diagramas extensos (casos de uso, modelo de procesos, ERD y componentes). Si quieres recuperar esa documentación como un documento aparte (por ejemplo `docs/arquitectura.md`) para mantener el README más enfocado en uso/instalación, puedo migrarla y dejar enlaces desde aquí.

```
┌─────────────────────────────────────────────────────────────────┐
│                        BYTE CHAT - CASOS DE USO                 │
└─────────────────────────────────────────────────────────────────┘

    Usuario Anónimo                    Usuario Registrado
         │                                    │
         │                                    │
         ├──────► Ver Landing Page           │
         │                                    │
         ├──────► Chatear sin guardar        ├──────► Iniciar Sesión
         │                                    │
         ├──────► Enviar Mensajes            ├──────► Registrarse
         │                                    │
         ├──────► Enviar Imágenes            ├──────► Crear Conversación
         │                                    │
         └──────► Ir a Login                 ├──────► Ver Historial
                                              │
                                              ├──────► Eliminar Conversación
                                              │
                                              ├──────► Continuar Conversación
                                              │
                                              └──────► Cerrar Sesión

                            │
                            ▼
                    ┌───────────────┐
                    │  Google AI    │
                    │  (Gemini)     │
                    └───────────────┘
```

### Casos de Uso Detallados

**CU-01: Chatear sin Autenticación**
- Actor: Usuario Anónimo
- Flujo: Usuario → Envía mensaje → Sistema procesa → IA responde
- Postcondición: Conversación no se guarda

**CU-02: Registrarse**
- Actor: Usuario Anónimo
- Flujo: Usuario → Ingresa email/password → Sistema valida → Crea cuenta
- Postcondición: Usuario registrado en el sistema

**CU-03: Iniciar Sesión**
- Actor: Usuario Registrado
- Flujo: Usuario → Ingresa credenciales → Sistema valida → Acceso concedido
- Postcondición: Usuario autenticado, puede ver historial

**CU-04: Crear Conversación**
- Actor: Usuario Registrado
- Flujo: Usuario → Envía primer mensaje → Sistema crea conversación → Guarda en BD
- Postcondición: Conversación guardada con título del primer mensaje

**CU-05: Eliminar Conversación**
- Actor: Usuario Registrado
- Flujo: Usuario → Selecciona conversación → Confirma eliminación → Sistema elimina
- Postcondición: Conversación y mensajes eliminados de BD

---

## 3. Modelo de Procesos

### Flujo Principal: Envío de Mensaje (Usuario Autenticado)

```

┌─────────────────────────────────────────────────────────────────┐
│              PROCESO: ENVÍO DE MENSAJE CON GUARDADO             │
└─────────────────────────────────────────────────────────────────┘

    [INICIO]
       │
       ▼
    ┌─────────────────┐
    │ Usuario escribe │
    │    mensaje      │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐      NO      ┌──────────────────┐
    │ ¿Usuario        ├──────────────►│ Usar chat local  │
    │ autenticado?    │               │ (sin guardar)    │
    └────────┬────────┘               └──────────────────┘
             │ SÍ
             ▼
    ┌─────────────────┐      NO      ┌──────────────────┐
    │ ¿Conversación   ├──────────────►│ Crear nueva      │
    │ activa?         │               │ conversación     │
    └────────┬────────┘               └────────┬─────────┘
             │ SÍ                              │
             │◄────────────────────────────────┘
             ▼
    ┌─────────────────┐
    │ Verificar       │
    │ usuario en BD   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Guardar mensaje │
    │ usuario en BD   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Enviar a API    │
    │ de Google AI    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Recibir         │
    │ respuesta IA    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Guardar         │
    │ respuesta en BD │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Mostrar en UI   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Actualizar      │
    │ lista sidebar   │
    └────────┬────────┘
             │
             ▼
       [FIN]
```

### Flujo Secundario: Registro de Usuario

```

    [INICIO]
       │
       ▼
    ┌─────────────────┐
    │ Usuario ingresa │
    │ email/password  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐      NO      ┌──────────────────┐
    │ ¿Datos válidos? ├──────────────►│ Mostrar error    │
    └────────┬────────┘               └──────────────────┘
             │ SÍ
             ▼
    ┌─────────────────┐
    │ Crear usuario   │
    │ en Auth         │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Trigger crea    │
    │ usuario en BD   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Enviar email    │
    │ confirmación    │
    └────────┬────────┘
             │
             ▼
       [FIN]
```

---

## 4. Arquitectura de Tres Capas

### Estructura del Proyecto

```
byte-chat/
│
├── src/
│   ├── CapaPresentacion/          # CAPA DE PRESENTACIÓN
│   │   ├── componentes/           # Componentes React
│   │   │   ├── ui/                # Componentes base (Button, Input, etc.)
│   │   │   ├── compositor-chat.tsx
│   │   │   ├── mensajes-chat.tsx
│   │   │   ├── sidebar-app.tsx
│   │   │   └── shell-layout.tsx
│   │   └── paginas/               # Páginas de la aplicación
│   │       ├── inicio.tsx         # Landing page
│   │       ├── chat.tsx           # Página de chat
│   │       ├── login.tsx          # Autenticación
│   │       └── layout-raiz.tsx    # Layout principal
│   │
│   ├── CapaNegocio/               # CAPA DE NEGOCIO
│   │   ├── hooks/                 # Hooks personalizados
│   │   │   ├── usar-chat-con-imagenes.ts
│   │   │   ├── usar-chat-persistente.ts
│   │   │   └── usar-desplazamiento-automatico.ts
│   │   ├── contextos/             # Context API
│   │   │   ├── contexto-autenticacion.tsx
│   │   │   └── contexto-conversaciones.tsx
│   │   └── utilidades/            # Funciones auxiliares
│   │
│   └── CapaDatos/                 # CAPA DE DATOS
│       ├── api/                   # API Routes
│       │   └── chat/
│       │       └── route.ts       # Endpoint de chat
│       ├── repositorios/          # Acceso a datos
│       │   ├── conversaciones.ts
│       │   ├── mensajes.ts
│       │   └── usuarios.ts
│       ├── supabase/              # Cliente Supabase
│       │   ├── cliente.ts
│       │   └── tipos.ts
│       ├── configuracion/         # Configuración
│       │   └── ia.ts
│       └── tipos/                 # Tipos TypeScript
│           └── mensaje.ts
```

### Descripción de Capas


####  Capa de Presentación
**Responsabilidad**: Interfaz de usuario y experiencia del usuario

**Componentes Principales**:
- `ShellLayout`: Layout principal con sidebar responsive
- `CompositorChat`: Input para mensajes con soporte de imágenes
- `MensajesChat`: Visualización de mensajes
- `SidebarApp`: Navegación y lista de conversaciones

**Tecnologías**: React, Next.js, TailwindCSS, Framer Motion

####  Capa de Negocio
**Responsabilidad**: Lógica de negocio y gestión de estado

**Componentes Principales**:
- `ProveedorAutenticacion`: Gestión de sesiones
- `ProveedorConversaciones`: Gestión de conversaciones
- `useChatPersistente`: Lógica de chat con persistencia
- `useUsarChatConImagenes`: Lógica de chat local

**Tecnologías**: React Hooks, Context API

####  Capa de Datos
**Responsabilidad**: Acceso y persistencia de datos

**Componentes Principales**:
- `repositorios/`: CRUD operations
- `api/chat/route.ts`: Endpoint para IA
- `supabase/cliente.ts`: Cliente de base de datos

**Tecnologías**: Supabase, PostgreSQL, Google AI SDK

### Flujo de Datos entre Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Páginas    │  │ Componentes  │  │   Layouts    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │             │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE NEGOCIO                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Hooks      │  │  Contextos   │  │  Utilidades  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │             │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Repositorios │  │  API Routes  │  │   Supabase   │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │             │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │PostgreSQL│      │Google AI │      │Supabase  │
    │          │      │  (Gemini)│      │   Auth   │
    └──────────┘      └──────────┘      └──────────┘
```

---

## 5. Diagrama de Componentes

### Componentes Principales y sus Relaciones

```

┌────────────────────────────────────────────────────────────────┐
│                         App (Root)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            ProveedorAutenticacion                        │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │         ProveedorConversaciones                    │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │            ShellLayout                       │  │  │  │
│  │  │  │  ┌────────────┐  ┌──────────────────────┐    │  │  │  │
│  │  │  │  │  Sidebar   │  │      Contenido       │    │  │  │  │
│  │  │  │  │            │  │                      │    │  │  │  │
│  │  │  │  │ ┌────────┐ │  │  ┌────────────────┐  │    │  │  │  │
│  │  │  │  │ │Lista   │ │  │  │  PaginaChat    │  │    │  │  │  │
│  │  │  │  │ │Convs   │ │  │  │                │  │    │  │  │  │
│  │  │  │  │ └────────┘ │  │  │ ┌────────────┐ │  │    │  │  │  │
│  │  │  │  │            │  │  │ │ Mensajes   │ │  │    │  │  │  │
│  │  │  │  │ ┌────────┐ │  │  │ └────────────┘ │  │    │  │  │  │
│  │  │  │  │ │Botones │ │  │  │                │  │    │  │  │  │
│  │  │  │  │ │Login   │ │  │  │ ┌────────────┐ │  │    │  │  │  │
│  │  │  │  │ └────────┘ │  │  │ │ Compositor │ │  │    │  │  │  │
│  │  │  │  │            │  │  │ └────────────┘ │  │    │  │  │  │
│  │  │  │  └────────────┘  └──────────────────────┘    │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

### Componentes UI Reutilizables

┌─────────────────────────────────────────────────────────┐
│                  Componentes UI Base                    │
├─────────────────────────────────────────────────────────┤
│  Button  │  Input  │  Card  │  Label  │  ScrollArea     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Componentes Compuestos                     │
├─────────────────────────────────────────────────────────┤
│  CompositorChat  │  MensajesChat  │  MensajeChat        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                Componentes de Página                    │
├─────────────────────────────────────────────────────────┤
│  PaginaInicio  │  PaginaChat  │  PaginaLogin            │
└─────────────────────────────────────────────────────────┘
```

### Hooks Personalizados

```
┌──────────────────────────────────────────────────────────┐
│                    Hooks de Estado                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  useAutenticacion()                                      │
│  ├─ usuario: User | null                                 │
│  ├─ cargando: boolean                                    │
│  ├─ iniciarSesion(email, password)                       │
│  ├─ registrarse(email, password)                         │
│  └─ cerrarSesion()                                       │
│                                                          │
│  useConversaciones()                                     │
│  ├─ conversaciones: Conversacion[]                       │
│  ├─ conversacionActual: string | null                    │
│  ├─ crearNuevaConversacion()                             │
│  ├─ eliminarConversacionPorId(id)                        │
│  └─ actualizarTitulo(id, titulo)                         │
│                                                          │
│  useChatPersistente()                                    │
│  ├─ mensajes: Mensaje[]                                  │
│  ├─ agregarMensaje(mensaje)                              │
│  └─ limpiarMensajes()                                    │
│                                                          │
│  useUsarChatConImagenes()                                │
│  ├─ mensajes: Mensaje[]                                  │
│  ├─ entrada: string                                      │
│  ├─ imagenSeleccionada: string | null                    │
│  ├─ estaCargando: boolean                                │
│  └─ enviar()                                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Modelo de Datos

### Diagrama Entidad-Relación

```

┌─────────────────────────────────────────────────────────────┐
│                    MODELO DE DATOS                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      usuarios        │
├──────────────────────┤
│ 🔑 id (UUID)         │
│    email (TEXT)      │
│    nombre (TEXT)     │
│    avatar_url (TEXT) │
│    created_at        │
│    updated_at        │
└──────────┬───────────┘
           │
           │ 1:N
           │
           ▼
┌──────────────────────┐
│   conversaciones     │
├──────────────────────┤
│ 🔑 id (UUID)         │
│ 🔗 usuario_id (UUID) │
│    titulo (TEXT)     │
│    created_at        │
│    updated_at        │
└──────────┬───────────┘
           │
           │ 1:N
           │
           ▼
┌──────────────────────┐
│      mensajes        │
├──────────────────────┤
│ 🔑 id (UUID)         │
│ 🔗 conversacion_id   │
│    rol (TEXT)        │
│    contenido (JSONB) │
│    created_at        │
└──────────────────────┘

🔑 = Clave Primaria
🔗 = Clave Foránea
```

### Descripción de Tablas

#### Tabla: usuarios
| Campo      | Tipo   | Descripción                    |
|------------|--------|--------------------------------|
| id         | UUID   | Identificador único (PK)       |
| email      | TEXT   | Email del usuario (UNIQUE)     |
| nombre     | TEXT   | Nombre del usuario (opcional)  |
| avatar_url | TEXT   | URL del avatar (opcional)      |
| created_at | TIMESTAMP | Fecha de creación           |
| updated_at | TIMESTAMP | Fecha de actualización      |

#### Tabla: conversaciones
| Campo      | Tipo   | Descripción                    |
|------------|--------|--------------------------------|
| id         | UUID   | Identificador único (PK)       |
| usuario_id | UUID   | Referencia a usuarios (FK)     |
| titulo     | TEXT   | Título de la conversación      |
| created_at | TIMESTAMP | Fecha de creación           |
| updated_at | TIMESTAMP | Última actualización        |

#### Tabla: mensajes
| Campo          | Tipo   | Descripción                    |
|----------------|--------|--------------------------------|
| id             | UUID   | Identificador único (PK)       |
| conversacion_id| UUID   | Referencia a conversaciones    |
| rol            | TEXT   | 'user', 'assistant', 'system'  |
| contenido      | JSONB  | Contenido del mensaje          |
| created_at     | TIMESTAMP | Fecha de creación           |

### Estructura del Contenido (JSONB)

```json
// Mensaje de texto simple
"Hola, ¿cómo estás?"

// Mensaje con imagen
[
  {
    "type": "text",
    "text": "Mira esta imagen"
  },
  {
    "type": "image",
    "image": "data:image/png;base64,..."
  }
]
```

### Políticas de Seguridad (RLS)

```sql
-- Los usuarios solo pueden ver sus propios datos
usuarios: auth.uid() = id
conversaciones: auth.uid() = usuario_id
mensajes: EXISTS (
  SELECT 1 FROM conversaciones 
  WHERE conversaciones.id = mensajes.conversacion_id 
  AND conversaciones.usuario_id = auth.uid()
)
```


