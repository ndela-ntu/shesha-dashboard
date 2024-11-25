import ICoordinate from "./coordinate";

export default interface IRegion {
    id: number;
    coordinates: ICoordinate;
    name: string;
}