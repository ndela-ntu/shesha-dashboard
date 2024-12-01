"use client";

import { ITEMSCATEGORY } from "@/models/item_category";
import IMenu_item from "@/models/menu_item";
import Button from "../button";
import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';


const MenuItemManager: React.FC = () => {
  const [menuItems, setMenuItems] = useState<IMenu_item[]>([]);
  const [newItem, setNewItem] = useState<Omit<IMenu_item, "id">>({
    name: "",
    description: "",
    price: 0,
    ingredients: [],
    category: ITEMSCATEGORY.KOTA,
  });
  const [ingredientInput, setIngredientInput] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      ingredients: prev.ingredients.filter(
        (ingredient) => ingredient !== ingredientToRemove
      ),
    }));
  };

  const addMenuItem = () => {
    // Validate input
    if (
      !newItem.name ||
      !newItem.description ||
      newItem.price <= 0 ||
      newItem.ingredients.length === 0
    ) {
      alert("Please fill in all fields correctly");
      return;
    }

    const menuItem: IMenu_item = {
      ...newItem,
      id: Date.now(), // Using timestamp as a simple unique id
    };

    setMenuItems((prev) => [...prev, menuItem]);

    // Reset new item form
    setNewItem({
      name: "",
      description: "",
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Menu Item Manager</h2>

      {/* Add New Item Form */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Item Name"
            className="border p-2 rounded"
          />
          <select
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            {Object.values(ITEMSCATEGORY).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="description"
          value={newItem.description}
          onChange={(e) => handleInputChange(e)}
          placeholder="Item Description"
          className="w-full border p-2 rounded mt-4"
        />

        <div className="flex items-center mt-4">
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="border p-2 rounded w-24 mr-4"
          />

          <div className="flex items-center">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              placeholder="Add Ingredient"
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={addIngredient}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>

        {/* Ingredients Display */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-2">
            {newItem.ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="bg-blue-100 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-2 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={addMenuItem}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add Menu Item
        </button>
      </div>

      {/* Menu Items List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Menu Items</h3>
        {menuItems.length === 0 ? (
          <p className="text-gray-500">No menu items added yet</p>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <h4 className="font-bold text-xl">{item.name}</h4>
                  <p className="text-gray-600 mb-2">{item.category}</p>
                  <p className="mb-2">{item.description}</p>
                  <p className="font-semibold">
                    Price: R{item.price.toFixed(2)}
                  </p>
                  <div className="mt-2">
                    <strong>Ingredients:</strong>
                    <ul className="list-disc list-inside">
                      {item.ingredients.map((ingredient) => (
                        <li key={ingredient} className="text-sm">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => removeMenuItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemManager;
