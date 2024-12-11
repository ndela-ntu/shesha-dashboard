"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { fetchExternalImage } from "next/dist/server/image-optimizer";
import { redirect } from "next/navigation";
import { z } from "zod";

const supabase = createClient();

const RegionSchema = z.object({
  regionId: z.string(),
  coordinateId: z.string(),
  name: z.string().min(1, "*Region name is required"),
  latitude: z.number({ message: "*Select region from map" }).min(-90).max(90),
  longitude: z
    .number({ message: "Select location from map" })
    .min(-180)
    .max(180),
});

export type State = {
  errors?: {
    name?: string[];
    latitude?: string[];
    longitude?: string[];
  };
  message?: string | null;
};

const SaveRegionSchema = RegionSchema.omit({
  regionId: true,
  coordinateId: true,
});
export async function saveRegion(prevState: State, formData: FormData) {
  // Extract data from FormData
  const name = formData.get("name");
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");

  // Validate and parse the data
  const result = SaveRegionSchema.safeParse({
    name,
    latitude: parseFloat(latitude as string),
    longitude: parseFloat(longitude as string),
  });

  if (!result.success) {
    // If validation fails, return the error messages
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create region",
    };
  }

  try {
    const { name, latitude, longitude } = result.data;
    const { data: coordinates, error: coordError } = await (await supabase)
      .from("coordinates")
      .insert({ lat: latitude, lng: longitude })
      .select()
      .single();

    if (coordError) throw coordError;

    const { data, error } = await (await supabase)
      .from("regions")
      .insert({ name: name, coordinates: coordinates.id })
      .select();

    if (error) throw error;
  } catch (error) {
    return {
      message: "Failed to save region. Please try again.",
    };
  }

  revalidatePath("/dashboard/regions");
  redirect("/dashboard/regions");
}

export async function editRegion(prevState: State, formData: FormData) {
  // Extract data from FormData
  const regionId = formData.get("regionId");
  const coordinateId = formData.get("coordinateId");
  const name = formData.get("name");
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");

  // Validate and parse the data
  const result = RegionSchema.safeParse({
    regionId,
    coordinateId,
    name,
    latitude: parseFloat(latitude as string),
    longitude: parseFloat(longitude as string),
  });

  if (!result.success) {
    // If validation fails, return the error messages
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create invoice",
    };
  }

  try {
    const { regionId, coordinateId, name, latitude, longitude } = result.data;

    const { data: coordinates, error: coordError } = await (await supabase)
      .from("coordinates")
      .update({ lat: latitude, lng: longitude })
      .eq("id", parseInt(regionId))
      .select();

    if (coordError) throw coordError;

    const { data, error } = await (await supabase)
      .from("regions")
      .update({ name })
      .eq("id", parseInt(coordinateId))
      .select();

    if (error) throw error;
  } catch (error) {
    return {
      message: "Failed to save region. Please try again.",
    };
  }

  revalidatePath("/dashboard/regions");
  redirect("/dashboard/regions");
}

export async function deleteRegion(id: number) {
  try {
    const { data: region, error: fetchRegionError } = await (await supabase)
      .from("regions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchRegionError) {
      throw new Error(`Failed to fetch region: ${fetchRegionError.message}`);
    }

    const { error: deleteRegionError } = await (await supabase)
      .from("regions")
      .delete()
      .eq("id", id);

    if (deleteRegionError) {
      throw new Error(`Failed to delete region: ${deleteRegionError.message}`);
    }

    const { error: deleteCoordError } = await (await supabase)
      .from("coordinates")
      .delete()
      .eq("id", region.coordinates);

    if (deleteCoordError) {
      throw new Error(
        `Failed to delete coordinates: ${deleteCoordError.message}`
      );
    }
  } catch (error) {
    console.error("Error in deleteRegion:", error);
  }

  revalidatePath("/dashboard/regions");
}
