export default function Columna ({ data, children }) {
  // console.log({ data })
  // const { name } = props
  return (
        <div className="column">
            <h2>{data.name}</h2>
            {children}
        </div>
  )
}
