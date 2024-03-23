import { extendTheme } from '@mui/joy'

export const theme = extendTheme({
  components: {
    JoyLink: {
      defaultProps: {
        color: 'neutral',
      },
    },
    JoyBadge: {
      defaultProps: {
        color: 'neutral',
      },
    },
    JoyLinearProgress: {
      defaultProps: {
        color: 'neutral',
      },
    },
    JoyCircularProgress: {
      defaultProps: {
        color: 'neutral',
      },
    },
  },
})
