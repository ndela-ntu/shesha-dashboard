import { ITEMSCATEGORY } from "./item_category";

export default interface IMenu_item {
  id: number;
  price: number;
  ingredients: string[];
  category: ITEMSCATEGORY;
}
