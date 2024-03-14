import styles from './LinkLoader.module.css'
export default function LinkLoader ({ stylesOnHeader }) {
  return (
        <div className={styles.link} style={ stylesOnHeader }>
          <progress className={styles.progress} max='100' value='0'></progress>
        </div>
  )
}
