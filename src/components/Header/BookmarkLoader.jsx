import ContentLoader from 'react-content-loader'

export default function BookmarkLoader (props) {
  // const width = '18'
  return (
    <ContentLoader // No se adapta
        speed={2}
        width={20}
        height={20}
        viewBox={'0 0 20 20'}
        backgroundColor="var(--secondColor)"
        foregroundColor="var(--thirdColor)"
        //  className={styles.columnsLoader}
        {...props}
        >
        <rect x="3" y="3" rx="4" ry="4" width="20" height="20" />
    </ContentLoader>
  )
}
