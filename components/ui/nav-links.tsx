"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./sign-out-button";
import { Car, House, LandPlot, Store } from "lucide-react";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <House />,
  },
  {
    name: "Regions",
    href: "/dashboard/regions",
    icon: <LandPlot />,
  },
  {
    name: "Stores",
    href: "/dashboard/stores",
    icon: <Store />,
  },
  {
    name: "Drivers",
    href: "/dashboard/drivers",
    icon: <Car />,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="w-full flex md:flex-col justify-between items-center">
      {links.map((link) => {
        return (
          <Link
            className={`w-full flex h-[48px] grow items-center justify-center gap-2 rounded-md ${
              pathname === link.href
                ? "text-champagne bg-coralPink border border-champagne"
                : "text-champagne bg-olivine border border-asparagus"
            } p-3 font-medium hover:bg-coralPink hover:text-champagne md:flex-none md:justify-start md:p-2 md:px-3`}
            key={link.name}
            href={link.href}
          >
            <span>{link.icon}</span>
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
      <div className="md:w-full">
        <SignOutButton />
      </div>
    </div>
  );
}
