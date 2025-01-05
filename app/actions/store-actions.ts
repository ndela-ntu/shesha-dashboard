"use server";

import { ITEMSCATEGORY } from "@/models/item_category";
import IMenu_item from "@/models/menu_item";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

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
  fromTime: z
    .string()
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9]:00\s?(AM|PM)$/i,
      "Invalid time format. Please use HH:MM AM/PM."
    ),
  toTime: z
    .string()
    .regex(
      /^(0?[1-9]|1[0-2]):[0-5][0-9]:00\s?(AM|PM)$/i,
      "Invalid time format. Please use HH:MM AM/PM."
    ),
  days: z
    .array(z.enum(daysOfWeek))
    .nonempty("At least one day must be selected"),
  menuItems: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        ingredients: z.array(z.string()),
        category: z.nativeEnum(ITEMSCATEGORY),
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
    fromTime?: string[];
    toTime?: string[];
    days?: string[];
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
    fromTime: formData.get("fromTime"),
    toTime: formData.get("toTime"),
    days: JSON.parse(formData.get("days") as string)["days"],
    menuItems: JSON.parse(formData.get("menu_items") as string),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create store",
    };
  }

  try {
    const {
      regionId,
      defaultLogo,
      name,
      description,
      location,
      fromTime,
      toTime,
      days,
      menuItems,
    } = result.data;

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

    const { data: defaultLogoData, error: logoError } = await (await supabase)
      .from("default_logos")
      .insert({ from: defaultLogo.from, to: defaultLogo.to })
      .select()
      .single();

    if (logoError) {
      throw new Error(`Error creating coordinates: ${logoError.message}`);
    }

    const jsonDays = daysOfWeek.map((dayOfWeek) => {
      if (days.includes(dayOfWeek)) {
        return { [dayOfWeek]: "active" };
      }

      return { [dayOfWeek]: "inactive" };
    });

    const { data: operatingHours, error: operatingError } = await (
      await supabase
    )
      .from("store_operating_hours")
      .insert({ from: fromTime, to: toTime, days: jsonDays })
      .select()
      .single();

    if (operatingError) {
      throw new Error(
        `Error creating operating hours: ${operatingError.message}`
      );
    }

    const { data: store, error: storeError } = await (
      await supabase
    )
      .from("stores")
      .insert({
        name,
        logoUrl,
        description,
        region_ref: parseInt(regionId),
        location_ref: coordinates.id,
        default_logo_ref: defaultLogoData.id,
        operating_hours_ref: operatingHours.id,
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
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          ingredients: menuItem.ingredients,
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
    fromTime: formData.get("fromTime"),
    toTime: formData.get("toTime"),
    days: JSON.parse(formData.get("days") as string)["days"],
    menuItems: JSON.parse(formData.get("menu_items") as string),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create store",
    };
  }

  try {
    const {
      regionId,
      defaultLogo,
      name,
      description,
      location,
      fromTime,
      toTime,
      days,
      menuItems,
    } = result.data;

    const storeId = formData.get("storeId") as string;
    const storeOperatingHoursId = formData.get(
      "storeOperatingTimeId"
    ) as string;
    const coordinateId = formData.get("coordinateId") as string;
    const defaultLogoId = formData.get("defaultLogoId") as string;

    let currentLogoUrl = formData.get("currentLogoUrl") as string | null;
    const logo = formData.get("logo") as File | null;
    const logoRemoved = formData.get("logoRemoved") as string;

    //Logo Replacement
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
        throw new Error(`Failed to upload image: ${imageError.message}`);
      }

      const {
        data: { publicUrl },
      } = (await supabase).storage
        .from("shesha-bucket")
        .getPublicUrl(imageData.path);

      currentLogoUrl = publicUrl;
    } //Logo removal
    else if (logoRemoved === "true") {
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
    }

    const { data: coordinates, error: coordError } = await (await supabase)
      .from("coordinates")
      .update({ lat: location.lat, lng: location.lng })
      .eq("id", parseInt(coordinateId))
      .select()
      .single();

    if (coordError) {
      throw new Error(`Error editing coordinates: ${coordError}`);
    }

    const { data: defaultLogoData, error: logoError } = await (await supabase)
      .from("default_logos")
      .update({ from: defaultLogo.from, to: defaultLogo.to })
      .eq("id", parseInt(defaultLogoId))
      .select()
      .single();

    if (logoError) {
      throw new Error(`Error editing defaultLogo: ${logoError.message}`);
    }

    const jsonDays = daysOfWeek.map((dayOfWeek) => {
      if (days.includes(dayOfWeek)) {
        return { [dayOfWeek]: "active" };
      }

      return { [dayOfWeek]: "inactive" };
    });

    const { data: operatingHours, error: operatingError } = await (
      await supabase
    )
      .from("store_operating_hours")
      .update({ from: fromTime, to: toTime, days: jsonDays })
      .eq("id", parseInt(storeOperatingHoursId))
      .select()
      .single();

    if (operatingError) {
      throw new Error(
        `Error creating operating hours: ${operatingError.message}`
      );
    }

    const { data: store, error: storeError } = await (
      await supabase
    )
      .from("stores")
      .update({
        name,
        logoUrl: logoRemoved === "true" ? null : currentLogoUrl,
        description,
        region_ref: parseInt(regionId),
        location_ref: coordinates.id,
        default_logo_ref: defaultLogoData.id,
        operating_hours_ref: operatingHours.id,
      })
      .eq("id", parseInt(storeId))
      .select(
        `*,
        menu_items (*)`
      )
      .single();

    if (storeError) {
      throw new Error(`Error creating store: ${storeError.message}`);
    }

    console.log("Inserting new");
    await insertMenuItems(menuItems, store.id);

    const dbMenuItems: IMenu_item[] = store.menu_items;
    const menuItemIds = menuItems.map((item) => item.id);
    const filteredDbMenuItems = dbMenuItems.filter(
      (item) => !menuItemIds.includes(item.id)
    );

    if (filteredDbMenuItems.length > 0) {
      console.log("Deleting old");
      await deleteMenuItems(filteredDbMenuItems);
    }
  } catch (error) {
    console.error(error);
    return { message: "Failed to save store. Please try again." };
  }

  revalidatePath("/dashboard/stores");
  redirect("/dashboard/stores");
}

export async function deleteStore(id: number) {
  try {
    const { data: store, error: fetchStoreError } = await (await supabase)
      .from("stores")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchStoreError) {
      throw new Error(`Failed to fetch store: ${fetchStoreError.message}`);
    }

    if (store.logoUrl) {
      const imagePath = store.logoUrl.split("/").pop();
      const { error: storageError } = await (await supabase).storage
        .from("shesha-bucket")
        .remove([`logos/${imagePath}`]);

      if (storageError) {
        console.error(`Failed to delete image: ${storageError.message}`);
        // Continue with item deletion even if image deletion fails
      }
    }

    const { data: menuItems, error: fetchMenuItemsError } = await (
      await supabase
    )
      .from("menu_items")
      .select("*")
      .eq("store_ref", id);

    if (fetchMenuItemsError) {
      throw new Error(`Failed to fetch region: ${fetchMenuItemsError.message}`);
    }

    await deleteMenuItems(menuItems);

    const { error: deleteStoreError } = await (await supabase)
      .from("stores")
      .delete()
      .eq("id", id);

    if (deleteStoreError) {
      throw new Error(`Failed to delete store: ${deleteStoreError.message}`);
    }

    // const { error: deleteRegionError } = await (await supabase)
    //   .from("regions")
    //   .delete()
    //   .eq("id", store.region_ref);

    // if (deleteRegionError) {
    //   throw new Error(`Failed to delete region: ${deleteRegionError.message}`);
    // }

    const { error: deleteCoordError } = await (await supabase)
      .from("coordinates")
      .delete()
      .eq("id", store.location_ref);

    if (deleteCoordError) {
      throw new Error(
        `Failed to delete coordinates: ${deleteCoordError.message}`
      );
    }

    const { error: deleteDefaultLogoError } = await (await supabase)
      .from("default_logos")
      .delete()
      .eq("id", store.default_logo_ref);

    if (deleteDefaultLogoError) {
      throw new Error(
        `Failed to delete default_logo: ${deleteDefaultLogoError.message}`
      );
    }

    const { error: deleteOperatingTimeError } = await (await supabase)
      .from("store_operating_hours")
      .delete()
      .eq("id", store.operating_hours_ref);

    if (deleteOperatingTimeError) {
      throw new Error(
        `Failed to delete operating hours: ${deleteOperatingTimeError.message}`
      );
    }
  } catch (error) {
    console.error("Error in deleteStore:", error);
  }

  revalidatePath("/dashboard/stores");
}

const insertMenuItems = async (menuItems: IMenu_item[], store_ref: number) => {
  const promises = menuItems.map(async (menuItem) => {
    if (menuItem.id.toString().length === 13) {
      const { data: menuItemData, error: menuItemError } = await (
        await supabase
      )
        .from("menu_items")
        .insert({
          name: menuItem.name,
          description: menuItem.description,
          ingredients: menuItem.ingredients,
          price: menuItem.price,
          category: menuItem.category.toUpperCase(),
          store_ref,
        });

      if (menuItemError) {
        throw new Error(`Error creating menuItem: ${menuItemError.message}`);
      }
    }
  });

  await Promise.all(promises);
};

const deleteMenuItems = async (menuItems: IMenu_item[]) => {
  const promises = menuItems.map(async (menuItem) => {
    const { error: deleteMenuItemError } = await (await supabase)
      .from("menu_items")
      .delete()
      .eq("id", menuItem.id);

    if (deleteMenuItemError) {
      throw new Error(`Failed to delete store: ${deleteMenuItemError.message}`);
    }
  });

  await Promise.all(promises);
};
