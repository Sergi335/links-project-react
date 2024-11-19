import styles from './LinkDetailsColumn.module.css'
import LinkDetailsForm from './LinkDetailsForm'
import LinkDetailsGallery from './LinkDetailsGallery'
import LinkDetailsHeader from './LinkDetailsHeader'
import LinkDetailsNav from './LinkDetailsNav'
import VideoPlayer from './VideoPlayer'

export default function LinkDetailsColumn ({ data, links, actualDesktop, slug }) {
  return (
    <section className={styles.link_details_column}>
        <LinkDetailsHeader data={data} />
        <VideoPlayer src={data?.URL} width={600} height={300} />
        <LinkDetailsNav links={links} actualDesktop={actualDesktop} linkId={data?._id} context={'singlecol'} slug={slug} />
        <LinkDetailsForm data={data} />
        <h2>Related Links</h2>
        <LinkDetailsGallery data={data} />
    </section>
  )
}
