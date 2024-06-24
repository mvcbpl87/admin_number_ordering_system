"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react";
import { Triangle } from "lucide-react";
import { NavLinksElements, NavLinksList } from "./NavLinks";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
function NavLinks() {
  const currentPath = usePathname();
  return (
    <nav className="flex flex-col gap-2 px-1 ">
      {NavLinksList.map((navlink) => {
        const link = NavLinksElements[navlink];
        return (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "h-10 w-full justify-start  gap-2 whitespace-wrap ",
              currentPath === link.href && 'bg-primary text-background'

            )}
          >
            <link.icon size={18} />

            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
function Logo() {
  return (
    <div className="font-medium">
      <Button variant={"ghost"} size={"icon"} aria-label="Home">
        <Triangle className="fill-foreground" />
      </Button>
    </div>
  );
}
function MobileNav() {
  const [navOpened, setNavOpened] = useState(false);
  return (
    <div className="fixed z-[100] flex flex-col md:hidden w-full h-[var(--header-height)]  ">
      {/* ---- Background Overlay --- */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      />
      <div className="relative flex flex-col flex-grow flex-1">
        <div className="flex items-center justify-between p-4 bg-background">
          {/* ---- Logo ---- */}
          <Logo />
          {/* ---- Action Button ---- */}
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation"
              aria-controls="sidebar-menu"
              aria-expanded={navOpened}
              onClick={() => setNavOpened((prev) => !prev)}
            >
              {navOpened ? <IconX /> : <IconMenu2 />}
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "bg-background py-2 px-2 transition-[max-height,padding] duration-500 group border-t ",
            navOpened
              ? "bg-background max-h-screen"
              : "overflow-hidden max-h-0 py-0"
          )}
        >
          <NavLinks />
        </div>
      </div>
    </div>
  );
}

function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div
      className={cn(
        "hidden md:flex flex-col border-r",
        isCollapsed ? "md:w-14" : "md:w-64"
      )}
    >
      <div className="h-[var(--header-height)] border-b p-2 flex items-center gap-2">
        <Logo />
        <div className="flex flex-col">
          <span className="font-medium text-sm">Admin</span>
          <span className="text-xs text-muted-foreground">HQ Management</span>
        </div>
      </div>
      <div className="py-2">
        <NavLinks />
      </div>
    </div>
  );
}
export default function NavigationBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      <MobileNav />
      <SidebarNav />
    </>
  );
}
