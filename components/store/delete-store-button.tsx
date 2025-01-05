"use client";

import { deleteStore } from "@/app/actions/store-actions";
import { Trash } from "lucide-react";

export default function DeleteStoreButton({ id }: { id: number }) {
  const deleteStoreWithId = deleteStore.bind(null, id);

  return (
    <form key={id} action={deleteStoreWithId}>
      <button type="submit">
        <Trash />
      </button>
    </form>
  );
}
