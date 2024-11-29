import IMenu_item from "./menu_item";

export default interface IMenu {
    id: number;
    name: string;
    category: string;
    menu_items: IMenu_item[];
}