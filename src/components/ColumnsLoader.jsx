import React from 'react'
import ContentLoader from 'react-content-loader'
import styles from './ColumnsLoader.module.css'

const ColumnsLoader = (props) => {
  const width = '90%'
  return (
    <ContentLoader // No se adapta
      speed={5}
      width={width}
      height={323}
      viewBox={`0 0 ${width} 317`}
      backgroundColor="var(--color-medium)"
      foregroundColor="var(--color-secondary)"
      className={styles.columnsLoader}
      {...props}
    >
      <rect x="0" y="0" rx="5" ry="5" width="100%" height="600" />
    </ContentLoader>
  )
}

export default ColumnsLoader
