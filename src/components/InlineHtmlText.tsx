import { Box } from '@mui/joy'

interface InlineHtmlTextProps {
  text: string
}

export default function InlineHtmlText({ text }: InlineHtmlTextProps) {
  return (
    <Box
      sx={(theme) => {
        const { body1, body2, body3 } = theme.typography
        return {
          ...body1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '& p': {
            mb: 0,
          },
          '& a': body2,
          '& pre': {
            ...theme.variants.soft.neutral,
            py: 1,
            overflowX: 'auto',
          },
          '& code': {
            ...body3,
            fontFamily: 'monospace',
          },
        }
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}
