"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChessKnight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FcAbout } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/toggle-theme";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MdMenu } from "react-icons/md";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
};

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(true); // Ensure it's not collapsed on desktop by default
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: <FaChessKnight size={24} className="text-primary" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <FaCircleUser size={24} />,
    },
    {
      href: "https://github.com/Razamindset/knightly",
      label: "GitHub",
      icon: <SiGithub size={24} />,
      external: true,
    },
    {
      href: "/about",
      label: "About",
      icon: <FcAbout size={24} />,
    },
  ];

  const NavLinks = ({ showLabel = true }: { showLabel?: boolean }) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isCollapsed && !isMobile ? "justify-center" : "",
              isActive
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {(showLabel && !isCollapsed) || isMobile ? (
              <span className="font-medium">{item.label}</span>
            ) : null}
          </Link>
        );
      })}
    </>
  );

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar drawer */}
        <Sheet>
          <SheetTitle className="hidden">Knightly</SheetTitle>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 md:hidden"
            >
              <MdMenu size={40}/>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <div className="flex flex-col h-full py-10">
              <div className="flex flex-col gap-2 px-3 flex-1">
                <NavLinks showLabel={true} /> {/* Ensure labels are shown on mobile */}
              </div>

              <div className="px-3 mt-auto pt-6 border-t border-border/30">
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "flex flex-col border-r py-6 transition-all duration-300 ease-in-out h-screen sticky top-0 bg-card/50 backdrop-blur-sm",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1">
        {/* Navigation Links */}
        <div className="flex flex-col gap-1 px-2">
          <NavLinks showLabel={!isCollapsed} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-2">
        <div className="flex flex-col items-center justify-between gap-2 pt-4 border-t border-border/30 mx-2">
          <div className="flex items-center gap-3">
            <ModeToggle />
            {!isCollapsed && "Theme"}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={toggleCollapse}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground border"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <FaChevronRight size={16} />
              ) : (
                <FaChevronLeft size={16} />
              )}
            </Button>
            {!isCollapsed && "Collapse"}
          </div>
        </div>
      </div>
    </div>
  );
}