import IStore from "@/models/store";
import { Pencil } from "lucide-react";
import Link from "next/link";
import DeleteStoreButton from "./delete-store-button";

export default function StoreListItem({ store }: { store: IStore }) {
  return (
    <li className="w-full my-2 flex flex-row items-center justify-between">
      <span>{store.name}</span>
      <div className="flex space-x-3 p-2 rounded-xl bg-coralPink text-champagne">
        <Link href={`/dashboard/stores/edit/${store.id}`}>
          <Pencil />
        </Link>
        <DeleteStoreButton id={store.id} />
      </div>
    </li>
  );
}
