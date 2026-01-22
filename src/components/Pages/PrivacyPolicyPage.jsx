import { HomeFooter, HomeNav } from './HomePage'
import styles from './PrivacyPolicyPage.module.css'
export default function PrivacyPolicyPage () {
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
      <h1>Política de Privacidad</h1>

      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          <strong>Titular:</strong> TU NOMBRE O EMPRESA<br />
          <strong>NIF/CIF:</strong> TU NIF<br />
          <strong>Domicilio:</strong> TU DIRECCIÓN<br />
          <strong>Email:</strong> contacto@tudominio.com
        </p>
      </section>

      <section>
        <h2>2. Datos personales que recogemos</h2>
        <p>
          Recogemos los siguientes datos personales cuando el usuario utiliza el
          servicio:
        </p>
        <ul>
          <li>Nombre y apellidos (si se proporcionan)</li>
          <li>Dirección de correo electrónico</li>
          <li>Datos de acceso y autenticación</li>
          <li>Datos de facturación y pago</li>
          <li>Dirección IP y datos técnicos básicos</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del tratamiento</h2>
        <p>
          Los datos personales se utilizan para las siguientes finalidades:
        </p>
        <ul>
          <li>Gestionar el registro y la cuenta de usuario</li>
          <li>Prestar el servicio contratado</li>
          <li>Gestionar pagos y facturación</li>
          <li>Comunicaciones relacionadas con el servicio</li>
          <li>Mejorar la plataforma y su funcionamiento</li>
        </ul>
      </section>

      <section>
        <h2>4. Base legal para el tratamiento</h2>
        <p>
          El tratamiento de los datos se basa en:
        </p>
        <ul>
          <li>La ejecución de un contrato (prestación del servicio)</li>
          <li>El consentimiento del usuario, cuando sea requerido</li>
          <li>El cumplimiento de obligaciones legales</li>
        </ul>
      </section>

      <section>
        <h2>5. Conservación de los datos</h2>
        <p>
          Los datos se conservarán mientras exista una relación contractual o
          mientras sea necesario para cumplir con obligaciones legales.
        </p>
      </section>

      <section>
        <h2>6. Destinatarios de los datos</h2>
        <p>
          Los datos podrán ser comunicados a proveedores necesarios para la
          prestación del servicio, tales como:
        </p>
        <ul>
          <li>Proveedores de hosting y almacenamiento</li>
          <li>Plataformas de pago (por ejemplo, Stripe)</li>
          <li>Servicios de correo electrónico</li>
        </ul>
        <p>
          Estos proveedores actúan como encargados del tratamiento y han firmado
          los correspondientes acuerdos de protección de datos.
        </p>
      </section>

      <section>
        <h2>7. Transferencias internacionales</h2>
        <p>
          En caso de que se realicen transferencias internacionales de datos,
          estas se llevarán a cabo con las garantías adecuadas conforme al RGPD.
        </p>
      </section>

      <section>
        <h2>8. Derechos del usuario</h2>
        <p>
          El usuario puede ejercer los siguientes derechos:
        </p>
        <ul>
          <li>Acceso a sus datos personales</li>
          <li>Rectificación de datos inexactos</li>
          <li>Supresión de sus datos</li>
          <li>Limitación u oposición al tratamiento</li>
          <li>Portabilidad de los datos</li>
        </ul>
        <p>
          Para ejercer estos derechos, puede enviar una solicitud a{' '}
          <strong>contacto@tudominio.com</strong>.
        </p>
      </section>

      <section>
        <h2>9. Seguridad de los datos</h2>
        <p>
          Se aplican medidas técnicas y organizativas adecuadas para garantizar
          la seguridad y confidencialidad de los datos personales.
        </p>
      </section>

      <section>
        <h2>10. Uso de cookies</h2>
        <p>
          Actualmente no se utilizan cookies no esenciales. En caso de que se
          incorporen herramientas de análisis u otras cookies, se informará al
          usuario mediante la correspondiente política de cookies.
        </p>
      </section>

      <section>
        <h2>11. Cambios en esta política</h2>
        <p>
          Esta política de privacidad puede actualizarse para adaptarse a cambios
          legales o técnicos. La versión vigente estará siempre disponible en
          esta página.
        </p>
      </section>
    </main>
    <HomeFooter />
    </div>
  )
}
