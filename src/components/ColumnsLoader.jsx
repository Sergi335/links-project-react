import React from 'react'
import ContentLoader from 'react-content-loader'
import styles from './ColumnsLoader.module.css'

const ColumnsLoader = (props) => {
  const width = '90%'
  return (
    <ContentLoader // No se adapta
      speed={1}
      width={width}
      height={323}
      viewBox={`0 0 ${width} 460`}
      backgroundColor="var(--secondColor)"
      foregroundColor="var(--thirdColor)"
      className={styles.columnsLoader}
      {...props}
    >
      <rect x="0" y="0" rx="5" ry="5" width="100%" height="600" />
    </ContentLoader>
  )
}

export default ColumnsLoader
