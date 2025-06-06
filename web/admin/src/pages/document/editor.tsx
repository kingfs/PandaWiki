import { getNodeDetail, NodeDetail, updateNode, uploadFile } from "@/api";
import { useAppDispatch } from "@/store";
import { setKbId } from "@/store/slices/config";
import { Box, Stack } from "@mui/material";
import { Message } from "ct-mui";
import { TiptapEditor, TiptapToolbar, useTiptapEditor } from 'ct-tiptap-editor';
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EditorDocNav from "./component/EditorDocNav";
import EditorFolder from "./component/EditorFolder";
import EditorHeader from "./component/EditorHeader";

const DocEditor = () => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const { id = '' } = useParams()
  const dispatch = useAppDispatch()
  const [detail, setDetail] = useState<NodeDetail | null>(null)
  const [headings, setHeadings] = useState<{ id: string, title: string, heading: number }[]>([])
  const [maxH, setMaxH] = useState(0)

  const getDetail = () => {
    getNodeDetail({ id }).then(res => {
      setDetail(res)
      dispatch(setKbId(res.kb_id))
    })
  }

  const handleUpdate = async () => {
    if (!editorRef) return
    const headings = await editorRef.getNavs() || []
    setHeadings(headings)
    setMaxH(Math.min(...headings.map((h: any) => h.heading)))
  }

  const handleSave = (auto?: boolean) => {
    if (!editorRef || !detail) return
    const { editor } = editorRef
    const content = editor.getHTML()
    updateNode({ id, content, kb_id: detail.kb_id }).then(() => {
      Message.success(auto ? '自动保存成功' : '保存成功')
      getDetail()
    })
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { key } = await uploadFile(formData)
    return Promise.resolve('/static-file/' + key)
  }

  const editorRef = useTiptapEditor({
    content: '',
    onSave: () => handleSave(false),
    onImageUpload: handleImageUpload,
    onUpdate: () => {
      handleUpdate()
    }
  })

  useEffect(() => {
    if (detail && detail.content && editorRef) {
      editorRef.setContent(detail.content).then((headings) => {
        setHeadings(headings)
        setMaxH(Math.min(...headings.map(h => h.heading)))
      })
    }
  }, [detail])

  useEffect(() => {
    if (id) {
      getDetail()
      if (timer.current) clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      handleSave(true)
    }, 1000 * 60)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  if (!editorRef) return null

  return <Box sx={{ color: 'text.primary', pb: 2 }}>
    <Box sx={{
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 2,
      bgcolor: '#fff',
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
    }}
    >
      <Box sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 1,
      }}>
        <EditorHeader editorRef={editorRef} detail={detail} onSave={handleSave} refresh={getDetail} />
      </Box>
      <TiptapToolbar editorRef={editorRef} />
    </Box>
    <Stack direction='row' alignItems={'flex-start'} sx={{
      width: 1400,
      margin: 'auto',
      overflowY: 'auto',
      mt: '105px',
    }}>
      <Box sx={{
        width: 292,
        position: 'relative',
        zIndex: 1,
        mr: 1,
      }}>
        <EditorFolder />
      </Box>
      <Box className='editor-content' sx={{
        width: 800,
        position: 'relative',
        zIndex: 1,
        '.editor-container': {
          p: 8,
          borderRadius: '6px',
          bgcolor: '#fff',
          minHeight: 'calc(100vh - 105px - 16px)',
          '.tiptap': {
            minHeight: 'calc(100vh - 105px - 16px)',
          }
        }
      }}>
        <TiptapEditor editorRef={editorRef} />
      </Box>
      <Stack direction={'row'} justifyContent={'flex-end'} sx={{
        position: 'fixed',
        width: 1400,
      }}>
        <EditorDocNav title={detail?.name} headers={headings} maxH={maxH} />
      </Stack>
    </Stack>
  </Box>
}

export default DocEditor