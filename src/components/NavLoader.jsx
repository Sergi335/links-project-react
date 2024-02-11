import ContentLoader from 'react-content-loader'

export default function NavLoader (props) {
  const width = '170px'
  return (
    <ContentLoader // No se adapta
        speed={2}
        width={width}
        height={35}
        viewBox={`0 0 ${width} 460`}
        backgroundColor="var(--secondColor)"
        foregroundColor="var(--thirdColor)"
        //  className={styles.columnsLoader}
        {...props}
        >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="35" />
    </ContentLoader>
  )
}
