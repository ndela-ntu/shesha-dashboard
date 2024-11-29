"use client";

import { Trash } from "lucide-react";

export default function DeleteStoreButton({ id }: { id: number }) {
  //const deleteRegionWithId = deleteRegion.bind(null, id);

  return (
    <form key={id}>
      <button type="submit">
        <Trash />
      </button>
    </form>
  );
}
