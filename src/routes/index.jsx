import { lazy } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import RequireAuth from '@/components/shared/RequireAuth'

import { pages } from './preload'

const Page = Object.fromEntries(Object.entries(pages).map(([name, load]) => [name, lazy(load)]))

const guard = (el) => <RequireAuth>{el}</RequireAuth>

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Page.Home /> },
      { path: '/products', element: <Page.Products /> },
      { path: '/products/:slug', element: <Page.ProductDetail /> },
      { path: '/about', element: <Page.About /> },
      { path: '/contact', element: <Page.Contact /> },
      { path: '/dealer', element: <Page.Dealer /> },
      { path: '/coming-soon', element: <Page.ComingSoon /> },
      { path: '/cart', element: <Page.Cart /> },
      { path: '/wishlist', element: <Page.Wishlist /> },
      { path: '/checkout', element: guard(<Page.Checkout />) },
      { path: '/profile', element: guard(<Page.Profile />) },
      { path: '/orders/:id', element: guard(<Page.OrderDetail />) },
      { path: '/login', element: <Page.Login /> },
      { path: '/register', element: <Page.Register /> },
      { path: '/bulk-order', element: <Page.BulkOrder /> },
      { path: '/blog', element: <Page.Blog /> },
      { path: '/gallery', element: <Page.Gallery /> },
      { path: '*', element: <Page.ComingSoon /> },
    ],
  },
]
