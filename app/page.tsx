"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {

    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error("Error fetching products:", error.message);
      return;
    }

    if (data) {
      setProducts(data);
    }
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-5">
        Arty4Gems Products
      </h1>

      {products.length === 0 ? (

        <p>No products found</p>

      ) : (

        products.map((product) => (

          <div key={product.id} className="mb-5 border p-3">

            <img
              src={product.image_url}
              width="200"
              alt={product.name}
            />

            <h2 className="text-lg font-semibold">
              {product.name}
            </h2>

            <p>
              {product.description}
            </p>

            <p className="font-bold">
              ₹{product.price}
            </p>

          </div>

        ))

      )}

    </div>
  );
}