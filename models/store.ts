import ICoordinate from "./coordinate";
import IMenu_item from "./menu_item";
import IRegion from "./region";

export default interface IStore {
    id: number;
    name: string;
    logoUrl?: string;
    defaultLogo: { from: string, to:string};
    description: string;
    coordinates: ICoordinate;
    regions: IRegion;
    menu_items: IMenu_item[];
}