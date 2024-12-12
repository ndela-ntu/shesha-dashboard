"use server";

import IMenu_item from "@/models/menu_item";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const supabase = createClient();

const StoreSchema = z.object({
  regionId: z.string().min(1, "Region is required"),
  name: z.string().min(1, "Store name is required"),
  logoUrl: z
    .instanceof(File)
    .refine((file: File) => file.size !== 0, "Image is required")
    .refine((file: File) => {
      return !file || file.size <= 1024 * 1024 * 5;
    }, "File size must be less than 5Mb"),
  defaultLogo: z.object({
    from: z.string(),
    to: z.string(),
  }),
  description: z.string().min(1, "Description is required"),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .refine((obj) => Object.keys(obj).length > 1, {
      message: "Object must contain at least one key-value pair",
    }),
  menuItems: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        ingredients: z.array(z.string()),
        category: z.string(),
      })
    )
    .nonempty({ message: "Add at least one menu items" }),
});

export type State = {
  errors?: {
    name?: string[];
    defaultLogo?: string[];
    description?: string[];
    menuItems?: string[];
    regionId?: string[];
    location?: string[];
  };
  message?: string | null;
};

const CreateStoreSchema = StoreSchema.omit({
  logoUrl: true,
});

export async function createStore(prevState: State, formData: FormData) {
  const result = CreateStoreSchema.safeParse({
    regionId: formData.get("regionId"),
    defaultLogo: JSON.parse(formData.get("defaultLogo") as string),
    name: formData.get("name"),
    description: formData.get("description"),
    location: JSON.parse(formData.get("location") as string),
    menuItems: JSON.parse(formData.get("menu_items") as string),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create store",
    };
  }

  try {
    const { regionId, defaultLogo, name, description, location, menuItems } =
      result.data;

    const logo = formData.get("logo") as File | null;
    let logoUrl: string | null = null;

    if (logo) {
      const { data: imageData, error: imageError } = await (
        await supabase
      ).storage
        .from("shesha-bucket")
        .upload(`logos/${Date.now()}-${logo.name}`, logo);

      if (imageError) {
        throw new Error(`Failed to upload image: ${imageError.message}`);
      }

      const {
        data: { publicUrl },
      } = (await supabase).storage
        .from("shesha-bucket")
        .getPublicUrl(imageData.path);

      logoUrl = publicUrl;
    }

    const { data: coordinates, error: coordError } = await (
      await supabase
    )
      .from("coordinates")
      .insert({
        lat: location.lat,
        lng: location.lng,
      })
      .select()
      .single();

    if (coordError) {
      throw new Error(`Error creating coordinates: ${coordError}`);
    }

    const { data: store, error: storeError } = await (
      await supabase
    )
      .from("stores")
      .insert({
        name,
        logoUrl,
        defaultLogo,
        description,
        region_ref: parseInt(regionId),
        location_ref: coordinates.id,
      })
      .select()
      .single();

    if (storeError) {
      throw new Error(`Error creating store: ${storeError}`);
    }

    menuItems.forEach(async (menuItem) => {
      const { data: menuItemData, error: menuItemError } = await (
        await supabase
      )
        .from("menu_items")
        .insert({
          ...menuItem,
          category: menuItem.category.toUpperCase(),
          store_ref: store.id,
        });

      if (menuItemError) {
        throw new Error(`Error creating menuItem: ${menuItemError}`);
      }
    });
  } catch (error) {
    console.error(error);
    return { message: "Failed to save store. Please try again." };
  }

  revalidatePath("/dashboard/stores");
  redirect("/dashboard/stores");
}

const EditStoreSchema = StoreSchema.omit({
  logoUrl: true,
});

export async function editStore(prevState: State, formData: FormData) {
  const result = CreateStoreSchema.safeParse({
    regionId: formData.get("regionId"),
    defaultLogo: JSON.parse(formData.get("defaultLogo") as string),
    name: formData.get("name"),
    description: formData.get("description"),
    location: JSON.parse(formData.get("location") as string),
    menuItems: JSON.parse(formData.get("menu_items") as string),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create store",
    };
  }

  try {
    const { regionId, defaultLogo, name, description, location, menuItems } =
      result.data;
    const storeId = formData.get("storeId") as string;
    const coordinateId = formData.get("coordinateId") as string;

    let currentLogoUrl = formData.get("currentLogoUrl") as string | null;
    const logo = formData.get("logo") as File | null;

    if (logo && logo.size > 0) {
      if (currentLogoUrl) {
        const oldLogoPath = currentLogoUrl.split("/").pop();
        if (oldLogoPath) {
          await (await supabase).storage
            .from("shesha-bucket")
            .remove([`logos/${oldLogoPath}`]);
        } else {
          throw new Error("Unable to resolve old logo path");
        }
      }

      const { data: imageData, error: imageError } = await (
        await supabase
      ).storage
        .from("shesha-bucket")
        .upload(`logos/${Date.now()}-${logo.name}`, logo);
      if (imageError) {
        throw new Error(`Failed to upload image: ${imageError}`);
      }

      const {
        data: { publicUrl },
      } = (await supabase).storage
        .from("shesha-bucket")
        .getPublicUrl(imageData.path);

      currentLogoUrl = publicUrl;
    }
    const { data: coordinates, error: coordError } = await (await supabase)
      .from("coordinates")
      .update({ lat: location.lat, lng: location.lng })
      .eq("id", parseInt(coordinateId))
      .select()
      .single();

    if (coordError) {
      throw new Error(`Error creating coordinates: ${coordError}`);
    }

    const { data: store, error: storeError } = await (
      await supabase
    )
      .from("stores")
      .update({
        name,
        logoUrl: currentLogoUrl,
        defaultLogo,
        description,
        region_ref: parseInt(regionId),
        location_ref: coordinates.id,
      })
      .eq("id", parseInt(storeId))
      .select(
        `*,
        menu_items (*)`
      )
      .single();

    if (storeError) {
      throw new Error(`Error creating store: ${storeError}`);
    }

    menuItems.forEach(async (menuItem) => {
      //Check for newness, no update
      if (menuItem.id.toString().length === 13) {
        //Is Date/Is New - insert new
        const { data: menuItemData, error: menuItemError } = await (
          await supabase
        )
          .from("menu_items")
          .insert({
            ...menuItem,
            category: menuItem.category.toUpperCase(),
            store_ref: store.id,
          });

        if (menuItemError) {
          throw new Error(`Error creating menuItem: ${menuItemError}`);
        }
      }
      const dbMenuItems: Omit<IMenu_item, "category">[] = store.menu_items;

      if (!dbMenuItems.includes(menuItem)) {
        //Item not available any longer - delete old
        const { error: deleteMenuItemError } = await (await supabase)
          .from("menu_items")
          .delete()
          .eq("id", menuItem.id);
      }
    });
  } catch (error) {
    console.error(error);
    return { message: "Failed to save store. Please try again." };
  }

  revalidatePath("/dashboard/stores");
  redirect("/dashboard/stores");
}
