import {
  AspectRatio,
  Box,
  Container,
  IconButton,
  Link,
  Tab,
  TabList,
  Tabs,
  Tooltip,
} from '@mui/joy'
import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import yCombinatorLogo from '~/assets/ycombinator.svg'

const logo = (
  <Tooltip title="Hacker News icon by Icons8">
    <IconButton
      variant="plain"
      component={Link}
      href="https://icons8.com/icon/16336/hacker-news"
      target="_blank"
      rel="noopener"
      sx={(theme) => ({
        '&:hover': {
          bgcolor: 'transparent',
        },
        [`${theme.getColorSchemeSelector('dark')} img`]: {
          filter: 'invert(1)',
        },
      })}
    >
      <AspectRatio ratio="1" variant="plain" sx={{ minWidth: 48 }}>
        <img src={yCombinatorLogo} />
      </AspectRatio>
    </IconButton>
  </Tooltip>
)

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
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    if (currentPath === '/') navigate(indexRoute)
  }, [currentPath, indexRoute, navigate])

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          '> main': {
            height: '100%',
            overflow: 'auto',
          },
        }}
      >
        <Box
          component="header"
          sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', mt: 1 }}
        >
          {logo}
          <Tabs value={currentPath} onChange={(_, value) => navigate(`${value}`)}>
            <TabList component="nav" variant="plain" sx={{ width: '100%' }}>
              {navPages.map(([label, path]) => (
                <Tab
                  key={label}
                  variant={currentPath.startsWith(path) ? 'solid' : 'plain'}
                  value={path}
                >
                  {label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>

        <Box component="main" sx={{ pt: 1 }}>
          {children}
        </Box>
      </Box>
    </Container>
  )
}
