import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "px-3 py-2 text-sm font-medium rounded-sm transition-colors";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-ink text-chalk">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg tracking-tight">
              Faculty &amp; Lab Tracker
            </span>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/5"}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/faculty"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/5"}`
                }
              >
                Faculty
              </NavLink>
              <NavLink
                to="/labs"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/5"}`
                }
              >
                Labs
              </NavLink>
              {user?.role === "FACULTY" && (
                <NavLink
                  to="/my-status"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/5"}`
                  }
                >
                  My Status
                </NavLink>
              )}
              {user?.role === "ADMIN" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-white/10" : "hover:bg-white/5"}`
                  }
                >
                  Admin
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm leading-tight">{user?.name}</p>
              <p className="text-xs font-mono text-chalk/60 leading-tight">
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-sm border border-chalk/30 hover:bg-white/10 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* mobile nav row */}
        <nav className="flex md:hidden items-center gap-1 pb-3 -mt-1 overflow-x-auto">
          <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/faculty" className={({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : ""}`}>
            Faculty
          </NavLink>
          <NavLink to="/labs" className={({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : ""}`}>
            Labs
          </NavLink>
          {user?.role === "FACULTY" && (
            <NavLink to="/my-status" className={({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : ""}`}>
              My Status
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={({ isActive }) => `${linkBase} ${isActive ? "bg-white/10" : ""}`}>
              Admin
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
