"use client";

import IRegion from "@/models/region";
import Button from "../button";
import { useEffect, useState } from "react";
import generateRandomColors from "@/utils/generate-random-colors";
import { ImageDown } from "lucide-react";
import fetchCurrentLocation from "@/utils/fetch-current-location";
import MapWrapper from "../map-wrapper";
import IMenu_item from "@/models/menu_item";
import MenuItemManager from "./menu-item-manager";
import Divider from "../divider";
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

export default function CreateStoreForm({ regions }: { regions: IRegion[] }) {
  const [logoState, setLogoState] = useState<"Upload" | "Default" | null>(null);
  const [gradientStyle, setGradientStyle] = useState<{ background: string }>({
    background: "",
  });
  const [defaultLogo, setDefaultLogo] = useState<[string, string] | null>(null);
  const [name, setName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("0");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currLocationError, setCurrLocationError] = useState<string | null>(
    null
  );
  const [menuItems, setMenuItems] = useState<IMenu_item[]>([]);

  const handleMenuSubmit = (menuItem: IMenu_item) => {
    setMenuItems((prev) => [...prev, menuItem]);
  };

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
          console.log(formData.get("region"));
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
          ) : (
            <div className="m-2.5 border border-champagne aspect-square h-64 w-64 flex items-center justify-center">
              <ImageDown />
            </div>
          )}
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
        </div>
        <div>
          <label htmlFor="description" className="text-champagne">
            Description
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
            placeholder="Description"
          ></textarea>
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
              Use Current Location
            </Button>
            <Dialog>
              <DialogTrigger>
               <span className="bg-coralPink text-champagne p-2.5 rounded-xl">Choose From Map</span>
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
                    <Button>
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Divider className="my-4" />
        <div>
          <h2 className="text-xl font-bold">Menu Item Manager</h2>
          <MenuItemManager />
        </div>
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
