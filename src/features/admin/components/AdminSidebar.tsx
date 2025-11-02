import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  active?: boolean;
}

interface AdminSidebarProps {
  currentPath?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath = "/admin",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      active: currentPath === "/admin",
    },
    {
      name: "Hotels",
      icon: Hotel,
      path: "/admin/hotels",
      active: currentPath === "/admin/hotels",
    },
    {
      name: "Bookings",
      icon: Calendar,
      path: "/admin/bookings",
      active: currentPath === "/admin/bookings",
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
      active: currentPath === "/admin/users",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      active: currentPath === "/admin/analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
      active: currentPath === "/admin/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-xl p-3 rounded-xl shadow-lg border border-border"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileMenuOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-card/95 backdrop-blur-xl border-r border-border z-40 p-6 overflow-y-auto"
      >
        <SidebarContent
          navItems={navItems}
          onLogout={handleLogout}
          closeMenu={() => setIsMobileMenuOpen(false)}
        />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card/80 backdrop-blur-xl border-r border-border p-6 overflow-y-auto">
        <SidebarContent
          navItems={navItems}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
};

interface SidebarContentProps {
  navItems: NavItem[];
  onLogout: () => void;
  closeMenu?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navItems,
  onLogout,
  closeMenu,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Hotel Booking System
        </p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                onClick={() => closeMenu?.()}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </motion.button>
    </div>
  );
};
