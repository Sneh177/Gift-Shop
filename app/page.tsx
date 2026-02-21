"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  Stock: boolean;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

const { data, error } = await supabase
  .from("products")
  .select("*");

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setProducts(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading products...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">
          Error: {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Arty4Gems Products
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-lg font-semibold mt-3">
                {product.name}
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                {product.description}
              </p>

              <p className="font-bold mt-2">
                ₹{product.price}
              </p>

              <p
                className={`mt-1 text-sm ${
                  product.Stock ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.Stock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}