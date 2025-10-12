import { Typography } from '@mui/material'


const Title = ({ title }: { title: string }) => {
  return (
    <Typography variant="h4" component="h1">
      {title}
    </Typography>
  )
}

export { Title }