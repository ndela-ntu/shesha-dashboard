import { ITEMSCATEGORY } from "./item_category";

export default interface IMenu_item {
  id: number;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  category: ITEMSCATEGORY;
}
