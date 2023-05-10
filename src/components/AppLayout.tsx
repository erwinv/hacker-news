import { Box, Container, Tab, TabList, Tabs } from '@mui/joy'
import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface AppLayoutProps {
  navPages: [label: string, path: string][]
  indexRoute: string
}

export default function AppLayout({
  navPages,
  indexRoute: index,
  children,
}: PropsWithChildren<AppLayoutProps>) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    if (currentPath === '/') navigate(index)
  }, [currentPath, index, navigate])

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
        <Tabs value={currentPath} onChange={(_, value) => navigate(`${value}`)}>
          <TabList variant="outlined" sx={{ mt: 1 }}>
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
        <main>{children}</main>
      </Box>
    </Container>
  )
}
