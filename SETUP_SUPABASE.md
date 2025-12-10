# Configuración de Supabase

``IMPORTANTE: Debes ejecutar este SQL en Supabase antes de usar la aplicación``

### Paso 1: Ve a tu proyecto en Supabase
1. Abre https://supabase.com
2. Selecciona tu proyecto: `XXXXXXXXXXXXXX`

### Paso 2: Abre el SQL Editor
1. En el menú lateral, haz clic en "SQL Editor"
2. Haz clic en "New query"

### Paso 3: Copia y pega este SQL completo

```sql
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT DEFAULT 'Nueva conversación',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
  rol TEXT NOT NULL CHECK (rol IN ('user', 'assistant', 'system')),
  contenido JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario ON conversaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_created_at ON mensajes(created_at);

-- Row Level Security (RLS) para Supabase
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios actualizan su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios ven sus conversaciones" ON conversaciones;
DROP POLICY IF EXISTS "Usuarios ven mensajes de sus conversaciones" ON mensajes;

-- Políticas RLS: usuarios solo ven sus propios datos
CREATE POLICY "Usuarios ven su propio perfil"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios actualizan su propio perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su propio perfil"
  ON usuarios FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuarios ven sus conversaciones"
  ON conversaciones FOR ALL
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios ven mensajes de sus conversaciones"
  ON mensajes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversaciones
      WHERE conversaciones.id = mensajes.conversacion_id
      AND conversaciones.usuario_id = auth.uid()
    )
  );

-- Función para crear usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar usuarios existentes de auth.users a la tabla usuarios
INSERT INTO public.usuarios (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

### Paso 4: Ejecuta el SQL
1. Haz clic en el botón "Run" (o presiona Ctrl+Enter)
2. Verifica que no haya errores en la consola

### Paso 5: Habilita Email Authentication
1. Ve a "Authentication" → "Providers"
2. Asegúrate de que "Email" esté habilitado
3. Configura las opciones según tus necesidades

## Verificación

Después de ejecutar el SQL, deberías ver:
- 3 tablas creadas: `usuarios`, `conversaciones`, `mensajes`
- Políticas RLS configuradas
- Trigger para crear usuarios automáticamente
- **IMPORTANTE**: Si ya tienes usuarios registrados en Authentication, verifica que aparezcan en la tabla `usuarios`

### Verificar que los usuarios se sincronizaron:
1. Ve a "Table Editor" → "usuarios"
2. Deberías ver los usuarios que ya están en "Authentication"
3. Si no aparecen, ejecuta manualmente:
```sql
INSERT INTO public.usuarios (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

## Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de haber ejecutado TODO el SQL anterior
- Verifica que las tablas existan en "Table Editor"

### Error: "new row violates row-level security policy"
Este error ocurre cuando intentas registrar un usuario nuevo. **Solución**:

1. Ejecuta el script `ACTUALIZAR_POLITICAS_RLS.sql` para agregar la política faltante
2. O ejecuta manualmente:
```sql
CREATE POLICY "Usuarios pueden insertar su propio perfil"
  ON usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### No puedes crear conversaciones
- Verifica que el usuario esté autenticado
- Revisa la consola del navegador para ver errores específicos
- Asegúrate de que las políticas RLS estén configuradas correctamente
- Verifica que el usuario exista en la tabla `usuarios`
