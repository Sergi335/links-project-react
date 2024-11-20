import VideoPlayer from '../VideoPlayer'
import styles from './LinkDetails.module.css'
import LinkDetailsForm from './LinkDetailsForm'
import LinkDetailsGallery from './LinkDetailsGallery'
import LinkDetailsHeader from './LinkDetailsHeader'
import LinkDetailsNav from './LinkDetailsNav'

export default function LinkDetailsColumn ({ data, links, actualDesktop, slug }) {
  return (
    <section className={styles.link_details_panel}>
        <LinkDetailsHeader data={data} />
        <VideoPlayer src={data?.URL} width={600} height={300} />
        <LinkDetailsNav links={links} actualDesktop={actualDesktop} linkId={data?._id} context={'singlecol'} slug={slug} />
        <LinkDetailsForm data={data} />
        <h2>Related Links</h2>
        <LinkDetailsGallery data={data} />
    </section>
  )
}
