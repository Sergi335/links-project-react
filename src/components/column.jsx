import styles from './column.module.css'
export default function Columna ({ data, children }) {
  const { columna, handleContextMenu } = data
  return (
    <div className={styles.columnWrapper}>
      <div className={styles.column} id={columna._id}>
        <h2 onContextMenu={handleContextMenu}>{columna.name}</h2>
          {children}
      </div>
    </div>
  )
}
