import { HomeFooter, HomeNav } from './HomePage'
import styles from './TermsAndConditionsPage.module.css'

export default function TermsAndConditions () {
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
      <h1>Términos de Uso y Condiciones de Contratación</h1>

      <section>
        <h2>1. Identificación del prestador</h2>
        <p>
          <strong>Titular:</strong> TU NOMBRE O EMPRESA<br />
          <strong>NIF/CIF:</strong> TU NIF<br />
          <strong>Domicilio:</strong> TU DIRECCIÓN<br />
          <strong>Email de contacto:</strong> contacto@tudominio.com
        </p>
      </section>

      <section>
        <h2>2. Objeto</h2>
        <p>
          El presente documento regula el acceso, uso y contratación del servicio
          SaaS ofrecido a través de esta plataforma, dirigido a usuarios finales
          (B2C).
        </p>
      </section>

      <section>
        <h2>3. Registro de usuarios</h2>
        <p>
          Para utilizar el servicio es necesario crear una cuenta proporcionando
          información veraz y actualizada. El usuario es responsable de mantener
          la confidencialidad de sus credenciales.
        </p>
      </section>

      <section>
        <h2>4. Uso permitido y prohibido</h2>
        <ul>
          <li>Usar el servicio conforme a la ley y a estos términos</li>
          <li>No realizar usos fraudulentos, abusivos o ilícitos</li>
          <li>No intentar acceder a sistemas o datos no autorizados</li>
          <li>No revender el servicio sin autorización expresa</li>
        </ul>
      </section>

      <section>
        <h2>5. Planes, precios e impuestos</h2>
        <p>
          El acceso completo al servicio puede requerir la contratación de uno de
          los planes de pago disponibles. Los precios se muestran en euros (€) e
          incluyen los impuestos aplicables, salvo que se indique lo contrario.
        </p>
      </section>

      <section>
        <h2>6. Forma de pago</h2>
        <p>
          El pago se realiza de forma anticipada mediante tarjeta bancaria u otros
          métodos disponibles a través de la plataforma de pago utilizada (por
          ejemplo, Stripe).
        </p>
      </section>

      <section>
        <h2>7. Renovación y cancelación</h2>
        <p>
          Las suscripciones se renuevan automáticamente según la periodicidad
          seleccionada (mensual o anual). El usuario puede cancelar la renovación
          en cualquier momento desde su cuenta, manteniendo el acceso hasta el
          final del periodo contratado.
        </p>
      </section>

      <section>
        <h2>8. Derecho de desistimiento</h2>
        <p>
          De acuerdo con la normativa vigente, el usuario reconoce y acepta que,
          al tratarse de un servicio digital que se presta de forma inmediata,
          pierde su derecho de desistimiento una vez iniciado el servicio.
        </p>
      </section>

      <section>
        <h2>9. Suspensión o baja del servicio</h2>
        <p>
          El prestador se reserva el derecho a suspender o cancelar cuentas que
          incumplan estos términos, sin derecho a reembolso en caso de uso
          indebido.
        </p>
      </section>

      <section>
        <h2>10. Responsabilidad</h2>
        <p>
          El servicio se ofrece “tal cual”. No se garantiza la disponibilidad
          ininterrumpida ni la ausencia total de errores, aunque se adoptarán las
          medidas razonables para su correcto funcionamiento.
        </p>
      </section>

      <section>
        <h2>11. Propiedad intelectual</h2>
        <p>
          Todos los contenidos, código y elementos del servicio son titularidad
          del prestador o de terceros licenciantes, quedando prohibida su
          reproducción sin autorización.
        </p>
      </section>

      <section>
        <h2>12. Legislación aplicable</h2>
        <p>
          Estas condiciones se rigen por la legislación española. Para cualquier
          conflicto, las partes se someten a los juzgados y tribunales del
          domicilio del consumidor.
        </p>
      </section>
    </main>
    <HomeFooter />
    </div>
  )
}
