import { useState } from 'react'
import { User, MapPin, Package, Settings, LogOut, ChevronRight } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export default function Profile() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('orders')

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ]

  const mockOrders = [
    { id: 'ORD-2026-892', date: 'Oct 12, 2026', total: 450, status: 'Delivered', items: 3 },
    { id: 'ORD-2026-715', date: 'Sep 28, 2026', total: 120, status: 'Delivered', items: 1 },
    { id: 'ORD-2026-602', date: 'Sep 05, 2026', total: 680, status: 'Cancelled', items: 4 },
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <PageHero
        title="My Profile"
        subtitle={`Welcome back, ${user.name.split(' ')[0]}!`}
      />

      <div className="section-container mt-12 grid gap-8 lg:grid-cols-4">
        
        {/* Sidebar Nav */}
        <Reveal className="lg:col-span-1">
          <div className="rounded-[1.75rem] bg-surface p-4 shadow-card border border-border-subtle">
            <div className="p-4 mb-4 flex items-center gap-4 border-b border-border-subtle pb-6">
              <div className="h-12 w-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-main">{user.name}</h3>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                    activeTab === tab.id 
                      ? "bg-brand-primary/10 text-brand-primary font-bold" 
                      : "text-muted hover:bg-surface-cream hover:text-main"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-border-subtle">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl text-brand-primary hover:bg-brand-primary/10 transition-all font-medium">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </Reveal>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <Reveal className="space-y-6">
              <h2 className="text-2xl font-bold text-main">Order History</h2>
              
              <div className="space-y-4">
                {mockOrders.map(order => (
                  <div key={order.id} className="rounded-2xl bg-surface p-6 shadow-card border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-hover">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-main">{order.id}</h4>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide",
                          order.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted">
                        {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                      <span className="font-extrabold text-lg text-main">₹{order.total}</span>
                      <Button variant="outline" className="!py-1.5 !px-4 text-xs">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {activeTab === 'addresses' && (
            <Reveal className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-main">Saved Addresses</h2>
                <Button variant="outline" className="!py-1.5 !px-4 text-xs">+ Add New</Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="rounded-2xl bg-surface p-6 shadow-card border border-border-subtle">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-brand-primary/10 text-brand-primary mb-3">
                      {addr.type}
                    </span>
                    <h4 className="font-bold text-main mb-1">{user.name}</h4>
                    <p className="text-sm text-muted leading-relaxed mb-4">{addr.address}</p>
                    <p className="text-sm font-medium text-main mb-6">Phone: {user.phone}</p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="w-full !py-1.5 text-xs">Edit</Button>
                      <Button variant="outline" className="w-full !py-1.5 text-xs text-brand-primary border-brand-primary/20 hover:bg-brand-primary hover:text-white">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {activeTab === 'settings' && (
            <Reveal className="space-y-6">
              <h2 className="text-2xl font-bold text-main">Account Settings</h2>
              
              <div className="rounded-[1.75rem] bg-surface p-6 sm:p-8 shadow-card border border-border-subtle">
                <div className="grid gap-6 max-w-md">
                  <Input label="Full Name" defaultValue={user.name} />
                  <Input label="Email Address" type="email" defaultValue={user.email} />
                  <Input label="Phone Number" type="tel" defaultValue={user.phone} />
                  
                  <Button className="mt-4 w-fit">Save Changes</Button>
                </div>
              </div>
            </Reveal>
          )}
        </div>

      </div>
    </div>
  )
}
