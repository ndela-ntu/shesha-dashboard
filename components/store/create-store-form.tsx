"use client";

import IRegion from "@/models/region";
import Button from "../button";
import { useEffect, useState } from "react";
import generateRandomColors from "@/utils/generate-random-colors";
import { ImageDown } from "lucide-react";

export default function CreateStoreForm({ regions }: { regions: IRegion[] }) {
  const [logoState, setLogoState] = useState<"Upload" | "Default" | null>(null);
  const [gradientStyle, setGradientStyle] = useState<{ background: string }>({
    background: "",
  });
  const [name, setName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("0");

  const handleOnSwitchClick = () => {
    const colors = generateRandomColors();
    const gradientStyle = {
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
    };

    setGradientStyle(gradientStyle);
  };

  return (
    <form
      action={(formData) => {
        console.log(formData.get("region"));
      }}
      className="w-full flex flex-col space-y-2.5"
    >
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
        <label>Logo</label>
        <div className="flex">
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
        <label htmlFor="region" className="text-champagne">
          Region
        </label>
        <select
          name="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="select select-bordered w-full bg-champagne text-asparagus"
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
    </form>
  );
}
