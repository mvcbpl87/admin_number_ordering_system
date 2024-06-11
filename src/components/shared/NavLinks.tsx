import path from "@/lib/path";

import {
  IconHome,
  IconSettings,
  IconUsers,
  IconTrophyFilled,
  IconNumber,
} from "@tabler/icons-react";

type NavLinksType = "Dashboard" | "Users" | "SoldOut" | "Winnings" | "Settings";

type NavLinksElement = {
  id: string;
  type: string;
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavLinksElementsType = {
  [key in NavLinksType]: NavLinksElement;
};

const Dashboard = {
  id: "nav-dashboard",
  type: "Dashboard",
  label: "Dashboard",
  href: path.admin,
  icon: IconHome,
};

const Users = {
  id: "nav-users",
  type: "Users",
  label: "Users",
  href: path.users,
  icon: IconUsers,
};

const SoldOut = {
  id: "nav-soldout",
  type: "SoldOut",
  label: "Sold out numbers",
  href: path.soldOut,
  icon: IconNumber,
};

const Winnings = {
  id: "side-winning",
  type: "Winning",
  label: "Winning",
  href: path.winning,
  icon: IconTrophyFilled,
};

const Settings = {
  id: "nav-settings",
  type: "Settings",
  label: "Settings",
  href: path.settings,
  icon: IconSettings,
};
export const NavLinksElements: NavLinksElementsType = {
  Dashboard,
  Users,
  SoldOut,
  Winnings,
  Settings,
};

export const NavLinksList: NavLinksType[] = [
  "Dashboard",
  "Users",
  "SoldOut",
  "Winnings",
  "Settings",
];
