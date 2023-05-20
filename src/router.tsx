import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from '~/routes/home.tsx'
import AppLayout from './components/AppLayout'
import Job from './routes/job'
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
          ['Jobs', '/job'],
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
            element: <Stories key="topstories" kind="top" />,
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
            element: <Stories key="newstories" kind="new" />,
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
            element: <Stories key="beststories" kind="best" />,
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
            element: <Stories key="askstories" kind="ask" />,
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
            element: <Stories key="showstories" kind="show" />,
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
            element: <Stories key="jobstories" kind="job" />,
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
