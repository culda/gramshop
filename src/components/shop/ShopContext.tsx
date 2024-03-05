"use client";
import { CheckoutRequest } from "@/functions/checkout/handler";
import { Currency, Product, ShoppingCart } from "@/model";
import Script from "next/script";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Fragment,
  useCallback,
  useRef,
} from "react";

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
  const [webappLoaded, setWebappLoaded] = useState(false);
  const [initiateCheckout, setInitiateCheckout] = useState(false);

  const checkout = useCallback(async () => {
    if (!webappLoaded) {
      return;
    }

    const checkoutData = {
      shopId: id,
      cart,
      authData: window.Telegram.WebApp.initData,
    } satisfies CheckoutRequest;
    await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/checkout`, {
      method: "POST",
      body: JSON.stringify(checkoutData),
    });
    window.Telegram.WebApp.close();
  }, [cart, id, webappLoaded]);

  useEffect(() => {
    if (initiateCheckout) {
      checkout();
      setInitiateCheckout(false); // Reset the trigger
    }
  }, [checkout, initiateCheckout]); // Ensure checkout function is correctly referenced if needed

  useEffect(() => {
    if (webappLoaded) {
      return;
    }

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
    }).onClick(() => setInitiateCheckout(true));

    setWebappLoaded(true);
  }, [webappLoaded, preview, scriptLoaded, checkout]);

  useEffect(() => {
    if (!window.Telegram) {
      return;
    }

    const totalQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    window.Telegram.WebApp.MainButton.setParams({
      text: `Checkout (${totalQuantity})`,
      is_visible: true,
    });
  }, [cart]);

  const addToCart = (product: Product) => {
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
