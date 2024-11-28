"use client";

import IRegion from "@/models/region";
import SubmitButton from "../submit-button";
import { useActionState, useState } from "react";
import {
  State,
  editRegion,
  saveRegion,
} from "@/app/actions/region/region-actions";
import MapWrapper from "../map-wrapper";

export default function EditRegionForm({
  regionToEdit,
  regions,
}: {
  regionToEdit: IRegion;
  regions: IRegion[];
}) {
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined
  );
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState<State, FormData>(
    editRegion,
    initialState
  );

  return (
    <form
      action={(formData) => {
        if (coordinates) {
          formData.append("latitude", coordinates[0].toString());
          formData.append("longitude", coordinates[1].toString());
        } else {
          formData.append("latitude", regionToEdit.coordinates.lat.toString());
          formData.append("longitude", regionToEdit.coordinates.lng.toString());
        }
        formAction(formData);
      }}
      className="w-full flex flex-col space-y-2.5"
    >
      <input type="hidden" name="regionId" value={regionToEdit.id} />
      <input type="hidden" name="coordinateId" value={regionToEdit.id} />
      <div>
        <label htmlFor="name" className="text-champagne">
          Region name
        </label>
        <input
          name="name"
          type="text"
          defaultValue={regionToEdit.name}
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
        <div>
          <div className="flex space-x-2.5 items-center">
            <span>Pick Region - </span>
            <div className="h-5 w-5 rounded-full bg-orange-500 border border-orange-700"></div>
          </div>
          <div className="flex space-x-2.5 items-center">
            <span>Current Region - </span>
            <div className="h-5 w-5 rounded-full bg-gray-500 border border-gray-700"></div>
          </div>
        </div>
        <MapWrapper
          onLocationSelect={(coordinates) => {
            setCoordinates(coordinates);
          }}
          center={[regionToEdit.coordinates.lat, regionToEdit.coordinates.lng]}
          regions={regions.filter((region) => region.id !== regionToEdit.id)}
          regionInQuestion={regionToEdit}
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
        <SubmitButton className="rounded-xl z-20">Save</SubmitButton>
      </div>
    </form>
  );
}
