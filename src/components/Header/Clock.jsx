export default function Clock ({ hours, minutes }) {
  return (
    <p>
      {/* {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`} */}
      {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`}
    </p>
  )
}
