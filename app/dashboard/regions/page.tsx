import Button from "@/components/button";
import Divider from "@/components/divider";
import RegionListItem from "@/components/region/region-list-item";
import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const supabase = createClient();
  const { data: regions, error } = await (await supabase)
    .from("regions")
    .select(`*, coordinates (lat, lng)`);

  if (error) {
    return <div>{`An error occurred: ${error.message}`}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-lg">Regions</span>
        <Link
          href="/dashboard/regions/new"
          className="flex space-x-1 items-center justify-center bg-coralPink text-champagne px-2 py-1 rounded-xl"
        >
          <span>New Region</span>
          <span>
            <Plus />
          </span>
        </Link>
      </div>
      <Divider />
      <ul className="w-full">
        {regions.map((region) => (
          <div key={region.id}>
            <RegionListItem region={region} />
            <Divider />
          </div>
        ))}
      </ul>
    </div>
  );
}
