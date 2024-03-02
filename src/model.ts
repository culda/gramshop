export type Product = {
  id: string;
  name: string;
  price: number; // Price in the smallest units of the currency (e.g., cents for USD)
  image: string;
};

export type TgUser = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  is_premium: boolean;
  allows_write_to_pm: boolean;
};

export type AuthData = {
  query_id: string;
  user: TgUser;
  auth_date: string;
  hash: string;
};

export type ShoppingCart = {
  items: {
    product: Product;
    quantity: number;
  }[];
};

export type Shop = {
  name: string;
  id: string;
  userId: string;
  providerToken?: string;
  currency: Currency;
  botToken?: string;
  products: Product[];
};

export type TempShop = {
  id: string;
  products: Product[];
};

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case Currency.USD:
      return "$";
    case Currency.EUR:
      return "€";
    case Currency.GBP:
      return "£";
    default:
      return "";
  }
}

export function convertToLargeUnit(value: number): string {
  const largeUnitValue = value / 100;
  return largeUnitValue.toFixed(2);
}

export type User = {
  id: string;
};
