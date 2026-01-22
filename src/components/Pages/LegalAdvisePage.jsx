import styles from './LegalAdvisePage.module.css'
export default function LegalAdvisePage () {
  return (
       <main className={styles.container}>
      <h1 className={styles.title}>Aviso Legal</h1>

      <section className={styles.section}>
        <p>
          En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de
          servicios de la sociedad de la información y de comercio electrónico
          (LSSI-CE), se informa a los usuarios de los siguientes datos:
        </p>
      </section>

      <section className={styles.section}>
        <h2>1. Datos identificativos</h2>
        <ul>
          <li>
            <strong>Titular del sitio web:</strong> [NOMBRE Y APELLIDOS / RAZÓN
            SOCIAL]
          </li>
          <li>
            <strong>NIF/CIF:</strong> [NIF / CIF]
          </li>
          <li>
            <strong>Domicilio social:</strong> [DIRECCIÓN COMPLETA]
          </li>
          <li>
            <strong>Correo electrónico:</strong> [EMAIL DE CONTACTO]
          </li>
          <li>
            <strong>Actividad:</strong> Prestación de servicios digitales
            mediante plataforma SaaS
          </li>
          <li>
            <strong>Nombre comercial:</strong> [NOMBRE DEL SAAS]
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. Objeto</h2>
        <p>
          El presente Aviso Legal regula el acceso, navegación y uso del sitio web
          <strong> [URL DEL SITIO WEB]</strong>, así como las responsabilidades
          derivadas de la utilización de sus contenidos y servicios.
        </p>
        <p>
          El acceso y uso del sitio web atribuye la condición de usuario e implica
          la aceptación plena y sin reservas del presente Aviso Legal.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Condiciones de uso</h2>
        <p>
          El usuario se compromete a utilizar el sitio web de conformidad con la
          ley, la buena fe, el orden público y el presente Aviso Legal.
        </p>
        <p>
          Queda prohibido el uso del sitio web con fines ilícitos o que puedan
          causar perjuicio al normal funcionamiento del mismo.
        </p>
        <p>
          El titular se reserva el derecho a modificar o suspender el sitio web
          sin previo aviso.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos del sitio web (textos, imágenes, logotipos,
          software, diseño y código fuente) son titularidad del propietario del
          sitio o dispone de los derechos necesarios para su uso.
        </p>
        <p>
          Queda prohibida la reproducción, distribución o modificación de dichos
          contenidos sin autorización expresa.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Responsabilidad</h2>
        <p>
          El titular no se hace responsable de los daños derivados del uso
          indebido del sitio web ni de posibles interrupciones del servicio por
          causas técnicas.
        </p>
        <p>
          Tampoco se responsabiliza del contenido de enlaces externos que puedan
          incluirse en el sitio web.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Protección de datos</h2>
        <p>
          El tratamiento de los datos personales se regirá por lo dispuesto en la
          Política de Privacidad disponible en este sitio web.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Legislación aplicable y jurisdicción</h2>
        <p>
          El presente Aviso Legal se rige por la legislación española. Para la
          resolución de cualquier controversia, las partes se someterán a los
          juzgados y tribunales que correspondan conforme a la normativa vigente.
        </p>
      </section>
    </main>
  )
}
