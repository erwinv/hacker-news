import { SvgIcon, SvgIconTypeMap, Tooltip } from '@mui/joy'

export function YCombinatorIcon(props: SvgIconTypeMap['props']) {
  return (
    <Tooltip title="Hacker News icon by Icons8: https://icons8.com/icon/16336/hacker-news">
      <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M 5 5 L 5 27 L 27 27 L 27 5 Z M 7 7 L 25 7 L 25 25 L 7 25 Z M 11 10 L 15 17 L 15 22 L 17 22 L 17 17 L 21 10 L 19 10 L 16 15.25 L 13 10 Z" />
      </SvgIcon>
    </Tooltip>
  )
}
