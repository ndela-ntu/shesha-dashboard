import Button from "@/components/button";
import Divider from "@/components/divider";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-lg">Regions</span>
        <Link href="/dashboard/regions/new" className="flex space-x-1 items-center justify-center bg-coralPink text-champagne px-2 py-1 rounded-xl">
          <span>New Region</span>
          <span>
            <Plus />
          </span>
        </Link>
      </div>
      <Divider />
    </div>
  );
}
