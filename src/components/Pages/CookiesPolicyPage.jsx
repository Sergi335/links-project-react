import styles from './CookiesPolicyPage.module.css'
import { HomeFooter, HomeNav } from './HomePage'

export default function CookiesPolicy () {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: '0 auto',
      alignItems: 'center',
      width: '100%'
    }}>
    <HomeNav />
    <main className={styles.container}>
      <h1>Política de Cookies</h1>

      <section>
        <h2>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en el
          dispositivo del usuario al visitar una página web. Sirven para
          garantizar el correcto funcionamiento del sitio y mejorar la
          experiencia del usuario.
        </p>
      </section>

      <section>
        <h2>2. Tipos de cookies utilizadas</h2>
        <p>Este sitio web utiliza los siguientes tipos de cookies:</p>
        <ul>
          <li>
            <strong>Cookies técnicas:</strong> necesarias para el funcionamiento
            básico del servicio y la autenticación de usuarios.
          </li>
          <li>
            <strong>Cookies de análisis (opcionales):</strong> permiten analizar
            el uso de la plataforma para mejorar el servicio.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Cookies de terceros</h2>
        <p>
          En caso de activarse herramientas de análisis (por ejemplo, Google
          Analytics), estas pueden instalar cookies gestionadas por terceros.
        </p>
      </section>

      <section>
        <h2>4. Gestión del consentimiento</h2>
        <p>
          El usuario puede aceptar, rechazar o configurar el uso de cookies no
          esenciales mediante el banner de cookies disponible en la plataforma.
        </p>
      </section>

      <section>
        <h2>5. Cómo desactivar las cookies</h2>
        <p>
          El usuario puede configurar su navegador para bloquear o eliminar las
          cookies instaladas. La desactivación de cookies técnicas puede afectar
          al correcto funcionamiento del servicio.
        </p>
      </section>

      <section>
        <h2>6. Actualizaciones</h2>
        <p>
          Esta política puede actualizarse para adaptarse a cambios legales o
          técnicos. La versión vigente estará siempre disponible en esta página.
        </p>
      </section>
    </main>
    <HomeFooter />
    </div>
  )
}
