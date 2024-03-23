import { createBrowserRouter, Outlet } from 'react-router-dom'
import { AppLayout } from '~/components/AppLayout'
import { Item } from '~/routes/item'
import { Stories } from '~/routes/stories'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout
        navPages={[
          ['Top', '/list/top'],
          ['New', '/list/new'],
          ['Best', '/list/best'],
          ['Ask', '/list/ask'],
          ['Show', '/list/show'],
          ['Jobs', '/list/job'],
        ]}
        indexRoute="/list/top"
      >
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        index: true,
        element: <Stories />,
      },
      {
        path: 'list/:storyKind',
        element: <Stories />,
      },
      {
        path: 'item/:itemId',
        element: <Item />,
      }
    ],
  },
])
