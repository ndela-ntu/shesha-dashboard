import Divider from "@/components/divider";
import CreateRegionForm from "@/components/region/create-region-form";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data: regions, error } = await (await supabase)
    .from("regions")
    .select(`*, coordinates (lat, lng)`);

  if (error) {
    return <div>{`An error occurred: ${error.message}`}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Input New Region</h1>
      <Divider />
      <CreateRegionForm regions={regions} />
    </div>
  );
}
