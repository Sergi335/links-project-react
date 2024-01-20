import React from 'react'
import ContentLoader from 'react-content-loader'
// import styles from './ColumnsLoader.module.css'

const ImagesLoader = (props) => {
  const styles = {
    width: '100%',
    height: 'auto'
  }
  return (
    <ContentLoader // No se adapta
      speed={1}
      width={styles.width}
      height={281}
      viewBox={`0 0 ${styles.width} 460`}
      backgroundColor="var(--secondColor)"
      foregroundColor="var(--thirdColor)"
    //   className={styles.columnsLoader}
      {...props}
    >
      <rect x="0" y="0" rx="5" ry="5" width="100%" height="600" />
    </ContentLoader>
  )
}

export default ImagesLoader
