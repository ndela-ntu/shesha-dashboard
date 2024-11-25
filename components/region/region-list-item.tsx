"use client";

import IRegion from "@/models/region";
import { Eye, Pencil, Trash } from "lucide-react";
import Button from "../button";
import Link from "next/link";
import MapWrapper from "./map-wrapper";

export default function RegionListItem({ region }: { region: IRegion }) {
  return (
    <div>
      <li className="w-full my-2 flex flex-row items-center justify-between">
        <span>{region.name}</span>
        <div className="flex space-x-3 p-2 rounded-xl bg-coralPink text-champagne">
          <button
            onClick={() => {
              (
                document.getElementById(
                  `region-view-${region.id}`
                ) as HTMLDialogElement
              ).showModal();
            }}
          >
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
      <dialog key={region.id} id={`region-view-${region.id}`} className="modal">
        <div className="modal-box">
          <MapWrapper
            disableLocationSelect={true}
            regions={[region]}
            center={[region.coordinates.lat, region.coordinates.lng]}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
