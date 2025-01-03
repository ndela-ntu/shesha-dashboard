import Divider from "@/components/divider";
import EditRegionForm from "@/components/region/edit-region-form";
import IRegion from "@/models/region";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{id: string}> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = createClient();
  const { data: regions, error } = await (await supabase)
    .from("regions")
    .select(`*, coordinates (id, lat, lng)`);

  let regionToEdit: IRegion | null = null;

  if (regions) {
    regionToEdit = regions?.find((region: IRegion) => {
      return region.id === parseFloat(id.toString());
    });
  }

  if (error) {
    return <div>{`An error occurred: ${error.message}`}</div>;
  }

  if (!regionToEdit) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Edit Region</h1>
      <Divider />
      <EditRegionForm regionToEdit={regionToEdit} regions={regions} />
    </div>
  );
}
