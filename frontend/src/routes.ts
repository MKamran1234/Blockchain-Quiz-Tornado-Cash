import {
  BarChart3,
  BookOpen,
  FileText,
  Fingerprint,
  GitBranch,
  Home,
  LockKeyhole,
  Network,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AppRoute {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const routes: AppRoute[] = [
  { path: "/", label: "Landing", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/deposit", label: "Deposit", icon: Wallet },
  { path: "/pool", label: "Mixing Pool", icon: Network },
  { path: "/withdraw", label: "Withdraw", icon: LockKeyhole },
  { path: "/attacks", label: "Attacks", icon: ShieldAlert },
  { path: "/pin-zkp", label: "PIN ZKP", icon: Fingerprint },
  { path: "/merkle-tree", label: "Merkle Tree", icon: GitBranch },
  { path: "/report", label: "Report", icon: FileText },
  { path: "/about", label: "About", icon: BookOpen },
];

export function routeLabel(pathname: string) {
  return routes.find((route) => route.path === pathname)?.label ?? "Landing";
}
