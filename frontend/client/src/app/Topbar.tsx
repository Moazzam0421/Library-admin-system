import { LogOut, Menu } from "lucide-react"
import { useAuth } from "@/auth/AuthContext"

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const { logout } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div
        className="
    flex items-center gap-3
    px-4 py-3
    sm:px-6
  "
      >
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={onMenuClick}
          className="
      lg:hidden
      rounded-md p-2
      hover:bg-slate-100
      active:bg-slate-200
      transition
    "
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </button>

        {/* BRAND */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="ALPHA Logo"
            className="
        h-6 w-6
        sm:h-7 sm:w-7
        object-contain
      "
          />

          <h1
            className="
        text-base font-semibold text-slate-800
        sm:text-lg
        tracking-tight
      "
          >
           Alpha Library Admin
          </h1>
        </div>
      </div>


      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </header>
  )
}
