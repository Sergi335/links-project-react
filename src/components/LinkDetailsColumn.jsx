import LinkDetailsForm from './LinkDetailsForm'
import LinkDetailsGallery from './LinkDetailsGallery'
import LinkDetailsHeader from './LinkDetailsHeader'
import LinkDetailsNav from './LinkDetailsNav'
import VideoPlayer from './VideoPlayer'

export default function LinkDetailsColumn ({ data, links, actualDesktop }) {
  return (
    <section className>
        <LinkDetailsHeader data={data} />
        <VideoPlayer src={data?.URL} width={600} height={300} />
        <LinkDetailsNav links={links} actualDesktop={actualDesktop} linkId={data?._id} context={'singlecol'} />
        <LinkDetailsForm data={data} />
        <h2>Related Links</h2>
        <LinkDetailsGallery data={data} />
    </section>
  )
}
