import { updateAppDetail } from "@/api"
import { AppDetail, CatalogSetting } from "@/api/type"
import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material"
import { Message } from "ct-mui"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

interface CardCatalogProps {
  id: string
  data: AppDetail
  refresh: (value: CatalogSetting) => void
}

const CardCatalog = ({ id, data, refresh }: CardCatalogProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const { control, handleSubmit, setValue } = useForm<CatalogSetting>({
    defaultValues: {
      catalog_expanded: 1,
    }
  })

  const onSubmit = (value: CatalogSetting) => {
    updateAppDetail({ id }, { settings: { ...data.settings, ...value } }).then(() => {
      refresh(value)
      Message.success('保存成功')
      setIsEdit(false)
    })
  }

  useEffect(() => {
    setValue('catalog_expanded', data.settings?.catalog_expanded)
  }, [data])

  return <>
    <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{
      m: 2,
      height: 32,
      fontWeight: 'bold',
    }}>
      <Box sx={{
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: 4,
          height: 12,
          bgcolor: 'common.black',
          borderRadius: '2px',
          mr: 1,
        },
      }}>左侧导航</Box>
      {isEdit && <Button variant="contained" size="small" onClick={handleSubmit(onSubmit)}>保存</Button>}
    </Stack>
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ mx: 2 }}>
      <Box sx={{ fontSize: 14, lineHeight: '32px' }}>导航中的文件夹</Box>
      <Controller
        control={control}
        name="catalog_expanded"
        render={({ field }) => <RadioGroup row {...field} onChange={(e) => {
          field.onChange(+e.target.value as 1 | 2)
          setIsEdit(true)
        }}>
          <FormControlLabel value={1} control={<Radio size='small' />} label={<Box sx={{ width: 100 }}>默认展开</Box>} />
          <FormControlLabel value={2} control={<Radio size='small' />} label={<Box sx={{ width: 100 }}>默认折叠</Box>} />
        </RadioGroup>}
      />
    </Stack>
  </>
}

export default CardCatalog