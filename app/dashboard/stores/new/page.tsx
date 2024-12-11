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

  return (
    <div className="flex flex-col items-center">
      <h1>Input New Store</h1>
      <Divider />
      <CreateStoreForm regions={regions} />
    </div>
  );
}
