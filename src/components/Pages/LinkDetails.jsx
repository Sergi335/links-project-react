import { Link, useParams } from 'react-router-dom'
import { checkUrlMatch } from '../../services/functions'
import { useNavStore } from '../../store/session'

export default function LinkDetails () {
  const links = useNavStore(state => state.links)
  const actualDesk = links[0].escritorio
  const linkId = useParams()
  const nextIndex = links.findIndex(link => linkId.id === link._id) + 1 // > length
  const prevIndex = links.findIndex(link => linkId.id === link._id) - 1 // -2
  let nextId
  if (typeof links[nextIndex] === 'object' && links[nextIndex]._id !== undefined) {
    nextId = links[nextIndex]._id
  } else {
    nextId = null
  }
  let prevId
  if (typeof links[prevIndex] === 'object' && links[prevIndex]._id !== undefined) {
    prevId = links[prevIndex]._id
  } else {
    prevId = null
  }
  const data = links.find(link => link._id === linkId.id)

  return (
      <>
      {
        prevId
          ? <Link to={`/link/${prevId}`}>Prev</Link>
          : null
      }
        <Link to={`/desktop/${actualDesk}`}>Volver</Link>
      {
        nextId
          ? <Link to={`/link/${nextId}`}>Next</Link>
          : null
      }
        <h1>Detalles del Link</h1>
        <p>{data.name}</p>
        <p>{data.description}</p>
        <p>{data.escritorio}</p>
        <p>{data.panel}</p>
        {
         data.images.length
           ? data.images.map(img => (
            <img key={img} src={img} alt="" />
           ))
           : null
        }
        {
          checkUrlMatch(data.URL) ? <iframe src={checkUrlMatch(data.URL)} width={1068} height={600}></iframe> : null
        }
      </>
  )
}
