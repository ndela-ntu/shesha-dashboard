'use client';

import { deleteRegion } from "@/app/actions/region-actions";
import { Trash } from "lucide-react";

export default function DeleteRegionButton({ id }: { id: number }) {
  const deleteRegionWithId = deleteRegion.bind(null, id);

  return (
    <form key={id} action={deleteRegionWithId}>
      <button type="submit">
        <Trash />
      </button>
    </form>
  );
}
