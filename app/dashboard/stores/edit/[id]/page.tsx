import Divider from "@/components/divider";
import EditStoreForm from "@/components/store/edit-store-form";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = createClient();
  const { data: store, error: storeError } = await (
    await supabase
  )
    .from("stores")
    .select(
      `
      *,
      coordinates (*),
      regions (*),
      menu_items (*)
    `
    )
    .eq("id", id)
    .single();

  const { data: regions, error: regionError } = await (await supabase)
    .from("regions")
    .select(`*, coordinates (id, lat, lng)`);

  if (!store) {
    return notFound();
  }

  if (storeError || regionError) {
    return (
      <div>{`An error occurred: ${storeError?.message || regionError?.message}`}</div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Edit Store</h1>
      <Divider />
      <EditStoreForm regions={regions} store={store} />
    </div>
  );
}
