export default function CustomLink (linksData) {
  const { data } = linksData
  // console.log(data)
  return (
        <div className="link">
            <a href={data.URL}>{data.name}</a>
        </div>
  )
}
