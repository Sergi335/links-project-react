import Accordion from '@yoopta/accordion'
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list'
import Blockquote from '@yoopta/blockquote'
import Callout from '@yoopta/callout'
import Code from '@yoopta/code'
import Divider from '@yoopta/divider'
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor'
import Embed from '@yoopta/embed'
import File from '@yoopta/file'
// import Headings from '@yoopta/headings'
import Image from '@yoopta/image'
import Link from '@yoopta/link'
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool'
// import LISTS from '@yoopta/lists'
import { Bold, CodeMark, Highlight, Italic, Strike, Underline } from '@yoopta/marks'
import Paragraph from '@yoopta/paragraph'
import Table from '@yoopta/table'
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar'
import Video from '@yoopta/video'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import styles from './LinkDetailsNotes.module.css'

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender
  }
}
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight]
const plugins = [Paragraph, Blockquote, Table, Divider, Accordion, Code, Embed, Image, Link, File, Callout, Video]

export default function Editor ({ data }) {
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const [value, setValue] = useState(data.notes || {})

  useEffect(() => {
    console.log('ha cambiado')

    setValue(data.notes || {})
  }, [data._id])

  const editor = useMemo(() => createYooptaEditor(), [data._id])

  const onChange = (value) => {
    setValue(value)
  }

  const handleSaveNotes = async () => {
    const previousState = [...globalLinks]
    const optimisticState = [...globalLinks]
    const elementIndex = optimisticState.findIndex(element => element._id === data._id)
    if (elementIndex !== -1) {
      const currentLink = optimisticState[elementIndex]
      optimisticState[elementIndex] = { ...currentLink, notes: value }
      setGlobalLinks(optimisticState)
    }
    const response = await updateLink({ items: [{ id: data._id, notes: value }] })
    const { hasError, message } = handleResponseErrors(response)

    if (hasError) {
      console.log('revertimos')
      setGlobalLinks(previousState)
      toast.error(message)
    } else {
      toast.success('Notes updated successfully')
    }
  }

  return (
    <>
      <div className={styles.editor_container}>
        <YooptaEditor
          key={data._id}
          editor={editor}
          placeholder="Type text.."
          value={data.notes || {}}
          onChange={onChange}
          // here we go
          plugins={plugins}
          tools={TOOLS}
          marks={MARKS}
          width="100%"
        />
      </div>
      <button style={{ marginTop: '16px', maxWidth: 'fit-content' }} onClick={handleSaveNotes}>Save</button>
    </>
  )
}
