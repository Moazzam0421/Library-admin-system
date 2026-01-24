import { useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Armchair,
  CreditCard,
  Settings,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Seats & Shifts", path: "/seats", icon: Armchair },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Settings", path: "/settings", icon: Settings },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  const location = useLocation()

  // Auto-close sidebar on route change (mobile UX)
  useEffect(() => {
    onClose()
  }, [location.pathname])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r",
        "transform transition-transform duration-300 ease-in-out",
        "lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* HEADER */}
      <div
        className="
    flex items-center justify-between
    px-4 py-3
    sm:px-6 sm:py-4
    border-b bg-white
  "
      >
        {/* Brand */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <img
            src="/logo.png"
            alt="ALPHA Logo"
            className="
        h-7 w-7
        sm:h-8 sm:w-8
        object-contain
      "
          />

          <span
            className="
        text-base font-semibold text-slate-800
        sm:text-lg
        tracking-tight group-hover:text-slate-900 transition
      "
          >
           Alpha Library Admin
          </span>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="
      lg:hidden
      rounded-md p-2
      hover:bg-slate-100
      active:bg-slate-200
      transition
    "
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-slate-700" />
        </button>
      </div>


      {/* NAV */}
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
