import React from 'react'
import ContentLoader from 'react-content-loader'
import styles from './ColumnsLoader.module.css'

const ColumnsLoader = (props) => {
  const width = '100%'
  return (
    <ContentLoader // No se adapta
      speed={1}
      width={width}
      height={460}
      viewBox={`0 0 ${width} 460`}
      backgroundColor="var(--firstColor)"
      foregroundColor="var(--secondColor)"
      {...props}
    >
      <rect className={styles.columnsLoader} x="0" y="0" rx="5" ry="5" width={width} height="600" />
    </ContentLoader>
  )
}

export default ColumnsLoader
