import { Box } from '@mui/joy'

interface InlineHtmlTextProps {
  text: string
}

export default function InlineHtmlText({ text }: InlineHtmlTextProps) {
  return (
    <Box
      sx={(theme) => {
        const { body2, body3, body4 } = theme.typography
        return {
          ...body2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '& p': {
            mb: 0,
          },
          '& a': body3,
          '& pre': {
            ...theme.variants.soft.neutral,
            py: 1,
            overflowX: 'auto',
          },
          '& code': {
            ...body4,
            fontFamily: 'monospace',
          },
        }
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}
