import Divider from "@/components/divider";
import EditStoreForm from "@/components/store/edit-store-form";
import IStore from "@/models/store";
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
    regions (*),
    default_logos (*),
    coordinates (*),
    menu_items (*),
    store_operating_hours (*)
  `
    )
    .eq("id", id)
    .single();

  const { data: regions, error: regionError } = await (await supabase)
    .from("regions")
    .select(`*, coordinates (id, lat, lng)`);

  if (storeError || regionError) {
    return <div>{`${storeError?.message || regionError?.message}`}</div>;
  }

  if (!store) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Edit Store</h1>
      <Divider />
      <EditStoreForm regions={regions} store={store} />
    </div>
  );
}
