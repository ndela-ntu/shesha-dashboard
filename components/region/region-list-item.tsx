import IRegion from "@/models/region";
import { Eye, Pencil, Trash } from "lucide-react";
import Button from "../button";
import Link from "next/link";

export default function RegionListItem({ region }: { region: IRegion }) {
  return (
    <li className="w-full my-2 flex flex-row items-center justify-between">
      <span>{region.name}</span>
      <div className="flex space-x-2 p-2 rounded-xl bg-coralPink text-champagne">
        <button>
          <Eye />
        </button>
        <Link href="/dashboard/regions/edit">
          <Pencil />
        </Link>
        <button>
          <Trash />
        </button>
      </div>
    </li>
  );
}
