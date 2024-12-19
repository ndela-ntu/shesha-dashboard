import IStore from "@/models/store";
import { Pencil } from "lucide-react";
import Link from "next/link";
import DeleteStoreButton from "./delete-store-button";
import DefaultAvatar from "../default-avatar";
import Image from "next/image";

export default function StoreListItem({ store }: { store: IStore }) {
  return (
    <li className="w-full my-2 flex flex-row items-center justify-between">
      <div className="flex h-full items-center space-x-2.5">
        <div className="aspect-square relative w-8 h-8">
          {store.logoUrl !== null ? (
            <Image
              alt="Store logo"
              src={store.logoUrl!}
              fill
              className="rounded-full"
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <DefaultAvatar
              defaultColors={store.default_logos}
              name={store.name}
            />
          )}
        </div>
        <span>{store.name}</span>
      </div>
      <div className="flex space-x-3 p-2 rounded-xl bg-coralPink text-champagne">
        <Link href={`/dashboard/stores/edit/${store.id}`}>
          <Pencil />
        </Link>
        <DeleteStoreButton id={store.id} />
      </div>
    </li>
  );
}
