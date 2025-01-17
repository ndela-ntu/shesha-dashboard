import Divider from "@/components/divider";
import CreateStoreForm from "@/components/store/create-store-form";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data: regions, error } = await (await supabase)
    .from("regions")
    .select(`*, coordinates (lat, lng)`);

  if (error) {
    return <div>{`An error occurred: ${error.message}`}</div>;
  }

  if (regions.length === 0) {
    return <div>Cannot create store without regions</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1>New Store</h1>
      <Divider />
      <CreateStoreForm regions={regions} />
    </div>
  );
}
