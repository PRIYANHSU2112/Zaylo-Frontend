import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="flex min-h-svh flex-col">
      <AnnouncementBar />
      <Header transparent={isHome} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
