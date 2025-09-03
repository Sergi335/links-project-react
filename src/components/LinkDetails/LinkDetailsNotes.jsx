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
import { useMemo, useState } from 'react'
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

export default function Editor () {
  const editor = useMemo(() => createYooptaEditor(), [])
  const [value, setValue] = useState()
  const onChange = (value, options) => {
    setValue(value)
  }

  return (
    <div className={styles.editor_container}>
      <YooptaEditor
        editor={editor}
        placeholder="Type text.."
        value={value}
        onChange={onChange}
        // here we go
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        width="100%"
      />
    </div>
  )
}
