import Accordion from '@yoopta/accordion'
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list'
import Blockquote from '@yoopta/blockquote'
import Callout from '@yoopta/callout'
import Code from '@yoopta/code'
import Divider from '@yoopta/divider'
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor'
import Embed from '@yoopta/embed'
import File from '@yoopta/file'
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings'
import Image from '@yoopta/image'
import Link from '@yoopta/link'
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool'
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists'
import { Bold, CodeMark, Highlight, Italic, Strike, Underline } from '@yoopta/marks'
import Paragraph from '@yoopta/paragraph'
import Table from '@yoopta/table'
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar'
import Video from '@yoopta/video'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchImage, updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import styles from './LinkDetailsNotes.module.css'

const plugins = [
  Paragraph,
  Blockquote,
  Table,
  Divider,
  Accordion,
  Code,
  Embed,
  Image.extend({
    options: {
      async onUpload (file) {
        const imageUrl = URL.createObjectURL(file)
        const data = await fetchImage({ imageUrl, linkId: '6892646fea856ea73ab59820' })

        return {
          src: data.signedUrl,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height
          }
        }
      }
    }
  }),
  Link,
  File,
  Callout,
  Video,
  HeadingOne,
  HeadingThree,
  HeadingTwo,
  NumberedList,
  BulletedList,
  TodoList
]
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

export default function Editor ({ data }) {
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const editorContainerRef = useRef(null)
  const linkId = data?._id
  const notesValue = useMemo(() => data?.notes || {}, [data?.notes])
  const [value, setValue] = useState(notesValue)
  const isReady = Boolean(data && linkId)

  useEffect(() => {
    console.log('ha cambiado')
    console.log('🚀 ~ Editor ~ value:', value)
    console.log('🚀 ~ Editor ~ value:', data?.notes ? Object.keys(data.notes) : [])

    setValue(notesValue)
  }, [linkId, notesValue])

  const editor = useMemo(() => createYooptaEditor(), [linkId])

  const onChange = (value) => {
    setValue(value)
  }

  const getCurrentEditorValue = () => {
    return editor.getEditorValue?.() || value
  }

  const getRenderedEditorRoot = () => {
    if (!editorContainerRef.current) return null

    return editorContainerRef.current.querySelector('.yoopta-editor') || editorContainerRef.current
  }

  const getRenderedBlocks = () => {
    const editorRoot = getRenderedEditorRoot()
    if (!editorRoot) return []

    return Array.from(editorRoot.querySelectorAll('[data-yoopta-block-id]'))
  }

  const getSanitizedEditorClone = () => {
    const editorRoot = getRenderedEditorRoot()
    if (!editorRoot) return null

    const clone = editorRoot.cloneNode(true)

    clone.querySelectorAll('.yoopta-block-actions, .yoopta-extended-block-actions, [contenteditable="false"], [role="toolbar"], [data-radix-popper-content-wrapper]').forEach((element) => {
      element.remove()
    })

    clone.querySelectorAll('[contenteditable="true"]').forEach((element) => {
      element.removeAttribute('contenteditable')
      element.removeAttribute('spellcheck')
      element.removeAttribute('role')
    })

    return clone
  }

  const getCleanBlockText = (block) => {
    const clone = block.cloneNode(true)

    clone.querySelectorAll('.yoopta-block-actions, .yoopta-extended-block-actions, [contenteditable="false"], [role="toolbar"], [data-radix-popper-content-wrapper]').forEach((element) => {
      element.remove()
    })

    const text = clone.innerText?.trim() || clone.textContent?.trim() || ''

    return text
      .replace(/To pick up a draggable item,[\s\S]*?cancel\./gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const getNotesPlainText = () => {
    const renderedBlocks = getRenderedBlocks()

    if (renderedBlocks.length > 0) {
      const plainText = renderedBlocks
        .map((block) => getCleanBlockText(block))
        .filter(Boolean)
        .join('\n\n')
        .trim()

      if (plainText) return plainText
    }

    const sanitizedClone = getSanitizedEditorClone()
    const renderedPlainText = sanitizedClone?.innerText?.trim() || sanitizedClone?.textContent?.trim() || ''

    if (renderedPlainText) return renderedPlainText

    const currentValue = getCurrentEditorValue()
    const serializedPlainText = editor.getPlainText?.(currentValue)?.trim()

    if (serializedPlainText) return serializedPlainText

    return ''
  }

  const getPrintableNotesHtml = () => {
    const sanitizedClone = getSanitizedEditorClone()
    const renderedHtml = sanitizedClone?.innerHTML?.trim()

    if (renderedHtml) return renderedHtml

    const currentValue = getCurrentEditorValue()
    const serializedHtml = editor.getHTML?.(currentValue)?.trim()

    if (serializedHtml) return serializedHtml

    const renderedBlocks = getRenderedBlocks()

    if (renderedBlocks.length === 0) return ''

    return renderedBlocks
      .map((block) => {
        const clone = block.cloneNode(true)

        clone.querySelectorAll('.yoopta-block-actions, .yoopta-extended-block-actions, [contenteditable="false"]').forEach((element) => {
          element.remove()
        })

        return clone.outerHTML
      })
      .join('')
      .trim()
  }

  const handleSaveNotes = async () => {
    if (!linkId) return

    const previousState = [...globalLinks]
    const optimisticState = [...globalLinks]
    const elementIndex = optimisticState.findIndex(element => element._id === linkId)
    if (elementIndex !== -1) {
      const currentLink = optimisticState[elementIndex]
      optimisticState[elementIndex] = { ...currentLink, notes: value }
      setGlobalLinks(optimisticState)
    }
    const response = await updateLink({ items: [{ id: linkId, notes: value }] })
    const { hasError, message } = handleResponseErrors(response)

    if (hasError) {
      console.log('revertimos')
      setGlobalLinks(previousState)
      toast.error(message)
    } else {
      toast.success('Notes updated successfully')
    }
  }

  const handleCopyNotes = async () => {
    const plainText = getNotesPlainText()

    if (!plainText) {
      toast.error('No hay notas para copiar')
      return
    }

    try {
      await navigator.clipboard.writeText(plainText)
      toast.success('Notas copiadas al portapapeles')
    } catch (error) {
      console.error(error)
      toast.error('No se pudieron copiar las notas')
    }
  }

  const handlePrintNotes = () => {
    const plainText = getNotesPlainText()

    if (!plainText) {
      toast.error('No hay notas para imprimir')
      return
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700')

    if (!printWindow) {
      toast.error('No se pudo abrir la ventana de impresión')
      return
    }

    const notesHtml = getPrintableNotesHtml()

    if (!notesHtml) {
      toast.error('No se pudieron preparar las notas para imprimir')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Notas</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 32px;
              color: #111827;
              line-height: 1.5;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            p, ul, ol, blockquote, pre, table {
              margin-bottom: 1rem;
            }
            ul, ol {
              padding-left: 1.5rem;
              list-style-position: outside;
            }
            li {
              display: list-item;
              margin-bottom: 0.35rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 8px;
              text-align: left;
            }
            img, video {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <h1>Notas</h1>
          ${notesHtml}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  if (!isReady) return null

  return (
    <>
      <div ref={editorContainerRef} className={styles.editor_container}>
        <YooptaEditor
          key={linkId}
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
      <div className={styles.actions_row}>
        <button className={styles.secondary_action_button} type="button" onClick={handleCopyNotes}>Copy</button>
        <button className={styles.secondary_action_button} type="button" onClick={handlePrintNotes}>Print</button>
        <button className={styles.primary_action_button} type="button" onClick={handleSaveNotes}>Save</button>
      </div>
    </>
  )
}
