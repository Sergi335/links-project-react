import ContentLoader from 'react-content-loader'

export default function SideInfoLoader (props) {
  const width = '226px'
  return (
    <ContentLoader // No se adapta
        speed={2}
        width={width}
        height={135}
        viewBox={`0 0 ${width} 460`}
        backgroundColor="var(--secondColor)"
        foregroundColor="var(--thirdColor)"
        className={props.className}
        {...props}
        >
        <rect x="0" y="0" rx="5" ry="5" width="100%" height="135" />
    </ContentLoader>
  )
}
