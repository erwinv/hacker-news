import { keyframes } from '@emotion/react'
import { Box, Button, Link, Typography, styled } from '@mui/joy'
import { useState } from 'react'
import reactLogo from '~/assets/react.svg'
import viteLogo from '~/assets/vite.svg'

const Logo = styled('img')({
  height: '6em',
  padding: '1.5em',
  willChange: 'filter',
  transition: 'filter 300ms',
})

const ViteLogo = styled(Logo)({
  ':hover': {
    filter: 'drop-shadow(0 0 2em #646cffaa)',
  },
})

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const ReactLogo = styled(Logo)({
  ':hover': {
    filter: 'drop-shadow(0 0 2em #61dafbaa)',
  },
  animation: `${spin} infinite 20s linear`,
})

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <Box
      sx={{
        mt: 12,
        mx: 'auto',
        p: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <Link href="https://vitejs.dev" target="_blank">
          <ViteLogo src={viteLogo} alt="Vite logo" />
        </Link>
        <Link href="https://react.dev" target="_blank">
          <ReactLogo src={reactLogo} alt="React logo" />
        </Link>
      </div>
      <Typography level="h1">Vite + React</Typography>
      <Box sx={{ p: '2em' }}>
        <Button variant="soft" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <Typography sx={{ mt: 4 }}>
          Edit <code>src/App.tsx</code> and save to test HMR
        </Typography>
      </Box>
      <Typography textColor="warning.300">
        Click on the Vite and React logos to learn more
      </Typography>
    </Box>
  )
}
