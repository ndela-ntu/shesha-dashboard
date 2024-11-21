import { usePathname } from "next/navigation";

import SignOutButton from "./sign-out-button";
import NavLinks from "./nav-links";

export default function SideNav() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-1">
      <h1 className="text-4xl pb-1 font-black italic">SHESHA</h1>
      <div className="flex w-full px-1"><NavLinks /></div>
    </div>
  );
}
