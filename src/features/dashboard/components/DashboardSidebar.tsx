import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Hotel,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  active?: boolean;
}

interface DashboardSidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentPath = "/dashboard",
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      active: currentPath === "/dashboard",
    },
    {
      name: "Bookings",
      icon: Calendar,
      path: "/bookings",
      active: currentPath === "/bookings",
    },
    {
      name: "Hotels",
      icon: Hotel,
      path: "/hotels",
      active: currentPath === "/hotels",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      active: currentPath === "/profile",
    },
  ];

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
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

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileMenuOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-card/95 backdrop-blur-xl border-r border-border z-40 p-6 overflow-y-auto"
      >
        <SidebarContent
          navItems={navItems}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card/80 backdrop-blur-xl border-r border-border p-6 overflow-y-auto">
        <SidebarContent
          navItems={navItems}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
};

interface SidebarContentProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navItems,
  onNavigate,
  onLogout,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-primary">Hotel Booking</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your luxury gateway
        </p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </motion.button>
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