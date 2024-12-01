"use client";

import { ITEMSCATEGORY } from "@/models/item_category";
import IMenu_item from "@/models/menu_item";
import { useState } from "react";
import Button from "../button";

const MenuItemManager: React.FC = () => {
  const [menuItems, setMenuItems] = useState<IMenu_item[]>([]);
  const [newItem, setNewItem] = useState<Omit<IMenu_item, "id">>({
    price: 0,
    ingredients: [],
    category: ITEMSCATEGORY.KOTA,
  });
  const [ingredientInput, setIngredientInput] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setNewItem((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setNewItem((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing !== ingredientToRemove),
    }));
  };

  const addMenuItem = () => {
    const itemToAdd = {
      ...newItem,
      id: Date.now(), // Using timestamp as a simple unique ID
    };
    setMenuItems((prev) => [...prev, itemToAdd]);

    // Reset the form
    setNewItem({
      price: 0,
      ingredients: [],
      category: ITEMSCATEGORY.KOTA,
    });
    setIngredientInput("");
  };

  const removeMenuItem = (idToRemove: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  return (
    <div className="mx-auto">
      {/* Input Form */}
      <div className="flex flex-col space-y-2.5 mb-4">
        <div className="flex flex-col">
          <label>Category</label>
          <select
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            className="select select-bordered select-sm w-full bg-champagne text-asparagus"
          >
            {Object.values(ITEMSCATEGORY).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="input input-bordered input-sm w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
          />
        </div>

        {/* Ingredients Section */}
        <div className="flex items-center justify-center mb-2 space-x-2.5">
          <div>
            <label>Ingredient</label>
            <input
              type="text"
              name="ingredient"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              placeholder="Add ingredient"
              className="input input-bordered input-sm w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
            />
          </div>
          <Button onClick={addIngredient}>Add Ingredient</Button>
        </div>

        {/* Displayed Ingredients */}
        <div className="mb-2">
          {newItem.ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-block bg-champagne text-asparagus px-2 py-1 rounded mr-2 mb-2"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add Menu Item Button */}
        <Button disabled={!newItem.ingredients.length} onClick={addMenuItem}>
          Add Menu Item
        </Button>
      </div>

      {/* Menu Items List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Menu Items</h3>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="border p-2 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Category:</strong> {item.category}
              </p>
              <p>
                <strong>Price:</strong> R{item.price.toFixed(2)}
              </p>
              <p>
                <strong>Ingredients:</strong> {item.ingredients.join(", ")}
              </p>
            </div>
            <button
              onClick={() => removeMenuItem(item.id)}
              className="bg-champagne text-asparagus rounded-xl px-2 py-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItemManager;
