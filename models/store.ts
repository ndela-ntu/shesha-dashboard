import ICoordinate from "./coordinate";
import IDefaultLogo from "./default_logo";
import IMenu_item from "./menu_item";
import IRegion from "./region";
import IStoreOperatingHours from "./store_operating_hours";

export default interface IStore {
    id: number;
    name: string;
    logoUrl?: string;
    default_logos: IDefaultLogo;
    description: string;
    coordinates: ICoordinate;
    regions: IRegion;
    menu_items: IMenu_item[];
    store_operating_hours: IStoreOperatingHours;
}