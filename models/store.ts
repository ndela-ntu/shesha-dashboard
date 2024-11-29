import ICoordinate from "./coordinate";
import IMenu from "./menu";
import IRegion from "./region";

export default interface IStore {
    id: number;
    name: string;
    logoUrl: string;
    defaultLogo: { from: string, to:string};
    description: string;
    coordinates: ICoordinate;
    regions: IRegion;
    menu: IMenu;
}