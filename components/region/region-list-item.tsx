"use client";

import IRegion from "@/models/region";
import { Eye, Pencil, Trash } from "lucide-react";
import Button from "../button";
import Link from "next/link";
import DeleteRegionButton from "./delete-region-button";

export default function RegionListItem({ region }: { region: IRegion }) {
  return (
    <div>
      <li className="w-full my-2 flex flex-row items-center justify-between">
        <span>{region.name}</span>
        <div className="flex space-x-3 p-2 rounded-xl bg-coralPink text-champagne">
          <Link href={`/dashboard/regions/edit/${region.id}`}>
            <Pencil />
          </Link>
          <DeleteRegionButton id={region.id} />
        </div>
      </li>
    </div>
  );
}
