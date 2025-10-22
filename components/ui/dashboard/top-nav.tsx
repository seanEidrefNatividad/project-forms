import { ThemeSwitcher } from "@/components/theme-switcher";

export default function TopNav() {
  return (
    <div className="p-1 md:p-2 w-full flex justify-between items-center ">
      <div className="flex justify-start">
        Logo
      </div>
      <div className="flex justify-end">
        < ThemeSwitcher />
      </div>
    </div>
  )
}