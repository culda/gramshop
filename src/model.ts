export type Product = {
  id: string;
  name: string;
  price: number; // Price in the smallest units of the currency (e.g., cents for USD)
  image: string;
};

export type AuthData = {
  query_id: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    allows_write_to_pm: boolean;
  };
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
  id: string;
  userId: string;
  botToken?: string;
  products: Product[];
};

export type User = {
  id: string;
};
