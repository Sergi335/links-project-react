import styles from './LinkLoader.module.css'
export default function LinkLoader () {
  return (
        <div className={styles.link}>
          <progress className={styles.progress} max='100' value='0'></progress>
        </div>
  )
}
