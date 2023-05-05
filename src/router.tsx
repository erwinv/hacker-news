import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from '~/routes/home.tsx'
import TopStories from '~/routes/top-stories'
import Story from './routes/story'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <TopStories />,
      },
      {
        path: 'top-stories',
        element: <TopStories />,
      },
      {
        path: 'story/:id',
        element: <Story />,
      },
      {
        path: 'vite',
        element: <Home />,
      },
    ],
  },
])

export default router
