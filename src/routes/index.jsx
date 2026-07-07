import { lazy } from 'react'
import MainLayout from '@/components/layout/MainLayout'

const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Dealer = lazy(() => import('@/pages/Dealer'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon'))
const Cart = lazy(() => import('@/pages/Cart'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Profile = lazy(() => import('@/pages/Profile'))
const BulkOrder = lazy(() => import('@/pages/BulkOrder'))
const Blog = lazy(() => import('@/pages/Blog'))
const Gallery = lazy(() => import('@/pages/Gallery'))
export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <Products /> },
      { path: '/products/:slug', element: <ProductDetail /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/dealer', element: <Dealer /> },
      { path: '/coming-soon', element: <ComingSoon /> },
      { path: '/cart', element: <Cart /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/profile', element: <Profile /> },
      { path: '/bulk-order', element: <BulkOrder /> },
      { path: '/blog', element: <Blog /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '*', element: <ComingSoon /> },
    ],
  },
]
