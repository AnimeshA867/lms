"use client";
import {
  BarChart,
  BookCopy,
  Compass,
  Layout,
  List,
  LucideIcon,
} from "lucide-react";
import SidebarItems from "./SidebarItem";
import { SidebarItem } from "@/app/types/sidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes: SidebarItem[] = [
  {
    icon: Layout,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "About",
    href: "/about",
  },
  {
    icon: Compass,
    label: "Search",
    href: "/search",
  },
];

const teacherRoutes: SidebarItem[] = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isStudentPage = pathname?.startsWith("/chapter");
  const isGuestPage = !isTeacherPage && !isStudentPage;

  const routes = isTeacherPage
    ? teacherRoutes
    : isStudentPage
    ? []
    : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route, key) => (
        <SidebarItems
          icon={route.icon}
          label={route.label}
          href={route.href}
          key={key}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
