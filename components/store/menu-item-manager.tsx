"use client";

import { ITEMSCATEGORY } from "@/models/item_category";
import IMenu_item from "@/models/menu_item";
import Button from "../button";
import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { ImageUpload } from "../image-upload";

export default function MenuItemManager({
  onItemsChangeCB,
  initMenuItems,
}: {
  onItemsChangeCB: (menuItems: IMenu_item[]) => void;
  initMenuItems?: IMenu_item[];
}) {
  const [menuItems, setMenuItems] = useState<IMenu_item[]>(
    initMenuItems ? initMenuItems : []
  );
  const [newItem, setNewItem] = useState<Omit<IMenu_item, "id">>({
    name: "",
    description: "",
    price: 0,
    ingredients: [],
    category: ITEMSCATEGORY.KOTA,
    image_url: "",
  });
  const [ingredientInput, setIngredientInput] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    if (initMenuItems) {
      setMenuItems(initMenuItems);
    }
  }, []);

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
      image_url: "",
    });
    setIngredientInput("");
  };

  const removeMenuItem = (idToRemove: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleImageChange = (stringImage: string) => {
    setNewItem((prev) => ({ ...prev, image_url: stringImage }));
  };

  useEffect(() => {
    onItemsChangeCB(menuItems);
  }, [menuItems]);

  return (
    <div className="">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <label>Item Image</label>
          <ImageUpload
            clearImage={newItem.image_url === ""}
            onImageStringUpload={handleImageChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <label>Name</label>
          <label>Category</label>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Item Name"
            className="input input-bordered input-sm w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
          />
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
          <label>Description</label>
          <textarea
            name="description"
            value={newItem.description}
            onChange={(e) => handleInputChange(e)}
            placeholder="Item Description"
            className="textarea textarea-bordered w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
          />
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex flex-col">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="input input-bordered input-sm w-24 border border-champagne bg-transparent placeholder-champagne text-champagne"
            />
          </div>

          <div className="flex items-end">
            <div className="flex flex-col">
              <label>Ingredient</label>
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                placeholder="Add Ingredient"
                className="input input-bordered input-sm w-full border border-champagne bg-transparent placeholder-champagne text-champagne"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addIngredient();
              }}
              className="bg-coralPink text-champagne p-2 rounded"
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
                className="bg-champagne text-asparagus px-2 py-1 rounded-xl text-sm flex items-center"
              >
                {ingredient}
                <button
                  type="button"
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
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addMenuItem();
          }}
          className="bg-champagne text-asparagus p-2 rounded flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add Menu Item
        </button>
      </div>

      {/* Menu Items List */}
      <div className="py-2.5 w-full">
        <h3 className="underline">Current Menu Items</h3>
        {menuItems.length === 0 ? (
          <p className="text-champagne">No menu items added yet</p>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-row items-start space-x-2.5"
              >
                <div className="aspect-square w-28 md:w-48 lg:w-64">
                  <img
                    src={item.image_url}
                    alt="Image of food item"
                    className={`w-full h-full object-cover object-center`}
                  />
                </div>
                <div className="border p-4 rounded-lg flex flex-col justify-between w-full">
                  <div>
                    <h4 className="font-bold text-xl">{item.name}</h4>
                    <p className="text-champagne mb-2">{item.category}</p>
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
                    type="button"
                    onClick={() => removeMenuItem(item.id)}
                    className="text-red-500 hover:text-red-700 self-end"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
