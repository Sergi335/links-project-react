# Funcionalidad de Anidamiento de Desktops

## ✨ Características Implementadas

### 1. **Anidamiento Jerárquico**
- Los desktops pueden anidarse unos dentro de otros mediante drag & drop
- Soporte para múltiples niveles de profundidad
- Indicadores visuales de indentación por nivel

### 2. **Validaciones de Seguridad**
- Previene referencias circulares (un desktop no puede anidarse bajo sus propios hijos)
- No permite anidarse sobre sí mismo
- Validación en tiempo real durante el drag

### 3. **UI/UX Mejorada**
- **Drop Zones Visuales**: Indicadores cuando se puede soltar
- **Optimistic UI**: Los cambios se muestran inmediatamente
- **Rollback**: Si falla la API, se revierte el estado
- **Indentación Visual**: Cada nivel se muestra con más margen
- **Indicadores de Estado**: Bordes y colores según el nivel

### 4. **Integración con Backend**
- Nuevos endpoints: `/desktops/nest` y `/desktops/unnest`
- Persistencia de `parentId` y `level` en la base de datos
- Manejo de errores con notificaciones

## 🚀 Cómo Usar

### **Anidar un Desktop**
1. Arrastra un desktop sobre otro desktop
2. Suéltalo cuando veas el indicador de drop (borde azul)
3. El desktop se anidará automáticamente bajo el target

### **Reordenar Desktops**
1. Arrastra un desktop sobre el espacio entre otros desktops
2. El orden se actualizará manteniendo la jerarquía

### **Expandir/Colapsar**
- Los desktops anidados se muestran expandidos por defecto
- Usa el botón de flecha para colapsar/expandir

## 🔧 Estructura de Datos

```javascript
{
  _id: "desktop1",
  name: "Desktop Principal",
  level: 0,        // Nivel de anidamiento (0 = raíz)
  parentId: null,  // ID del padre (null = raíz)
  order: 0         // Orden dentro del nivel
}

// Desktop anidado
{
  _id: "desktop2", 
  name: "Desktop Hijo",
  level: 1,        // Un nivel más profundo
  parentId: "desktop1", // Hijo del desktop1
  order: 0
}
```

## 🎨 Clases CSS Agregadas

```css
.nestedItem           /* Item que puede ser anidado */
.nestedItem[data-level="1"]  /* Primer nivel */
.nestedItem[data-level="2"]  /* Segundo nivel */
.dropTarget           /* Target cuando se puede soltar */
.dropIndicator        /* Línea indicadora de drop */
.nested_desktops      /* Contenedor de desktops anidados */
.hide                 /* Para colapsar elementos */
```

## ⚙️ Configuración de DndKit

### **Contextos Usados**
- **Un solo `DndContext`** para toda la jerarquía
- **Múltiples `SortableContext`** para cada nivel de anidamiento
- **Combinación de `useSortable` + `useDroppable`** en cada item

### **Estrategias de Detección**
- **Ordenamiento**: `verticalListSortingStrategy`
- **Drop Zones**: Detecta tipo `'DropZone'` vs `'Desktop'`
- **Validaciones**: Previene ciclos y auto-referencias

## 🛠️ Funciones del Store

```javascript
// Zustand store actualizado
{
  getNestedDesktops(),           // Obtiene desktops organizados por nivel
  updateDesktopHierarchy(id, parentId, level)  // Actualiza jerarquía local
}
```

## 📡 Endpoints de API

```javascript
// Anidar desktop
PATCH /api/desktops/nest
{
  desktopId: "id",
  parentId: "parentId", 
  level: 1
}

// Desanidar desktop  
PATCH /api/desktops/unnest
{
  desktopId: "id"
}
```

## 🔄 Flujo de Anidamiento

1. **Drag Start**: Se detecta el desktop arrastrado
2. **Drag Over**: Se muestra preview del drop si es válido
3. **Drop**: Se detecta si es anidamiento o reordenamiento
4. **Validación**: Se verifica que no haya referencias circulares
5. **Optimistic UI**: Se actualiza la UI inmediatamente
6. **API Call**: Se persiste en el backend
7. **Error Handling**: Se revierte si falla la API

## 🎯 Mejoras Futuras

- [ ] Límite de profundidad máxima (ej: 3 niveles)
- [ ] Animaciones suaves de transición
- [ ] Drag preview que muestre la jerarquía completa
- [ ] Soporte para drag & drop entre diferentes padres
- [ ] Búsqueda y filtrado que respete la jerarquía
- [ ] Exportar/importar estructura jerárquica

---

**✅ Implementación Completa:** La funcionalidad está lista para usar con soporte completo para anidamiento, validaciones y persistencia.
