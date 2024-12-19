import ICoordinate from "./coordinate";
import DefaultLogo from "./default_logo";
import IMenu_item from "./menu_item";
import IRegion from "./region";

export default interface IStore {
    id: number;
    name: string;
    logoUrl?: string;
    default_logos: DefaultLogo;
    description: string;
    coordinates: ICoordinate;
    regions: IRegion;
    menu_items: IMenu_item[];
}