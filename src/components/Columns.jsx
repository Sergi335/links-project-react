import { DndContext, DragOverlay, MouseSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { useDragItems } from '../hooks/useDragItems'
import Columna from './column'
import CustomLink from './customlink'
import linkStyles from './customlink.module.css'
import FolderIcon from './Icons/folder'
import styles from './ListOfLinks.module.css'
import LinkLoader from './Loaders/LinkLoader'
import SingleColumn from './SingleColumn'
import SingleColumnLink from './SingleColumnLink'

export default function Columns ({
  desktopColumns,
  desktopLinks,
  getLinksIds,
  linkLoader,
  columnLoaderTarget,
  numberOfLinkLoaders,
  context = 'multi', // 'single' for SingleColumnPage, 'multi' for ListOfLinks
  styleOfColumns,
  categories,
  slug,
  getFirstColumnLink,
  getLinksForColumn,
  parentCategoryId
}) {
  const { desktopName } = useParams()
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const [columnsId, setColumnsId] = useState([])
  const [filteredColumns, setFilteredColumns] = useState([])

  // Get the appropriate drag items hook based on context
  // Usar parentCategoryId si está disponible (viene de ListOfLinks con el ID correcto)
  const dragHookProps = context === 'single'
    ? { desktopName }
    : { desktopId: parentCategoryId || categories?.find(category => category.slug === desktopName)?._id }

  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink, activeColumn } = useDragItems(dragHookProps)

  // DND sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )

  useEffect(() => {
    // Get column IDs for DND - excluir columnas virtuales
    const columnsId = desktopColumns
      ?.filter(col => !col?.isVirtual)
      ?.map((col) => col?._id)
    setColumnsId(columnsId)
    // Filter columns based on context
    const choosenColumns = context === 'single'
      ? desktopColumns?.filter(columna => columna?.slug === slug)
      : desktopColumns
    setFilteredColumns(choosenColumns)
  }, [desktopColumns, context, slug])

  // Choose the appropriate column component
  const ColumnComponent = context === 'single' ? SingleColumn : Columna
  const LinkComponent = context === 'single' ? SingleColumnLink : CustomLink

  // Content wrapper style
  const contentStyle = context === 'single'
    ? {}
    : { gridTemplateColumns: styleOfColumns }

  // Wrapper class
  const wrapperClass = context === 'single'
    ? styles.lol_content_wrapper
    : styles.lol_content_wrapper

  const contentClass = context === 'single'
    ? styles.sp_lol_content
    : styles.lol_content

  if (!filteredColumns || filteredColumns.length === 0) {
    return (
      <div className={wrapperClass}>
        <div className={contentClass} style={contentStyle}>
          <p>No hay Categorías, crea una</p>
        </div>
      </div>
    )
  }

  return (
    <>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            strategy={context === 'single' ? verticalListSortingStrategy : rectSortingStrategy}
            items={columnsId}
          >
            {filteredColumns.map((columna) => (
              <ColumnComponent
                key={columna._id}
                data={{ columna }}
                childCount={getLinksIds(columna).length}
                context={context === 'single' ? 'singlecol' : undefined}
                getFirstColumnLink={getFirstColumnLink}
                isVirtual={columna.isVirtual}
              >
                <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                  {!activeColumn &&
                    (() => {
                      // Usar getLinksForColumn si está disponible, sino filtrar por categoryId
                      const columnLinks = getLinksForColumn
                        ? getLinksForColumn(columna)
                        : desktopLinks.filter(link => link.categoryId === columna._id)

                      return columnLinks.map((link) => (
                        <LinkComponent
                          key={link._id}
                          data={{ link }}
                          idpanel={columna.isVirtual ? columna.originalCategoryId : columna._id}
                          desktopName={desktopName}
                          className={context === 'single' ? 'flex' : undefined}
                          context={context === 'single' ? 'singlecol' : undefined}
                        />
                      ))
                    })()
                  }

                  {/* Subcategories - only for multi-column context and non-virtual columns */}
                  {categories && !columna.isVirtual && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {categories.map((col) => {
                        if (col.parentId === columna._id) {
                          return (
                            <Link
                              key={col._id}
                              className={styles.subcategories}
                              to={`${rootPath}${basePath}/${columna.slug}/${col.slug}/${getFirstColumnLink(col)?._id}`}
                            >
                              <FolderIcon width={16} height={16} style={{ marginRight: '5px' }} />
                              {col.name}
                            </Link>
                          )
                        }
                        return null
                      })}
                    </div>
                  )}

                  {/* Link loaders */}
                  {linkLoader && columna._id === columnLoaderTarget?.id && (
                    numberOfLinkLoaders.map((item, index) => (
                      <LinkLoader key={index} />
                    ))
                  )}
                </SortableContext>
              </ColumnComponent>
            ))}
          </SortableContext>

          {/* Drag overlay */}
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnComponent data={{ activeColumn }}>
                </ColumnComponent>
              )}
              {activeLink && (
                <LinkComponent
                  data={{ activeLink }}
                  className={linkStyles.floatLink}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </>
  )
}
