"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Sun, Moon, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Theme and Mounting
  useEffect(() => {
    setMounted(true);
    const localTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = localTheme === "dark" || (!localTheme && systemPrefersDark);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }

    // Read language from localStorage if available
    const localLang = localStorage.getItem("lang") as "EN" | "ID" | null;
    if (localLang) {
      setLang(localLang);
    }
  }, []);

  // Handle clicks outside language dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  // Language Selection Handler
  const handleLangSelect = (selectedLang: "EN" | "ID") => {
    setLang(selectedLang);
    localStorage.setItem("lang", selectedLang);
    setIsLangDropdownOpen(false);
  };

  // Prevent flash of unstyled content during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const t = {
    helpTitle: {
      EN: "Help",
      ID: "Bantuan",
    },
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/20">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo (Left) */}
          <div className="flex items-center">
            <span className="font-league-spartan text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent select-none">
              nusantara
            </span>
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-9 rounded-xl font-semibold select-none text-muted-foreground hover:text-foreground cursor-pointer px-2.5 sm:px-3"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="listbox"
              >
                <Globe className="size-4" />
                <span className="text-xs sm:text-sm">{lang}</span>
                <ChevronDown className={cn("size-3 transition-transform duration-205", isLangDropdownOpen && "rotate-180")} />
              </Button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl border border-border/50 bg-popover/90 backdrop-blur-md p-1 shadow-lg ring-1 ring-black/5"
                    role="listbox"
                  >
                    <button
                      onClick={() => handleLangSelect("EN")}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors hover:bg-muted text-left font-medium cursor-pointer",
                        lang === "EN" ? "text-foreground bg-muted/50" : "text-muted-foreground"
                      )}
                    >
                      English (EN)
                    </button>
                    <button
                      onClick={() => handleLangSelect("ID")}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors hover:bg-muted text-left font-medium cursor-pointer",
                        lang === "ID" ? "text-foreground bg-muted/50" : "text-muted-foreground"
                      )}
                    >
                      Indonesia (ID)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark/Light Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0, scale: theme === "dark" ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.div>
            </Button>

            {/* Help Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-9 rounded-xl border-border/60 hover:bg-muted hover:text-foreground font-semibold cursor-pointer px-3"
            >
              <HelpCircle className="size-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">{t.helpTitle[lang]}</span>
            </Button>
          </div>

        </div>
      </nav>
    </div>
  );
}
