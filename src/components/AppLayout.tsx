import { Box, Container, Tab, TabList, Tabs } from '@mui/joy'
import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import YCombinatorIcon from '~/assets/YCombinatorIcon'
import useStoryKind from '~/contexts/hooks/useStoryKind'

interface AppLayoutProps {
  navPages: [label: string, path: string][]
  indexRoute: string
}

export default function AppLayout({
  navPages,
  indexRoute,
  children,
}: PropsWithChildren<AppLayoutProps>) {
  const navigate = useNavigate()

  const storyKind = useStoryKind()
  const selectedPath = '/list/' + storyKind

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          '> header': {
            mt: 1,
            maxWidth: 'sm',
            width: '100%',
            mx: 'auto',
          },
          '> main': {
            height: '100%',
            overflow: 'auto',
          },
        }}
      >
        <Box component="header">
          <Tabs value={selectedPath} onChange={(_, value) => navigate(`${value}`)}>
            <TabList component="nav" variant="plain">
              {navPages.map(([label, path]) => (
                <Tab
                  key={label}
                  variant={selectedPath === path ? 'solid' : undefined}
                  value={path}
                  sx={path === indexRoute ? { p: 0, flexGrow: 0.5 } : undefined}
                >
                  {path === indexRoute ? <YCombinatorIcon sx={{ fontSize: 48 }} /> : label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>

        <Box component="main">{children}</Box>
      </Box>
    </Container>
  )
}
