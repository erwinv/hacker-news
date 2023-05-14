import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from '~/routes/home.tsx'
import AppLayout from './components/AppLayout'
import Job from './routes/job'
import NewStories from './routes/newstories'
import Stories from './routes/stories'
import Story from './routes/story'
import TopStory from './routes/topStory'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout
        navPages={[
          ['Top', '/top'],
          ['New', '/new'],
          ['Best', '/best'],
          ['Ask', '/ask'],
          ['Show', '/show'],
          ['Job', '/job'],
        ]}
        indexRoute="/top"
      >
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: 'top',
        children: [
          {
            index: true,
            element: <Stories kind="top" />,
          },
          {
            path: ':id',
            element: <TopStory />,
          },
        ],
      },
      {
        path: 'new',
        children: [
          {
            index: true,
            element: <NewStories />,
          },
          {
            path: ':id',
            element: <Story />,
          },
        ],
      },
      {
        path: 'best',
        children: [
          {
            index: true,
            element: <Stories kind="best" />,
          },
          {
            path: ':id',
            element: <Story />,
          },
        ],
      },
      {
        path: 'ask',
        children: [
          {
            index: true,
            element: <Stories kind="ask" />,
          },
          {
            path: ':id',
            element: <Story />,
          },
        ],
      },
      {
        path: 'show',
        children: [
          {
            index: true,
            element: <Stories kind="show" />,
          },
          {
            path: ':id',
            element: <Story />,
          },
        ],
      },
      {
        path: 'job',
        children: [
          {
            index: true,
            element: <Stories kind="job" />,
          },
          {
            path: ':id',
            element: <Job />,
          },
        ],
      },
      {
        path: 'vite',
        element: <Home />,
      },
    ],
  },
])

export default router
