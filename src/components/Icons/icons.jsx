export default function GithubIcon () {
  return (
      <svg
        width="24"
        height="24"
        data-view-component="true"
        viewBox="0 0 16 16"
      >
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8z"></path>
      </svg>
  )
}
export function MaximizeIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path>
      <path d="M4 16v2a2 2 0 0 0 2 2h2"></path>
      <path d="M16 4h2a2 2 0 0 1 2 2v2"></path>
      <path d="M16 20h2a2 2 0 0 0 2 -2v-2"></path>
    </svg>
  )
}
export function PasteImageIcon () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="uiIcon-button" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
  )
}
export function CloseIcon ({ className = 'uiIcon-button' }) {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
  )
}
export function CodeIcon () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" /></svg>
  )
}
export function TrashIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
  )
}
export function AddImageIcon () {
  return (
    <svg className="uiIcon-button icon icon-tabler icon-tabler-camera-plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"></path><path d="M16 19h6"></path><path d="M19 16v6"></path><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path></svg>
  )
}
export function DuplicatesIcon () {
  return (
    <svg className="uiIcon-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path></svg>
  )
}
export function BrokenLinksIcon () {
  return (
    <svg className="uiIcon-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path></svg>
  )
}
export function UploadIcon () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon-button">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>

  )
}
export function KeyIcon () {
  return (
    <svg className="uiIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"></path></svg>
  )
}
export function ArrowDown ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>

  )
}
export function ArrowUp ({ className = 'uiIcon', style }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>

  )
}
export function ArrowRight () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="uiIcon-button icon-tabler icon-tabler-arrow-big-right-lines-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.585l-1.999 .001a1 1 0 0 0 -1 1v6l.007 .117a1 1 0 0 0 .993 .883l1.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z" strokeWidth="0" fill="currentColor" /><path d="M3 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z" strokeWidth="0" fill="currentColor" /><path d="M6 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z" strokeWidth="0" fill="currentColor" /></svg>
  )
}
export function ArrowLeft () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="uiIcon-button icon-tabler icon-tabler-arrow-big-left-lines-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h2a1 1 0 0 0 1 -1v-6l-.007 -.117a1 1 0 0 0 -.993 -.883l-2 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z" strokeWidth="0" fill="currentColor" /><path d="M21 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z" strokeWidth="0" fill="currentColor" /><path d="M18 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z" strokeWidth="0" fill="currentColor" /></svg>
  )
}
export function FolderMoveIcon ({ className = 'uiIcon-button' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 19h-8a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v4" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" /></svg>
  )
}
export function EditIcon ({ className = 'uiIcon-button' }) {
  return (
    <svg className={className} id="editDesk" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
  )
}
export function AddPlusIcon ({ className = 'uiIcon' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  )
}
export function PasteLinkIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>
  )
}
export function EditTextIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12h4" /><path d="M9 4a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3" /><path d="M15 4a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3" /></svg>
  )
}
export function CheckIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
  )
}
export function HeartBrokenIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /><path d="M12 6l-2 4l4 3l-2 4v3" /></svg>
  )
}
export function SearchIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
  )
}
export function MenuIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
  )
}
export function SelectIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 8m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" /><path d="M12 20v.01" /><path d="M16 20v.01" /><path d="M8 20v.01" /><path d="M4 20v.01" /><path d="M4 16v.01" /><path d="M4 12v.01" /><path d="M4 8v.01" /><path d="M4 4v.01" /><path d="M8 4v.01" /><path d="M12 4v.01" /><path d="M16 4v.01" /><path d="M20 4v.01" /><path d="M20 8v.01" /><path d="M20 12v.01" /><path d="M20 16v.01" /><path d="M20 20v.01" /></svg>
  )
}
export function ExpandHeightIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h6" /><path d="M18 14v7" /><path d="M18 3v7" /><path d="M15 18l3 3l3 -3" /><path d="M15 6l3 -3l3 3" /></svg>
  )
}
export function GoogleLogo () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
  )
}
export function HidePanels ({ className = 'uiIcon', id }) {
  return (
    <svg id={id} className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>
  )
}
export function ReadingListIcon ({ className = 'uiIcon', id }) {
  return (
    <svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"></path></svg>
  )
}
export function EditDeskIcon ({ className = 'uiIcon', id }) {
  return (
    <svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
  )
}
export function AddColumnIcon ({ className = 'uiIcon', id }) {
  return (
    <svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path></svg>
  )
}
export function PinPanelIcon ({ className = 'uiIcon', id }) {
  return (
    <svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" /><path d="M9 15l-4.5 4.5" /><path d="M14.5 4l5.5 5.5" /></svg>
  )
}
export function SunIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  )
}
export function SettingsIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
    </svg>
  )
}
export function AddDesktopIcon ({ className = 'uiIcon' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  )
}
export function ChangeLayoutIcon ({ className = 'uiIcon' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"></path></svg>
  )
}
export function SwitchOffIcon ({ className = 'uiIcon' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"></path></svg>
  )
}
export function PlusIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
  )
}
export function MinusIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /></svg>
  )
}
export function MoonIcon ({ className = 'uiIcon' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  )
}
export function ExternalLink ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>
  )
}
export function EyeIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </svg>
  )
}
export function EyeOffIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
      <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
      <path d="M3 3l18 18" />
    </svg>
  )
}
export function CloseMenuIcon ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
  )
}
export function SettingsWheelIcon ({ className = 'uiIcon' }) {
  return (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
  )
}
export function YouTube ({ className = 'uiIcon' }) {
  return (
  <svg className={className} preserveAspectRatio="xMidYMid" viewBox="0 0 256 180">
    <path
      fill="red"
      d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
    />
    <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
  </svg>
  )
}
export function Sparkles ({ className = 'uiIcon' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6" /></svg>
  )
}
export const Chrome = (props) => (
  <svg {...props} preserveAspectRatio="xMidYMid" viewBox="0 0 190.5 190.5">
    <path
      fill="#fff"
      d="M95.252 142.873c26.304 0 47.627-21.324 47.627-47.628s-21.323-47.628-47.627-47.628-47.627 21.324-47.627 47.628 21.323 47.628 47.627 47.628z"
    />
    <path
      fill="#229342"
      d="m54.005 119.07-41.24-71.43a95.227 95.227 0 0 0-.003 95.25 95.234 95.234 0 0 0 82.496 47.61l41.24-71.43v-.011a47.613 47.613 0 0 1-17.428 17.443 47.62 47.62 0 0 1-47.632.007 47.62 47.62 0 0 1-17.433-17.437z"
    />
    <path
      fill="#fbc116"
      d="m136.495 119.067-41.239 71.43a95.229 95.229 0 0 0 82.489-47.622A95.24 95.24 0 0 0 190.5 95.248a95.237 95.237 0 0 0-12.772-47.623H95.249l-.01.007a47.62 47.62 0 0 1 23.819 6.372 47.618 47.618 0 0 1 17.439 17.431 47.62 47.62 0 0 1-.001 47.633z"
    />
    <path
      fill="#1a73e8"
      d="M95.252 132.961c20.824 0 37.705-16.881 37.705-37.706S116.076 57.55 95.252 57.55 57.547 74.431 57.547 95.255s16.881 37.706 37.705 37.706z"
    />
    <path
      fill="#e33b2e"
      d="M95.252 47.628h82.479A95.237 95.237 0 0 0 142.87 12.76 95.23 95.23 0 0 0 95.245 0a95.222 95.222 0 0 0-47.623 12.767 95.23 95.23 0 0 0-34.856 34.872l41.24 71.43.011.006a47.62 47.62 0 0 1-.015-47.633 47.61 47.61 0 0 1 41.252-23.815z"
    />
  </svg>
)
export const Edge = (props) => (
  <svg {...props} viewBox="0 0 256 256">
    <defs>
      <radialGradient
        id="edge__b"
        cx="161.8"
        cy="68.9"
        r="95.4"
        gradientTransform="matrix(1 0 0 -.95 0 248.8)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".7" stopOpacity="0" />
        <stop offset=".9" stopOpacity=".5" />
        <stop offset="1" />
      </radialGradient>
      <radialGradient
        id="edge__d"
        cx="-340.3"
        cy="63"
        r="143.2"
        gradientTransform="matrix(.15 -.99 -.8 -.12 176.6 -125.4)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".8" stopOpacity="0" />
        <stop offset=".9" stopOpacity=".5" />
        <stop offset="1" />
      </radialGradient>
      <radialGradient
        id="edge__e"
        cx="113.4"
        cy="570.2"
        r="202.4"
        gradientTransform="matrix(-.04 1 2.13 .08 -1179.5 -106.7)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#35c1f1" />
        <stop offset=".1" stopColor="#34c1ed" />
        <stop offset=".2" stopColor="#2fc2df" />
        <stop offset=".3" stopColor="#2bc3d2" />
        <stop offset=".7" stopColor="#36c752" />
      </radialGradient>
      <radialGradient
        id="edge__f"
        cx="376.5"
        cy="568"
        r="97.3"
        gradientTransform="matrix(.28 .96 .78 -.23 -303.8 -148.5)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#66eb6e" />
        <stop offset="1" stopColor="#66eb6e" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        id="edge__a"
        x1="63.3"
        x2="241.7"
        y1="84"
        y2="84"
        gradientTransform="matrix(1 0 0 -1 0 266)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#0c59a4" />
        <stop offset="1" stopColor="#114a8b" />
      </linearGradient>
      <linearGradient
        id="edge__c"
        x1="157.3"
        x2="46"
        y1="161.4"
        y2="40.1"
        gradientTransform="matrix(1 0 0 -1 0 266)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#1b9de2" />
        <stop offset=".2" stopColor="#1595df" />
        <stop offset=".7" stopColor="#0680d7" />
        <stop offset="1" stopColor="#0078d4" />
      </linearGradient>
    </defs>
    <path
      fill="url(#edge__a)"
      d="M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z"
      transform="translate(-4.6 -5)"
    />
    <path
      fill="url(#edge__b)"
      d="M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z"
      opacity=".35"
      style={{ isolation: 'isolate' }}
      transform="translate(-4.6 -5)"
    />
    <path
      fill="url(#edge__c)"
      d="M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z"
      transform="translate(-4.6 -5)"
    />
    <path
      fill="url(#edge__d)"
      d="M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z"
      opacity=".41"
      style={{ isolation: 'isolate' }}
      transform="translate(-4.6 -5)"
    />
    <path
      fill="url(#edge__e)"
      d="M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z"
      transform="translate(-4.6 -5)"
    />
    <path
      fill="url(#edge__f)"
      d="M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z"
      transform="translate(-4.6 -5)"
    />
  </svg>
)
export const BraveBrowser = (props) => (
  <svg
    {...props}
    viewBox="0 0 256 301"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    preserveAspectRatio="xMidYMid"
  >
    <defs>
      <linearGradient
        x1="0%"
        y1="50.017894%"
        x2="100.096998%"
        y2="50.017894%"
        id="brave__linearGradient-1"
      >
        <stop stopColor="#FFFFFF" offset="0%" />
        <stop stopColor="#FFFFFF" stopOpacity="0.9576" offset="14.13%" />
        <stop stopColor="#FFFFFF" stopOpacity="0.7" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="-0.0390588235%"
        y1="49.9824538%"
        x2="100%"
        y2="49.9824538%"
        id="brave__linearGradient-2"
      >
        <stop stopColor="#F1F1F2" offset="0%" />
        <stop stopColor="#E4E5E6" offset="9.191442%" />
        <stop stopColor="#D9DADB" offset="23.57%" />
        <stop stopColor="#D2D4D5" offset="43.8%" />
        <stop stopColor="#D0D2D3" offset="100%" />
      </linearGradient>
    </defs>
    <g>
      <path
        d="M256,97.1 L246.7,72 L253.1,57.6 C253.9,55.7 253.5,53.6 252.1,52.1 L234.6,34.4 C226.9,26.7 215.5,24 205.2,27.6 L200.3,29.3 L173.5,0.3 L128.2,0 L127.9,0 L82.3,0.4 L55.6,29.6 L50.8,27.9 C40.4,24.2 28.9,26.9 21.2,34.8 L3.4,52.8 C2.2,54 1.9,55.7 2.5,57.2 L9.2,72.2 L0,97.3 L6,120 L33.2,223.3 C36.3,235.2 43.5,245.6 53.6,252.8 C53.6,252.8 86.6,276.1 119.1,297.2 C122,299.1 125,300.4 128.2,300.4 C131.4,300.4 134.4,299.1 137.3,297.2 C173.9,273.2 202.8,252.7 202.8,252.7 C212.8,245.5 220,235.1 223.1,223.2 L250.1,119.9 L256,97.1 Z"
        fill="#F15A22"
      />
      <path
        d="M34.5,227.7 L0,99.5 L10.1,74.4 L3.1,55.8 L19.8,38.8 C25.3,33.9 36.1,32.2 41.1,35.1 L67.2,50.1 L101.2,58 L127.7,47 L129.9,274.7 C129.5,307.5 131.6,304 107.5,288.5 L48,248.6 C41.6,242.5 36.7,235.6 34.5,227.7 Z"
        fill="url(#brave__linearGradient-1)"
        opacity="0.15"
        style={{ mixBlendMode: 'lighten' }}
      />
      <path
        d="M202.2,252.245742 L151.6,286.845742 C137.5,294.545742 130.7,302.145742 129.6,298.445742 C128.7,295.545742 129.4,287.045742 129.1,273.845742 L128.5,51.1457423 C128.6,48.9457423 130.1,45.2457423 132.7,45.6457423 L158.5,53.4457423 L195.7,47.6457423 L220.3,29.5457423 C222.9,27.5457423 226.7,27.7457423 229.1,30.0457423 L251.1,51.0457423 C253.1,53.1457423 253.2,57.2457423 252,59.8457423 L245.9,71.1457423 L256,97.2457423 L221.2,226.645742 C215.8,242.745742 208.2,246.945742 202.2,252.245742 Z"
        fill="url(#brave__linearGradient-2)"
        opacity="0.4"
        style={{ mixBlendMode: 'darken' }}
      />
      <path
        d="M134,184.801367 C132.8,184.301367 131.5,183.901367 131.1,183.901367 L129.5,183.901367 L127.9,183.901367 C127.5,183.901367 126.2,184.301367 125,184.801367 L112,190.201367 C110.8,190.701367 108.8,191.601367 107.6,192.201367 L88,202.401367 C86.8,203.001367 86.7,204.101367 87.8,204.901367 L105.1,217.101367 C106.2,217.901367 107.9,219.201367 108.9,220.101367 L116.6,226.701367 C117.6,227.601367 119.2,229.001367 120.2,229.901367 L127.6,236.501367 C128.6,237.401367 130.2,237.401367 131.2,236.501367 L138.8,229.901367 C139.8,229.001367 141.4,227.601367 142.4,226.701367 L150.1,220.001367 C151.1,219.101367 152.8,217.801367 153.9,217.001367 L171.2,204.701367 C172.3,203.901367 172.2,202.801367 171,202.201367 L151.4,192.201367 C150.2,191.601367 148.2,190.701367 147,190.201367 L134,184.801367 Z"
        fill="#FFFFFF"
      />
      <path
        d="M227.813299,101.557129 C228.213299,100.257129 228.213299,99.7571289 228.213299,99.7571289 C228.213299,98.4571289 228.113299,96.2571289 227.913299,94.9571289 L226.913299,92.0571289 C226.313299,90.8571289 225.313299,88.9571289 224.513299,87.8571289 L213.213299,71.1571289 C212.513299,70.0571289 211.213299,68.3571289 210.313299,67.2571289 L195.713299,48.9571289 C194.913299,47.9571289 194.113299,47.0571289 194.013299,47.1571289 L193.813299,47.1571289 C193.813299,47.1571289 192.713299,47.3571289 191.413299,47.5571289 L169.113299,51.9571289 C167.813299,52.2571289 165.713299,52.6571289 164.413299,52.8571289 L164.013299,52.9571289 C162.713299,53.1571289 160.613299,53.0571289 159.313299,52.6571289 L140.613299,46.6571289 C139.313299,46.2571289 137.213299,45.6571289 136.013299,45.3571289 C136.013299,45.3571289 132.213299,44.4571289 129.113299,44.5571289 C126.013299,44.5571289 122.213299,45.3571289 122.213299,45.3571289 C120.913299,45.6571289 118.813299,46.2571289 117.613299,46.6571289 L98.9132993,52.6571289 C97.6132993,53.0571289 95.5132993,53.1571289 94.2132993,52.9571289 L93.8132993,52.8571289 C92.5132993,52.6571289 90.4132993,52.1571289 89.1132993,51.9571289 L66.6132993,47.7571289 C65.3132993,47.4571289 64.2132993,47.3571289 64.2132993,47.3571289 L64.0132993,47.3571289 C63.9132993,47.3571289 63.1132993,48.1571289 62.3132993,49.1571289 L47.7132993,67.4571289 C46.9132993,68.4571289 45.6132993,70.2571289 44.8132993,71.3571289 L33.5132993,88.0571289 C32.8132993,89.1571289 31.7132993,91.0571289 31.1132993,92.2571289 L30.1132993,95.1571289 C29.9132993,96.4571289 29.7132993,98.6571289 29.8132993,99.9571289 C29.8132993,99.9571289 29.8132993,100.357129 30.2132993,101.757129 C30.9132993,104.157129 32.6132993,106.357129 32.6132993,106.357129 C33.4132993,107.357129 34.9132993,109.057129 35.8132993,109.957129 L68.9132993,145.157129 C69.8132993,146.157129 70.1132993,147.957129 69.6132993,149.157129 L62.7132993,165.457129 C62.2132993,166.657129 62.1132993,168.657129 62.6132993,169.957129 L64.5132993,175.057129 C66.1132993,179.357129 68.8132993,183.157129 72.4132993,186.057129 L79.1132993,191.457129 C80.1132993,192.257129 81.9132993,192.557129 83.1132993,191.957129 L104.313299,181.857129 C105.513299,181.257129 107.313299,180.057129 108.313299,179.157129 L123.513299,165.457129 C125.713299,163.457129 125.813299,160.057129 123.813299,157.857129 L91.9132993,136.357129 C90.8132993,135.657129 90.4132993,134.057129 91.0132993,132.857129 L105.013299,106.457129 C105.613299,105.257129 105.713299,103.357129 105.213299,102.157129 L103.513299,98.2571289 C103.013299,97.0571289 101.513299,95.6571289 100.313299,95.1571289 L59.2132993,79.7571289 C58.0132993,79.2571289 58.0132993,78.7571289 59.3132993,78.6571289 L85.8132993,76.1571289 C87.1132993,76.0571289 89.2132993,76.2571289 90.5132993,76.5571289 L114.113299,83.1571289 C115.413299,83.5571289 116.213299,84.8571289 116.013299,86.1571289 L107.813299,131.057129 C107.613299,132.357129 107.613299,134.157129 107.913299,135.157129 C108.213299,136.157129 109.513299,137.057129 110.813299,137.357129 L127.213299,140.857129 C128.513299,141.157129 130.613299,141.157129 131.913299,140.857129 L147.213299,137.357129 C148.513299,137.057129 149.813299,136.057129 150.113299,135.157129 C150.413299,134.257129 150.513299,132.357129 150.213299,131.057129 L142.113299,86.1571289 C141.913299,84.8571289 142.713299,83.4571289 144.013299,83.1571289 L167.613299,76.5571289 C168.913299,76.1571289 171.013299,76.0571289 172.313299,76.1571289 L198.813299,78.6571289 C200.113299,78.7571289 200.213299,79.2571289 198.913299,79.7571289 L157.813299,95.3571289 C156.613299,95.8571289 155.113299,97.1571289 154.613299,98.4571289 L152.913299,102.357129 C152.413299,103.557129 152.413299,105.557129 153.113299,106.657129 L167.213299,133.057129 C167.813299,134.257129 167.413299,135.757129 166.313299,136.557129 L134.413299,158.157129 C132.313299,160.257129 132.513299,163.757129 134.713299,165.757129 L149.913299,179.457129 C150.913299,180.357129 152.713299,181.557129 153.913299,182.057129 L175.213299,192.157129 C176.413299,192.757129 178.213299,192.457129 179.213299,191.657129 L185.913299,186.157129 C189.513299,183.257129 192.213299,179.457129 193.713299,175.157129 L195.613299,170.057129 C196.113299,168.857129 196.013299,166.757129 195.513299,165.557129 L188.613299,149.257129 C188.113299,148.057129 188.413299,146.257129 189.313299,145.257129 L222.413299,110.057129 C223.313299,109.057129 224.713299,107.457129 225.613299,106.457129 C225.413299,106.157129 227.213299,103.957129 227.813299,101.557129 Z"
        fill="#FFFFFF"
      />
    </g>
  </svg>
)
export const Opera = (props) => (
  <svg {...props} xmlSpace="preserve" viewBox="0 0 1000 1000">
    <linearGradient
      id="opera__a"
      x1="416.6229"
      x2="416.6229"
      y1="16.304"
      y2="985.446"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset=".3" stopColor="#ff1b2d" />
      <stop offset=".4381" stopColor="#fa1a2c" />
      <stop offset=".5939" stopColor="#ed1528" />
      <stop offset=".7581" stopColor="#d60e21" />
      <stop offset=".9272" stopColor="#b70519" />
      <stop offset="1" stopColor="#a70014" />
    </linearGradient>
    <path
      fill="url(#opera__a)"
      d="M335.4 781.8c-55.3-65.3-91.1-161.7-93.5-270v-23.6c2.4-108.3 38.2-204.7 93.5-270C407.2 125.1 513.8 66 632.8 66c73.2 0 141.8 22.4 200.4 61.3C745.2 48.5 629.2.5 501.9 0H500C223.9 0 0 223.9 0 500c0 268.2 211.1 487 476.2 499.4 7.9.4 15.8.6 23.8.6 128 0 244.8-48.1 333.2-127.2-58.6 38.8-127.1 61.2-200.4 61.2-119 0-225.6-59.1-297.4-152.2z"
    />
    <linearGradient
      id="opera__b"
      x1="667.7092"
      x2="667.7092"
      y1="73.4257"
      y2="930.5844"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#9c0000" />
      <stop offset=".7" stopColor="#ff4b4b" />
    </linearGradient>
    <path
      fill="url(#opera__b)"
      d="M335.4 218.2c45.9-54.2 105.1-86.8 169.9-86.8 145.6 0 263.5 165 263.5 368.6s-118 368.6-263.5 368.6c-64.7 0-124-32.7-169.9-86.8C407.2 874.9 513.8 934 632.8 934c73.2 0 141.8-22.4 200.4-61.2C935.6 781.2 1000 648.1 1000 500c0-148.1-64.4-281.2-166.8-372.7C774.6 88.4 706.1 66 632.8 66c-119 0-225.6 59.1-297.4 152.2z"
    />
  </svg>
)
