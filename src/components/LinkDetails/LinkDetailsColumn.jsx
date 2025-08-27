import { PasteImageIcon } from '../Icons/icons'
import VideoPlayer from '../VideoPlayer'
import styles from './LinkDetails.module.css'
import LinkDetailsForm from './LinkDetailsForm'
import LinkDetailsGallery from './LinkDetailsGallery'
import LinkDetailsHeader from './LinkDetailsHeader'
import LinkDetailsNav from './LinkDetailsNav'

export default function LinkDetailsColumn ({ data, links, actualDesktop, slug }) {
  console.log('🚀 ~ LinkDetailsColumn ~ links:', links)
  return (
    <section className={styles.link_details_panel}>
      <div className={styles.link_details_content}>
        <LinkDetailsHeader data={data} context={'singlecol'} />
        <LinkDetailsForm data={data} />
        <PasteImageIcon />
        <LinkDetailsNav links={links} actualDesktop={actualDesktop} linkId={data?._id} context={'singlecol'} slug={slug} />
        <h3>Related Links</h3>
      </div>
      <div className={styles.link_details_media}>
        <VideoPlayer src={data?.url} />
        <LinkDetailsGallery data={data} />
      </div>
    </section>
  )
}
