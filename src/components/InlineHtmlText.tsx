import { Box } from '@mui/joy'

interface InlineHtmlTextProps {
  text: string
}

export function InlineHtmlText({ text }: InlineHtmlTextProps) {
  return (
    <Box
      sx={(theme) => {
        return {
          // ...theme.typography['body-md'],
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '& p': {
            mb: 0,
          },
          '& a': theme.typography['body-sm'],
          '& pre': {
            ...theme.variants.soft.neutral,
            py: 1,
            overflowX: 'auto',
          },
          '& code': {
            ...theme.typography['body-xs'],
            fontFamily: 'monospace',
          },
        }
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}
