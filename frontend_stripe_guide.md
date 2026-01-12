# Guía de Implementación de Pagos con Stripe (React + Express)

Esta guía detalla paso a paso cómo configurar Stripe desde cero y consumir los endpoints de pago implementados en `gemini-api-ts` desde una aplicación Frontend en React.

## 1. Configuración del Dashboard de Stripe

Antes de tocar el código, necesitamos configurar la plataforma de Stripe.

### 1.1. Crear Cuenta y Obtener Claves
1. Ve a [dashboard.stripe.com](https://dashboard.stripe.com/register) y crea una cuenta.
2. Una vez dentro, asegúrate de estar en **Modo de prueba (Test Mode)** (interruptor en la parte superior derecha).
3. Ve a **Desarrolladores > Claves de API**.
4. Copia la **Clave publicable** (`pk_test_...`) y la **Clave secreta** (`sk_test_...`).
   - La `Clave secreta` va en el `.env` de tu **Backend** (`STRIPE_SECRET_KEY`).
   - La `Clave publicable` irá en el `.env` de tu **Frontend**.

### 1.2. Crear Productos y Precios
Necesitamos crear los planes que coincidan con la configuración de nuestro backend (`FREE`, `PRO`, `ENTERPRISE`).

1. Ve a **Catálogo de productos > + Añadir producto**.
2. **Plan PRO**:
   - Nombre: "Plan Pro"
   - Información de precio: Elija "Estándar".
   - Precio: (Ej: 10 EUR).
   - Intervalo: "Mensual".
   - Una vez creado, busca el **ID de precio** (empieza por `price_...`).
   - Copia este ID y ponlo en el `.env` de tu Backend como `STRIPE_PRICE_ID_PRO`.
3. **Plan ENTERPRISE**:
   - Repite el proceso (Ej: 50 EUR / Mes).
   - Copia el ID de precio al `.env` del Backend como `STRIPE_PRICE_ID_ENTERPRISE`.

### 1.3. Configurar Webhook
Para que el backend se entere cuando un pago se realiza o una suscripción se cancela:

1. Ve a **Desarrolladores > Webhooks > + Añadir endpoint**.
2. **URL del endpoint**:
   - Para desarrollo local, necesitas usar Stripe CLI o un túnel (como Ngrok).
   - URL: `https://tu-dominio-ngrok.io/stripe/webhook` (o tu dominio de producción).
3. **Eventos a escuchar**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Una vez creado, verás un **Secreto de firma** (`whsec_...`).
   - Copia esto al `.env` del Backend como `STRIPE_WEBHOOK_SECRET`.

---

## 2. Implementación en Frontend (React)

Asumiremos que tienes una app React creada (Vite, Next.js, CRA).

### 2.1. Instalación de Dependencias
Instala las librerías oficiales de Stripe y axios para las peticiones:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js axios
```

### 2.2. Configuración del Cliente Stripe
Crea un archivo de utilidad o contexto, por ejemplo `src/lib/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js';

// Asegúrate de tener VITE_STRIPE_PUBLIC_KEY en tu .env del frontend
// O REACT_APP_STRIPE_PUBLIC_KEY si usas CRA
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
```

### 2.3. Servicio de API
Centraliza las llamadas a tu backend. Asumimos que `api` es una instancia de axios configurada (con cookies/headers para autenticación).

```typescript
// src/services/paymentService.ts
import api from './api'; // Tu instancia de axios configurada

export const createCheckoutSession = async (priceId: string) => {
  const { data } = await api.post('/stripe/checkout', {
    priceId,
    successUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/pricing`, // O donde quieras que vuelvan si cancelan
  });
  return data.url; // El backend devuelve { url: "..." }
};

export const createPortalSession = async () => {
  const { data } = await api.post('/stripe/portal', {
    returnUrl: `${window.location.origin}/settings`, // Donde volver tras gestionar la suscripción
  });
  return data.url;
};

export const getSubscriptionStatus = async () => {
  const { data } = await api.get('/stripe/status');
  return data;
};
```

### 2.4. Componente de Precios (PricingTable)
Este componente muestra los planes e inicia el checkout.

```tsx
import React from 'react';
import { createCheckoutSession } from '../services/paymentService';

const PLANS = [
  {
    id: 'free',
    title: 'Free',
    price: '0€/mes',
    features: ['50MB Storage', '20 AI Calls/mo'],
    priceId: null, // Plan gratuito no tiene ID de Stripe
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '10€/mes',
    features: ['5GB Storage', '500 AI Calls/mo'],
    priceId: 'price_1Q...', // USA EL ID REAL QUE OBTUVISTE EN EL DASHBOARD (o tráelo de config)
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    price: '50€/mes',
    features: ['50GB Storage', 'Unlimited AI Calls'],
    priceId: 'price_1Q...', // USA EL ID REAL
  },
];

export const PricingTable = () => {
  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return; // Plan gratuito

    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      // Redirigir a la página de pago de Stripe
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al iniciar checkout:', error);
      alert('Hubo un error al iniciar el pago.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
      {PLANS.map((plan) => (
        <div key={plan.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>{plan.title}</h3>
          <h1>{plan.price}</h1>
          <ul>
            {plan.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
          {plan.priceId && (
            <button onClick={() => handleSubscribe(plan.priceId)}>
              Suscribirse
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

### 2.5. Gestión de Suscripción (Customer Portal)
En tu página de perfil o ajustes, permite al usuario gestionar su suscripción.

```tsx
import React, { useEffect, useState } from 'react';
import { createPortalSession, getSubscriptionStatus } from '../services/paymentService';

export const SubscriptionSettings = () => {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await getSubscriptionStatus();
      setStatus(data);
    } catch (error) {
      console.error('Error cargando estado:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const portalUrl = await createPortalSession();
      window.location.href = portalUrl;
    } catch (error) {
      alert('Error al abrir el portal de facturación');
    }
  };

  if (!status) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #eee' }}>
      <h2>Tu Suscripción</h2>
      <p><strong>Plan actual:</strong> {status.plan}</p>
      <p><strong>Estado:</strong> {status.status}</p>
      
      {/* Mostrar límites */}
      <div style={{ marginTop: '10px' }}>
        <p>Límmite de Almacenamiento: {status.limits.storageMB} MB</p>
        <p>Llamadas IA: {status.limits.llmCallsPerMonth === -1 ? 'Ilimitadas' : status.limits.llmCallsPerMonth}</p>
      </div>

      {status.plan !== 'FREE' && (
        <button 
          onClick={handleManageSubscription}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          Gestionar Suscripción / Cancelar
        </button>
      )}
    </div>
  );
};
```

### 2.6. Página de Retorno (Success Page)
El backend redirige a `/payment/success` (o lo que configures) tras el pago. Deberías tener una ruta en tu React Router para esto.

```tsx
// src/pages/PaymentSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>¡Pago realizado con éxito!</h1>
      <p>Tu suscripción se está activando. Esto puede tardar unos segundos.</p>
      <button onClick={() => navigate('/dashboard')}>
        Ir al Dashboard
      </button>
    </div>
  );
};
```

## Resumen de Flujo

1. **Usuario** selecciona "Suscripción" en el Frontend.
2. **Frontend** llama a `POST /stripe/checkout`.
3. **Backend** crea sesión en Stripe y devuelve URL.
4. **Frontend** redirige a esa URL (Formulario de Stripe alojado).
5. **Usuario** paga.
6. **Stripe**:
   - Redirige al usuario a `successUrl` (Frontend).
   - Envía evento `checkout.session.completed` a tu **Webhook** (Backend).
7. **Backend** (Webhook) recibe el evento y actualiza la base de datos del usuario (`subscription.status = active`).
8. **Usuario** ve que su plan se actualiza (al recargar o consultar `/status`).
