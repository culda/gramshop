"use client";
import { Currency, Product } from "@/model";
import Script from "next/script";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Fragment,
} from "react";

type ShoppingCart = {
  items: {
    product: Product;
    quantity: number;
  }[];
};

type ShopContextType = {
  currency: Currency;
  products: Product[];
  cart: ShoppingCart;
  isProductInCart: (productId: string) => boolean;
  getProductQuantity: (productId: string) => number;
  getQuantityHtml: (productId: string) => ReactNode;
  addToCart: (product: Product) => void;
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
  preview = false,
  id,
  products,
  currency,
  children,
}: {
  preview?: boolean;
  id: string;
  currency: Currency;
  products: Product[];
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<ShoppingCart>({ items: [] });
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const checkout = () => {
    const checkoutData = {
      shopId: id,
      items: cart,
      auth: window.Telegram.WebApp.initDataUnsafe,
    };
    fetch("https://r8r37qb7jd.execute-api.us-east-1.amazonaws.com/checkout", {
      method: "POST",
      body: JSON.stringify(checkoutData),
    });
  };

  useEffect(() => {
    if (preview) {
      return;
    }

    if (!scriptLoaded) {
      return;
    }

    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.MainButton.setParams({
      text: "Checkout",
      is_visible: true,
    }).onClick(() => {
      console.log("Checkout clicked");
    });
  }, [preview, scriptLoaded]);

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      console.log("adding");
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

  const getQuantityHtml = (productId: string) => {
    const quantity = getProductQuantity(productId);
    if (quantity === 0) {
      return null;
    }

    return (
      <div className="absolute w-8 top-0 z-50 right-0 bg-blue-800 text-white text-center px-2 py-1 rounded-lg">
        {quantity}
      </div>
    );
  };

  const getProductQuantity = (productId: string) => {
    const cartItem = cart.items.find((item) => item.product.id === productId);
    return cartItem?.quantity || 0;
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => {
      const itemIndex = currentCart.items.findIndex(
        (item) => item.product.id === productId
      );
      if (itemIndex > -1) {
        const updatedItems = [...currentCart.items];
        updatedItems[itemIndex].quantity -= 1;
        if (updatedItems[itemIndex].quantity === 0) {
          updatedItems.splice(itemIndex, 1);
        }
        return {
          items: updatedItems,
        };
      }
      return currentCart;
    });
  };
  const isProductInCart = (productId: string) => {
    return cart.items.some((item) => item.product.id === productId);
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  return (
    <ShopContext.Provider
      value={{
        currency,
        products,
        cart,
        addToCart,
        isProductInCart,
        getQuantityHtml,
        getProductQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      <Fragment>
        <Script
          onLoad={() => setScriptLoaded(true)}
          src="https://telegram.org/js/telegram-web-app.js?1"
        />

        {children}
      </Fragment>
    </ShopContext.Provider>
  );
};
