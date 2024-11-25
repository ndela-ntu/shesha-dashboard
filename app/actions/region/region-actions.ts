"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const supabase = createClient();

const RegionSchema = z.object({
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

export async function saveRegion(prevState: State, formData: FormData) {
  // Extract data from FormData
  const name = formData.get("name");
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");

  // Validate and parse the data
  const result = RegionSchema.safeParse({
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
