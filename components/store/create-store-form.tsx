"use client";

import IRegion from "@/models/region";
import Button from "../button";
import { useActionState, useEffect, useState } from "react";
import generateRandomColors from "@/utils/generate-random-colors";
import { ImageDown } from "lucide-react";
import fetchCurrentLocation from "@/utils/fetch-current-location";
import MapWrapper from "../map-wrapper";
import IMenu_item from "@/models/menu_item";
import MenuItemManager from "./menu-item-manager";
import Divider from "../divider";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "../image-upload";
import SubmitButton from "../submit-button";
import { State, createStore } from "@/app/actions/store-actions";

export default function CreateStoreForm({ regions }: { regions: IRegion[] }) {
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState<State, FormData>(
    createStore,
    initialState
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoState, setLogoState] = useState<"Upload" | "Default" | null>(null);
  const [gradientStyle, setGradientStyle] = useState<{ background: string }>({
    background: "",
  });
  const [defaultLogo, setDefaultLogo] = useState<[string, string] | null>(null);
  const [name, setName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("0");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currLocationError, setCurrLocationError] = useState<string | null>(
    null
  );
  const [menuItems, setMenuItems] = useState<IMenu_item[]>([]);

  useEffect(() => {
    setDefaultLogo(generateRandomColors());
  }, []);

  const handleOnSwitchClick = () => {
    const colors = generateRandomColors();
    setDefaultLogo(colors);
    const gradientStyle = {
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
    };

    setGradientStyle(gradientStyle);
  };

  const handleOnCurrentLocationClick = async () => {
    const { location, error } = await fetchCurrentLocation();

    if (error) {
      setCurrLocationError(error);
      (
        document.getElementById("location_error") as HTMLDialogElement
      ).showModal();
    } else {
      setLocation(location);
    }
  };

  return (
    <div className="pb-6">
      <form
        action={(formData) => {
          if (imageFile) {
            formData.append("logo", imageFile);
          } else {
            formData.append(
              "defaultLogo",
              JSON.stringify({ from: defaultLogo?.[0], to: defaultLogo?.[1] })
            );
          }
          formData.append("name", name);
          formData.append("description", description);
          formData.append("regionId", selectedRegion);
          formData.append(
            "location",
            JSON.stringify({
              lat: location?.latitude,
              lng: location?.longitude,
            })
          );
          formData.append("menu_items", JSON.stringify(menuItems));
          formAction(formData);
        }}
        className="w-full flex flex-col space-y-2.5"
      >
        <div>
          <label>Logo</label>
          <div className="flex w-full space-x-1">
            <Button
              onClick={() => {
                setLogoState("Upload");
              }}
            >
              Upload Logo
            </Button>
            <Button
              onClick={() => {
                handleOnSwitchClick();
                setLogoState("Default");
              }}
            >
              Use Default Avatar
            </Button>
          </div>
          {logoState === "Default" ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div
                style={{ ...gradientStyle }}
                className={`m-2.5 border border-champagne aspect-square h-64 w-64 rounded-full flex items-center justify-center`}
              >
                <button
                  className="bg-coralPink text-asparagus px-2.5 py-1 rounded-xl"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOnSwitchClick();
                  }}
                >
                  Switch
                </button>
              </div>
            </div>
          ) : (
            <ImageUpload onImageUpload={setImageFile} />
          )}
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.defaultLogo &&
              state.errors.defaultLogo.map((error: string, i) => (
                <p key={i} className="text-sm text-yellow-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div>
          <label htmlFor="name" className="text-champagne">
            Store name
          </label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered input-sm w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
            placeholder="Enter store name"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string, i) => (
                <p key={i} className="text-sm text-yellow-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div>
          <label htmlFor="description" className="text-champagne">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
            placeholder="Description"
          ></textarea>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string, i) => (
                <p key={i} className="text-sm text-yellow-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div>
          <label htmlFor="region" className="text-champagne">
            Region
          </label>
          <select
            name="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="select select-bordered select-sm w-full bg-champagne text-asparagus"
          >
            <option value="0" disabled>
              Select region
            </option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.regionId &&
              state.errors.regionId.map((error: string, i) => (
                <p key={i} className="text-sm text-yellow-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="location"
            className="text-champagne flex justify-between"
          >
            <span>Location</span>
            {location && (
              <span>{`[${location?.latitude}, ${location?.longitude}]`}</span>
            )}
          </label>
          <div className="flex w-full space-x-1">
            <Button
              onClick={() => {
                handleOnCurrentLocationClick();
              }}
            >
              Current Location
            </Button>
            <Dialog>
              <DialogTrigger>
                <div className="bg-coralPink text-champagne p-1.5 rounded-xl">
                  Choose From Map
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pick Location From Map</DialogTitle>
                  <DialogDescription>
                    Pick the store location within a valid region, indicated by
                    the blue circle on the map.
                  </DialogDescription>
                </DialogHeader>
                <MapWrapper
                  onLocationSelect={(coordinates) => {
                    setLocation({
                      latitude: Number(coordinates[0].toFixed(7)),
                      longitude: Number(coordinates[1].toFixed(7)),
                    });
                  }}
                  isRegionSelect={false}
                  regions={regions}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.location &&
              state.errors.location.map((error: string, i) => (
                <p key={i} className="text-sm text-yellow-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <Divider className="my-4" />
        <div>
          <h2 className="underline">Menu Item Manager</h2>
          <MenuItemManager onItemsChangeCB={setMenuItems} />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.menuItems &&
              state.errors.menuItems.map((error: string, i) => (
                <p key={i} className="text-sm text-yellow-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <SubmitButton className="fixed bottom-4 right-4">Save</SubmitButton>
      </form>
      <dialog id="location_error" className="modal">
        <div className="modal-box bg-coralPink text-champagne">
          <h3 className="font-bold text-lg">Error Using Location</h3>
          <p className="py-4">{currLocationError}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
