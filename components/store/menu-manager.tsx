"use client";

import { ITEMSCATEGORY } from "@/models/item_category";
import IMenu_item from "@/models/menu_item";
import { useState } from "react";
interface MenuManagerProps {
  onSubmit: (menuItem: IMenu_item) => void;
}

const MenuManager: React.FC<MenuManagerProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<Partial<IMenu_item>>({
    id: Date.now(),
    price: 0,
    ingredients: [],
    category: ITEMSCATEGORY.KOTA,
  });
  const [ingredient, setIngredient] = useState("");

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setForm({
        ...form,
        ingredients: [...(form.ingredients || []), ingredient],
      });
      setIngredient("");
    }
  };

  const handleSubmit = () => {
    if (form.price && form.ingredients?.length && form.category) {
      onSubmit(form as IMenu_item);
      setForm({
        id: Date.now(),
        price: 0,
        ingredients: [],
        category: ITEMSCATEGORY.KOTA,
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Price Input */}
      <div>
        <label className="block font-medium mb-1">Price</label>
        <input
          type="number"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>

      {/* Category Select */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as ITEMSCATEGORY })
          }
          className="border border-gray-300 rounded px-2 py-1 w-full"
        >
          {Object.values(ITEMSCATEGORY).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Ingredients Input */}
      <div>
        <label className="block font-medium mb-1">Ingredients</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 flex-1"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-blue-500 text-white rounded px-4 py-1"
          >
            Add Ingredient
          </button>
        </div>
        <ul className="mt-2">
          {form.ingredients?.map((ing, index) => (
            <li key={index} className="text-sm text-gray-600">
              {ing}
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-green-500 text-white rounded px-4 py-2"
      >
        Add Menu Item
      </button>
    </div>
  );
};

export default MenuManager;
