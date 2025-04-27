"use client";

import { SidebarItem } from "@/app/types/sidebarItem";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const SidebarItems = ({ icon: Icon, label, href }: SidebarItem) => {
  const pathname = usePathname();
  const route = useRouter();

  const isActive =
    (pathname === "/" && href == "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);
  console.log(pathname, href, pathname === href);
  console.log(isActive);
  const onClick = () => {
    if (href === pathname) {
      return;
    }
    route.push(href);
  };

  return (
    <button
      key={label}
      onClick={onClick}
      aria-label={label}
      title={label}
      data-active={isActive}
      data-inactive={!isActive}
      data-icon={Icon}
      data-label={label}
      data-testid="sidebar-item"
      data-testid-active={isActive}
      type="button"
      className={cn(
        "flex items-center flex-row gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 relative cursor-pointer",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500 ", isActive && "text-sky-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all absolute inset-y-0 right-0",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default SidebarItems;
