import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { CartItem, InsertTables, Product, Tables } from "../types";

import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order_items";

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};
const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItem } = useInsertOrderItems();
  const router = useRouter();
  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }
    const newCartItem: CartItem = {
      product,
      product_id: product.id,
      quantity: 1,
      size,
      id: randomUUID(), //generate unique id
    };
    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item) =>
        item.id !== itemId
          ? item
          : { ...item, quantity: item.quantity + amount }
      )
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };
  const total = items.reduce(
    (accumulator, item) => accumulator + item.product.price * item.quantity,
    0
  );
  const clearCart = () => {
    setItems([]);
  };
  const checkout = () => {
    console.warn("Checkout");
    insertOrder(
      {
        total,
      },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (newOrder: Tables<"orders">) => {
    insertOrderItem(
      {
        items,
        order_id: newOrder.id,
      },
      {
        onSuccess() {
          setItems([]);
          router.push(`/(user)/orders/${newOrder.id}`);
        },
      }
    );
  };
  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
