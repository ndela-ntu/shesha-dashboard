"use client";

import IRegion from "@/models/region";
import SubmitButton from "../submit-button";
import MapWrapper from "./map-wrapper";
import { useActionState, useState } from "react";
import { State, saveRegion } from "@/app/actions/region/region-actions";
import { useFormState } from "react-dom";

export default function CreateRegionForm({ regions }: { regions: IRegion[] }) {
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined
  );
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState<State, FormData>(
    saveRegion,
    initialState
  );

  return (
    <form
      action={(formData) => {
        if (coordinates) {
          formData.append("latitude", coordinates[0].toString());
          formData.append("longitude", coordinates[1].toString());
        }
        formAction(formData);
      }}
      className="w-full flex flex-col space-y-2.5"
    >
      <div>
        <label htmlFor="name" className="text-champagne">
          Region name
        </label>
        <input
          name="name"
          type="text"
          className="input input-bordered input-sm w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
          placeholder="Enter region name"
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
        <div className="flex space-x-2.5 items-center">
          <span>Pick Region - </span>
          <div className="h-5 w-5 rounded-full bg-orange-500 border border-orange-700"></div>
        </div>
        <MapWrapper
          onLocationSelect={(coordinates) => {
            setCoordinates(coordinates);
          }}
          regions={regions}
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.latitude &&
            state.errors.latitude.map((error: string, i) => (
              <p key={i} className="text-sm text-yellow-500">
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="fixed bottom-2 right-2">
        <SubmitButton className="rounded-xl">Save</SubmitButton>
      </div>
    </form>
  );
}
