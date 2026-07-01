"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Sun, Moon, HelpCircle, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import the Map component with SSR disabled
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-screen bg-background flex items-center justify-center animate-pulse z-0">
      <div className="text-sm text-muted-foreground">Loading Map Matrix...</div>
    </div>
  ),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 flex flex-col">
      
      {/* 1. Map as full-screen background */}
      <div className="fixed inset-0 w-screen h-screen z-0">
        <MapComponent theme={theme} className="w-full h-full" />
        {/* Subtle grid overlay to enhance cyberpunk/command center feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.07)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40 dark:opacity-80" />
      </div>

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

      {/* Floating Sidebar Toggle Button that moves in sync with the sidebar */}
      <motion.button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        animate={{ right: isSidebarOpen ? "392px" : "16px" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed top-20 z-40 w-10 h-10 rounded-xl border border-border/40 bg-background/85 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors select-none"
        aria-label={isSidebarOpen ? "Collapse control panel" : "Expand control panel"}
      >
        {isSidebarOpen ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
      </motion.button>

      {/* Stateful slide-out sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isSidebarOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed right-0 top-16 bottom-0 z-40 w-80 sm:w-96 border-l border-border/40 bg-background/70 backdrop-blur-xl shadow-2xl flex flex-col"
      >
        {/* Clean canvas for new dynamic components */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5" />
      </motion.div>
    </div>
  );
}
