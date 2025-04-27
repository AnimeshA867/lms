import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { LogOut } from "lucide-react";
const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isStudentPage = pathname?.startsWith("/chapter");
  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isStudentPage ? (
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => router.push("/")}
          className="pointer"
        >
          <LogOut />
          <span className="ml-2">Exit</span>
        </Button>
      ) : (
        <Link href="/teacher/courses">
          <Button size={"sm"} variant={"ghost"} className="pointer">
            {" "}
            Teacher Mode{" "}
          </Button>
        </Link>
      )}
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "h-8 w-8",
            userButtonAvatarImage: "h-8 w-8 rounded-full",
          },
        }}
        afterSignOutUrl="/"
        userProfileMode="navigation"
        userProfileUrl="/profile"
        showName={false}
      />
    </div>
  );
};

export default NavbarRoutes;
