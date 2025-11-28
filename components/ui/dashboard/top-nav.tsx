import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Logo</Link>
          <div className="flex items-center gap-2">
          </div>
        </div>
        <div className="flex flex-direction-row justify-between">
          <AuthButton />
          <div className="ml-2">
            < ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}