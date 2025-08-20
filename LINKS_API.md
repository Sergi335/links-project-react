# API de Links y Categorías - Documentación

Esta documentación describe todos los endpoints disponibles para la gestión de links y categorías en la API.

## Tabla de Contenidos
- [Autenticación](#autenticación)
- [Endpoints de Links](#endpoints-de-links)
  - [GET Links](#endpoints-get-links)
  - [POST Links](#endpoints-post-links)
  - [PATCH Links](#endpoints-patch-links)
  - [DELETE Links](#endpoints-delete-links)
- [Endpoints de Categorías](#endpoints-de-categorías)
  - [GET Categorías](#endpoints-get-categorías)
  - [POST Categorías](#endpoints-post-categorías)
  - [PATCH Categorías](#endpoints-patch-categorías)
  - [DELETE Categorías](#endpoints-delete-categorías)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Error](#códigos-de-error)

## Autenticación

Todos los endpoints requieren autenticación mediante cookies de sesión:

**Headers requeridos:**
```http
Cookie: session=<session-token>; csrfToken=<csrf-token>
X-CSRF-Token: <csrf-token>
```

---

## Endpoints de Links

### Endpoints GET Links

### 1. Obtener todos los links del usuario

```http
GET /links
```

**Descripción:** Retorna todos los links pertenecientes al usuario autenticado.

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Google",
      "description": "Motor de búsqueda",
      "url": "https://google.com",
      "imgUrl": "https://google.com/favicon.ico",
      "categoryId": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439013",
      "order": 0,
      "bookmark": true,
      "notes": "Link de prueba",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Respuesta sin autenticación (401):**
```json
{
  "error": "NOT COOKIE!"
}
```

---

### 2. Obtener link por ID

```http
GET /links/getbyid/:id
```

**Descripción:** Retorna un link específico por su ID.

**Parámetros URL:**
- `id` (string, requerido): ID del link

**Respuesta exitosa (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Google",
  "description": "Motor de búsqueda",
  "url": "https://google.com",
  "imgUrl": "https://google.com/favicon.ico",
  "categoryId": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439013",
  "order": 0,
  "bookmark": true,
  "notes": "Link de prueba"
}
```

**Respuesta link no encontrado (200):**
```json
{
  "error": "El link no existe"
}
```

**Respuesta ID inválido (400):**
```json
{
  "status": "fail",
  "message": "Validation failed"
}
```

---

### 3. Obtener links por categoría (Desktop)

```http
GET /links/desktop?category=<categoria>
```

**Descripción:** Retorna links filtrados por categoría superior.

**Parámetros Query:**
- `category` (string, opcional): Slug de la categoría superior
- `page` (number, opcional): Página para paginación
- `limit` (number, opcional): Límite de resultados por página

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Google",
      "url": "https://google.com",
      "categoryId": "507f1f77bcf86cd799439012"
    }
  ]
}
```

**Respuesta sin resultados (200):**
```json
{
  "status": "success",
  "data": {
    "error": "El link no existe"
  }
}
```

---

### 4. Contar links por categoría

```http
GET /links/count?categoryId=<categoryId>
```

**Descripción:** Retorna el número total de links en una categoría específica.

**Parámetros Query:**
- `categoryId` (string, requerido): ID de la categoría

**Respuesta exitosa (200):**
```json
2
```

**Respuesta sin categoryId (400):**
```json
{
  "status": "fail",
  "message": "Categoría no proporcionada"
}
```

---

### 5. Obtener información de URL

```http
GET /links/getname?url=<url>
```

**Descripción:** Extrae información (título, descripción) de una URL externa.

**Parámetros Query:**
- `url` (string, requerido): URL válida para analizar

**Respuesta exitosa (200):**
```json
{
  "title": "Google",
  "description": "Buscador de Google",
  "image": "https://google.com/logo.png"
}
```

**Respuesta URL inválida (400):**
```json
{
  "status": "fail",
  "message": "Validation failed"
}
```

---

### 6. Obtener estado de URL

```http
GET /links/status?url=<url>
```

**Descripción:** Verifica el estado HTTP de una URL.

**Parámetros Query:**
- `url` (string, requerido): URL válida para verificar

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "accessible": true
}
```

---

### 7. Encontrar links duplicados

```http
GET /links/duplicates
```

**Descripción:** Busca links con URLs duplicadas del usuario.

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
[
  {
    "_id": "https://google.com",
    "count": 2,
    "links": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Google",
        "url": "https://google.com"
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Google Duplicado",
        "url": "https://google.com"
      }
    ]
  }
]
```

---

## Endpoints POST Links

### 1. Crear nuevo link

```http
POST /links
```

**Descripción:** Crea un nuevo link para el usuario autenticado.

**Body (JSON):**
```json
{
  "name": "Stack Overflow",
  "description": "Preguntas y respuestas de programación",
  "url": "https://stackoverflow.com",
  "imgUrl": "https://stackoverflow.com/favicon.ico",
  "categoryId": "507f1f77bcf86cd799439012",
  "order": 2,
  "bookmark": true,
  "notes": "Ayuda en programación"
}
```

**Campos requeridos:**
- `name` (string): Nombre del link
- `url` (string): URL válida
- `categoryId` (string): ID de la categoría

**Campos opcionales:**
- `description` (string): Descripción del link
- `imgUrl` (string): URL de la imagen/favicon
- `order` (number): Orden de visualización
- `bookmark` (boolean): Si es marcador
- `notes` (string): Notas adicionales

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "link": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Stack Overflow",
    "description": "Preguntas y respuestas de programación",
    "url": "https://stackoverflow.com",
    "imgUrl": "https://stackoverflow.com/favicon.ico",
    "categoryId": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439013",
    "order": 2,
    "bookmark": true,
    "notes": "Ayuda en programación",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Respuesta datos inválidos (400):**
```json
{
  "status": "fail",
  "message": "Validation failed"
}
```

---

## Endpoints PATCH Links

### 1. Actualizar link existente

```http
PATCH /links
```

**Descripción:** Actualiza los campos de un link existente.

**Body (JSON):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "fields": {
    "name": "Google Actualizado",
    "description": "Descripción actualizada",
    "categoryId": "507f1f77bcf86cd799439016"
  }
}
```

**Campos requeridos:**
- `id` (string): ID del link a actualizar
- `fields` (object): Campos a actualizar

**Campos actualizables en `fields`:**
- `name` (string): Nuevo nombre
- `description` (string): Nueva descripción
- `url` (string): Nueva URL
- `imgUrl` (string): Nueva imagen
- `categoryId` (string): Nueva categoría
- `order` (number): Nuevo orden
- `bookmark` (boolean): Estado de marcador
- `notes` (string): Nuevas notas

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "link": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Google Actualizado",
    "description": "Descripción actualizada"
  }
}
```

**Respuesta link no encontrado (200):**
```json
{
  "status": "success",
  "link": {
    "error": "El link no existe"
  }
}
```

---

### 2. Mover múltiples links entre categorías

```http
PATCH /links/move
```

**Descripción:** Mueve varios links de una categoría origen a una categoría destino.

**Body (JSON):**
```json
{
  "sourceCategoryId": "507f1f77bcf86cd799439012",
  "destinyCategoryId": "507f1f77bcf86cd799439016",
  "links": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439014"
  ]
}
```

**Campos requeridos:**
- `sourceCategoryId` (string): ID de la categoría origen
- `destinyCategoryId` (string): ID de la categoría destino
- `links` (array): Array de IDs de links a mover

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "link": {
    "acknowledged": true,
    "modifiedCount": 2,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 2
  }
}
```

---

### 3. Establecer orden de marcadores

```http
PATCH /links/setbookmarksorder
```

**Descripción:** Establece el orden de los links marcados como bookmarks.

**Body (JSON):**
```json
{
  "links": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015"
  ]
}
```

**Campos requeridos:**
- `links` (array): Array ordenado de IDs de links

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": {
    "acknowledged": true,
    "modifiedCount": 3
  }
}
```

**Respuesta error interno (500):**
```json
{
  "error": "Error interno del servidor"
}
```

---

## Endpoints DELETE Links

### 1. Eliminar link

```http
DELETE /links
```

**Descripción:** Elimina un link específico del usuario.

**Body (JSON):**
```json
{
  "linkId": "507f1f77bcf86cd799439011"
}
```

**Campos requeridos:**
- `linkId` (string): ID del link a eliminar

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "link": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Google",
    "url": "https://google.com",
    "deletedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Respuesta link no encontrado (200):**
```json
{
  "status": "success",
  "link": {
    "error": "El link no existe"
  }
}
```

**Respuesta datos inválidos (400):**
```json
{
  "status": "fail",
  "message": "Validation failed"
}
```

---

## Endpoints de Categorías

### Endpoints GET Categorías

#### 1. Obtener todas las categorías del usuario

```http
GET /categories
```

**Descripción:** Retorna todas las categorías pertenecientes al usuario autenticado.

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Trabajo",
      "slug": "trabajo",
      "level": 0,
      "order": 0,
      "user": "507f1f77bcf86cd799439013",
      "parentId": null,
      "parentSlug": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Personal",
      "slug": "personal",
      "level": 0,
      "order": 1,
      "user": "507f1f77bcf86cd799439013",
      "parentId": null,
      "parentSlug": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Respuesta sin autenticación (401):**
```json
{
  "status": "fail",
  "error": "User ID is missing"
}
```

---

#### 2. Obtener categorías de nivel superior

```http
GET /categories/toplevel
```

**Descripción:** Retorna solo las categorías de nivel superior (sin padre) del usuario autenticado.

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Trabajo",
      "slug": "trabajo",
      "level": 0,
      "order": 0,
      "user": "507f1f77bcf86cd799439013",
      "parentId": null,
      "parentSlug": null
    }
  ]
}
```

---

#### 3. Obtener categorías por slug padre

```http
GET /categories/:slug
```

**Descripción:** Retorna las categorías hijas de una categoría padre específica.

**Parámetros URL:**
- `slug` (string, requerido): Slug de la categoría padre

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Desarrollo",
      "slug": "desarrollo",
      "level": 1,
      "order": 0,
      "user": "507f1f77bcf86cd799439013",
      "parentId": "507f1f77bcf86cd799439012",
      "parentSlug": "trabajo"
    }
  ]
}
```

---

### Endpoints POST Categorías

#### 1. Crear nueva categoría

```http
POST /categories
```

**Descripción:** Crea una nueva categoría para el usuario autenticado.

**Body (JSON):**
```json
{
  "name": "Nueva Categoría",
  "description": "Descripción de la categoría",
  "parentId": "507f1f77bcf86cd799439012",
  "parentSlug": "trabajo",
  "level": 1,
  "order": 2
}
```

**Campos requeridos:**
- `name` (string): Nombre de la categoría

**Campos opcionales:**
- `description` (string): Descripción de la categoría
- `parentId` (string): ID de la categoría padre
- `parentSlug` (string): Slug de la categoría padre
- `level` (number): Nivel de anidación
- `order` (number): Orden de visualización

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "category": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Nueva Categoría",
    "slug": "nueva-categoria",
    "description": "Descripción de la categoría",
    "level": 1,
    "order": 2,
    "user": "507f1f77bcf86cd799439013",
    "parentId": "507f1f77bcf86cd799439012",
    "parentSlug": "trabajo",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

#### 2. Actualizar anidación de categorías

```http
POST /categories/nest
```

**Descripción:** Actualiza la estructura de anidación de múltiples categorías.

**Body (JSON):**
```json
{
  "updates": [
    {
      "id": "507f1f77bcf86cd799439015",
      "parentId": "507f1f77bcf86cd799439012",
      "parentSlug": "trabajo",
      "level": 1
    },
    {
      "id": "507f1f77bcf86cd799439016",
      "parentId": "507f1f77bcf86cd799439015",
      "parentSlug": "desarrollo",
      "level": 2
    }
  ]
}
```

**Campos requeridos:**
- `updates` (array): Array de objetos con datos de actualización

**Campos en cada objeto de `updates`:**
- `id` (string): ID de la categoría a actualizar
- `parentId` (string): Nuevo ID de la categoría padre
- `parentSlug` (string): Nuevo slug de la categoría padre
- `level` (number): Nuevo nivel de anidación

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "2 categorías actualizadas exitosamente",
  "updatedCount": 2
}
```

**Respuesta parcial (400):**
```json
{
  "status": "partial_success",
  "message": "1 de 2 categorías actualizadas",
  "updatedCount": 1,
  "errors": [
    {
      "id": "507f1f77bcf86cd799439016",
      "error": "Categoría no encontrada"
    }
  ]
}
```

---

#### 3. Reordenar categorías

```http
POST /categories/reorder
```

**Descripción:** Actualiza el orden de visualización de múltiples categorías.

**Body (JSON):**
```json
{
  "updates": [
    {
      "id": "507f1f77bcf86cd799439012",
      "order": 1
    },
    {
      "id": "507f1f77bcf86cd799439014",
      "order": 0
    }
  ]
}
```

**Campos requeridos:**
- `updates` (array): Array de objetos con datos de orden

**Campos en cada objeto de `updates`:**
- `id` (string): ID de la categoría a reordenar
- `order` (number): Nuevo orden de visualización

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "2 categorías reordenadas exitosamente",
  "updatedCount": 2
}
```

---

### Endpoints PATCH Categorías

#### 1. Actualizar categoría existente

```http
PATCH /categories
```

**Descripción:** Actualiza los campos de una categoría existente.

**Body (JSON):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "fields": {
    "name": "Trabajo Actualizado",
    "description": "Nueva descripción",
    "order": 5
  },
  "columnsIds": [
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016"
  ]
}
```

**Campos requeridos:**
- `id` (string): ID de la categoría a actualizar
- `fields` (object): Campos a actualizar

**Campos opcionales:**
- `columnsIds` (array): Array de IDs de categorías relacionadas

**Campos actualizables en `fields`:**
- `name` (string): Nuevo nombre
- `description` (string): Nueva descripción
- `order` (number): Nuevo orden
- `parentId` (string): Nuevo padre
- `parentSlug` (string): Nuevo slug del padre
- `level` (number): Nuevo nivel

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "column": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Trabajo Actualizado",
    "description": "Nueva descripción",
    "order": 5
  }
}
```

---

### Endpoints DELETE Categorías

#### 1. Eliminar categoría

```http
DELETE /categories
```

**Descripción:** Elimina una categoría específica del usuario.

**Body (JSON):**
```json
{
  "id": "507f1f77bcf86cd799439012"
}
```

**Campos requeridos:**
- `id` (string): ID de la categoría a eliminar

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "column": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Trabajo",
    "slug": "trabajo",
    "deletedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Respuesta categoría no encontrada (200):**
```json
{
  "status": "success",
  "column": {
    "error": "Categoría no encontrada"
  }
}
```

---

## Modelos de Datos

### Link

```typescript
interface Link {
  _id: string                    // ID único del link
  name: string                   // Nombre del link
  description?: string           // Descripción del link
  url: string                    // URL del link
  imgUrl?: string               // URL de la imagen/favicon
  categoryName?: string         // Nombre de la categoría
  categoryId: string            // ID de la categoría
  order?: number                // Orden de visualización
  user: string                  // ID del usuario propietario
  notes?: string                // Notas adicionales
  images?: string[]             // Array de imágenes
  bookmark: boolean             // Si es marcador
  bookmarkOrder?: number        // Orden de marcador
  readlist: boolean             // Si está en lista de lectura
  createdAt: Date               // Fecha de creación
  updatedAt: Date               // Fecha de última actualización
}
```

### Category

```typescript
interface Category {
  _id: string                    // ID único de la categoría
  name: string                   // Nombre de la categoría
  slug: string                   // Slug único de la categoría
  description?: string           // Descripción de la categoría
  level: number                  // Nivel de anidación (0 = raíz)
  order: number                  // Orden de visualización
  user: string                   // ID del usuario propietario
  parentId: string | null        // ID de la categoría padre (null si es raíz)
  parentSlug: string | null      // Slug de la categoría padre (null si es raíz)
  createdAt: Date               // Fecha de creación
  updatedAt: Date               // Fecha de última actualización
}
```

### Respuesta Estándar de Error

```typescript
interface ErrorResponse {
  status: "fail"                // Estado del error
  message: string               // Mensaje descriptivo del error
}
```

### Respuesta Estándar de Éxito

```typescript
interface SuccessResponse<T> {
  status: "success"             // Estado de éxito
  data?: T                      // Datos de respuesta (opcional)
  link?: T                      // Link específico (para operaciones de link)
}
```

---

## Códigos de Error

| Código | Descripción | Causa común |
|--------|-------------|-------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Link creado exitosamente |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Usuario no autenticado |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

---

## Ejemplos de Uso

### Flujo completo de Links: Crear, actualizar y eliminar

```javascript
// 1. Crear un nuevo link
const response1 = await fetch('/links', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'GitHub',
    url: 'https://github.com',
    categoryId: '507f1f77bcf86cd799439012',
    description: 'Repositorio de código'
  })
})

const newLink = await response1.json()
//console.log('Link creado:', newLink.link._id)

// 2. Actualizar el link
const response2 = await fetch('/links', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    id: newLink.link._id,
    fields: {
      name: 'GitHub - Actualizado',
      bookmark: true
    }
  })
})

// 3. Eliminar el link
const response3 = await fetch('/links', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    linkId: newLink.link._id
  })
})
```

### Gestión completa de Categorías

```javascript
// 1. Crear una categoría padre
const parentCategory = await fetch('/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'Desarrollo',
    description: 'Categoría para desarrollo',
    level: 0,
    order: 0
  })
})

const parent = await parentCategory.json()

// 2. Crear una subcategoría
const subCategory = await fetch('/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'Frontend',
    parentId: parent.category._id,
    parentSlug: parent.category.slug,
    level: 1,
    order: 0
  })
})

// 3. Obtener categorías de nivel superior
const topCategories = await fetch('/categories/toplevel', {
  headers: {
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  }
})

// 4. Obtener subcategorías por slug padre
const subCategories = await fetch('/categories/desarrollo', {
  headers: {
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  }
})

// 5. Reordenar categorías
const reorderResult = await fetch('/categories/reorder', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    updates: [
      { id: parent.category._id, order: 1 },
      { id: subCategory.category._id, order: 0 }
    ]
  })
})
```

### Obtener y gestionar links por categoría

```javascript
// Obtener todos los links
const allLinks = await fetch('/links', {
  headers: {
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  }
})

// Contar links en una categoría específica
const count = await fetch('/links/count?categoryId=507f1f77bcf86cd799439012', {
  headers: {
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  }
})

// Mover links entre categorías
const moveResult = await fetch('/links/move', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    sourceCategoryId: '507f1f77bcf86cd799439012',
    destinyCategoryId: '507f1f77bcf86cd799439016',
    links: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439014']
  })
})
```

### Flujo completo: Estructura jerárquica de categorías con links

```javascript
// 1. Crear estructura de categorías
const workCategory = await fetch('/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'Trabajo',
    level: 0,
    order: 0
  })
})

const devSubcategory = await fetch('/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'Desarrollo',
    parentId: workCategory.category._id,
    parentSlug: workCategory.category.slug,
    level: 1,
    order: 0
  })
})

// 2. Crear links en las categorías
const linkInWork = await fetch('/links', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'Slack',
    url: 'https://slack.com',
    categoryId: workCategory.category._id
  })
})

const linkInDev = await fetch('/links', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    name: 'VS Code',
    url: 'https://code.visualstudio.com',
    categoryId: devSubcategory.category._id
  })
})

// 3. Reestructurar jerarquía si es necesario
const nestingUpdate = await fetch('/categories/nest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=token; csrfToken=csrf',
    'X-CSRF-Token': 'csrf'
  },
  body: JSON.stringify({
    updates: [
      {
        id: devSubcategory.category._id,
        parentId: workCategory.category._id,
        parentSlug: workCategory.category.slug,
        level: 1
      }
    ]
  })
})
```

---

## Notas Adicionales

### Autenticación
- Todos los endpoints requieren autenticación válida mediante cookies de sesión
- Formato requerido: `Cookie: session=token; csrfToken=csrf` + `X-CSRF-Token: csrf`

### IDs y Validación
- Todos los IDs siguen el formato ObjectId de MongoDB (24 caracteres hexadecimales)
- La API utiliza esquemas Zod para validación de entrada en el lado del servidor
- Los campos opcionales tendrán valores por defecto si no se proporcionan

### Links
- **Relaciones**: Los links están relacionados con categorías mediante `categoryId` y con usuarios mediante `user`
- **Ordenamiento**: Los links se ordenan por defecto por el campo `order` en orden ascendente
- **Timestamps**: Todos los links incluyen campos `createdAt` y `updatedAt` gestionados automáticamente
- **Marcadores**: El sistema permite marcar links como favoritos usando el campo `bookmark`

### Categorías
- **Jerarquía**: Sistema de categorías jerárquico con niveles ilimitados (level 0 = raíz)
- **Slugs únicos**: Los slugs deben ser únicos dentro del mismo nivel de categoría
- **Ordenamiento**: El campo `order` determina la posición dentro del mismo nivel
- **Dependencias**: Las categorías padre deben existir antes de crear subcategorías
- **Operaciones masivas**: Soporte para reordenamiento y anidación de múltiples categorías

### Paginación y Límites
- Algunos endpoints soportan paginación mediante parámetros `page` y `limit`
- Las operaciones masivas (mover links, reordenar categorías) tienen límites de cantidad

### Manejo de Errores
- **Formatos variables**: La API puede devolver diferentes formatos de respuesta dependiendo del tipo de operación
- **Códigos comunes**: 400 (validación), 401 (autenticación), 403 (permisos), 404 (no encontrado), 500 (servidor)
- **Inconsistencias conocidas**: Existe una inconsistencia entre el esquema de validación y algunos controladores

### Mejores Prácticas
1. Validar la existencia de categorías antes de asignar links
2. Mantener la consistencia en los niveles de jerarquía de categorías
3. Usar transacciones para operaciones que afecten múltiples documentos
4. Implementar validación de permisos en el frontend
5. Manejar diferentes formatos de respuesta según el endpoint

### Operaciones Especiales
- **Links**: Creación, actualización, eliminación, movimiento entre categorías, ordenamiento de marcadores
- **Categorías**: Gestión jerárquica, reordenamiento, anidación, consultas por nivel y slug padre
- **Contadores**: Estadísticas de uso y distribución de links por categoría
