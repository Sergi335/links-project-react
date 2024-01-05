import ContentLoader from 'react-content-loader'
export default function NameLoader ({ className }) {
  return (
        <ContentLoader // No se adapta
            speed={2}
            width={200}
            height={35}
            viewBox="0 0 100% 35"
            backgroundColor="var(--mainColor)"
            foregroundColor="var(--frostHvColor)"
            className={className}
            >
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="21" />
        </ContentLoader>
  )
}
