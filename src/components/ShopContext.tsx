"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ShoppingCart = {
  items: {
    product: ProductItem;
    quantity: number;
  }[];
};

type ProductItem = {
  id: string;
  name: string;
  price: number;
};

type ShopContextType = {
  products: ProductItem[];
  cart: ShoppingCart;
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

export const ShopProvider = ({
  products,
  children,
}: {
  products: ProductItem[];
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<ShoppingCart>({ items: [] });

  const addToCart = (product: ProductItem) => {
    setCart((currentCart) => {
      const itemIndex = currentCart.items.findIndex(
        (item) => item.product.id === product.id
      );
      if (itemIndex > -1) {
        // If the product is already in the cart, update the quantity
        const updatedItems = [...currentCart.items];
        updatedItems[itemIndex].quantity += 1;
        return { ...currentCart, items: updatedItems };
      } else {
        // Product is not in the cart, add as a new item
        return {
          items: [...currentCart.items, { product, quantity: 1 }],
        };
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => {
      return {
        items: currentCart.items.filter(
          (item) => item.product.id !== productId
        ),
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
