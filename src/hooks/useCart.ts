"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { id: string; name: string; price: number; quantity: number };

type CartState = {
  items: CartItem[];
  total: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
        } else {
          items.push(item);
        }
        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
        set({ items, total });
      },
      remove: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
        set({ items, total });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().remove(id);
          return;
        }
        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === id);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity };
          const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
          set({ items, total });
        }
      },
      clear: () => set({ items: [], total: 0 }),
    }),
    { name: "mevi-cart" }
  )
);
