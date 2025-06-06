import DingLogo from '@/assets/images/ding.png'
import FeishuLogo from '@/assets/images/feishu.png'
import PluginLogo from '@/assets/images/plugin.png'
import WecomLogo from '@/assets/images/wecom.png'
import Card from "@/components/Card"
import { Box, Stack, Switch } from "@mui/material"
import { Message } from 'ct-mui'
import { useState } from "react"

const CardRebot = () => {
  const [webOpen, setWebOpen] = useState(false)
  const [dingOpen, setDingOpen] = useState(false)
  const [wecomOpen, setWecomOpen] = useState(false)
  const [feishuOpen, setFeishuOpen] = useState(false)

  const AppList = {
    2: {
      name: '网页挂件',
      icon: PluginLogo,
      configDisabled: true,
      onClick: () => setWebOpen(true)
    },
    3: {
      name: '钉钉机器人',
      icon: DingLogo,
      configDisabled: true,
      onClick: () => setDingOpen(true)
    },
    4: {
      name: '企业微信机器人',
      icon: WecomLogo,
      configDisabled: true,
      onClick: () => setWecomOpen(true)
    },
    5: {
      name: '飞书机器人',
      icon: FeishuLogo,
      configDisabled: true,
      onClick: () => setFeishuOpen(true)
    }
  }
  return <Card>
    <Box sx={{ fontWeight: 'bold', px: 2, py: 1.5, bgcolor: 'background.paper2' }}>问答机器人</Box>
    {Object.values(AppList).map((value, index) => <Box key={index}>
      <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ m: 2 }}>
        <Box sx={{ fontWeight: 'bold' }}>{value.name}</Box>
        <Switch checked={false} onChange={() => {
          Message.warning('敬请期待')
        }} />
      </Stack>
    </Box>)}
  </Card>
}

export default CardRebot