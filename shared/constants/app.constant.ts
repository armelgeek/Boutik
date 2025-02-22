import { Icons } from "@/components/ui/icons";

const kAppName = "Boutik";
const kAppAbbr = "B";
const kAppTagline = "Empowering developers one snippet at a time";
const kAppDescription = `Boutik is the ultimate platform for developers to share, discover, and collaborate on code snippets. Explore snippets by programming language or framework, connect with other developers, and elevate your coding projects with ease.`;

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;


export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/d',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Brand',
    url: '/d/master/brand',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  }
];

export { kAppName, kAppAbbr, kAppTagline, kAppDescription };