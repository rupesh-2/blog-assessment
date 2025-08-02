"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import {
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, setTheme, isDark, isLight, isSystem } =
    useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
  };

  // Force re-render when theme changes
  useEffect(() => {
    // This will trigger a re-render when theme changes
  }, [theme, isDark, isLight, isSystem]);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuButton = document.getElementById("mobile-menu-button");

      if (
        mobileMenu &&
        !mobileMenu.contains(target) &&
        mobileMenuButton &&
        !mobileMenuButton.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getThemeIcon = () => {
    if (isSystem) return <Monitor className="h-4 w-4" />;
    if (isDark) return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (isSystem) return "System";
    if (isDark) return "Dark";
    return "Light";
  };

  return (
    <header className="bg-card text-card-foreground shadow-sm border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            Blog Platform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/posts/create"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Post
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Menu & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                aria-label="Theme menu"
              >
                {getThemeIcon()}
                <span className="text-sm hidden sm:inline">
                  {getThemeLabel()}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Theme Dropdown */}
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border py-1 z-50">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors ${
                      isLight ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors ${
                      isDark ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("system");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-accent transition-colors ${
                      isSystem ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              aria-label="Theme menu"
            >
              {getThemeIcon()}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              aria-label="Mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg z-50"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  Home
                </Link>
                {user && (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/posts/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      Create Post
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Theme Options */}
              <div className="pt-4 border-t border-border">
                <div className="px-3 py-2 text-sm text-muted-foreground mb-2">
                  Theme
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors ${
                      isLight ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors ${
                      isDark ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("system");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors ${
                      isSystem ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
