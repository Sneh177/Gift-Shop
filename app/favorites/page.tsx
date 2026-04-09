"use client";
import "../globals.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  Stock: boolean;
  category_id: number | null;
  description?: string;
};

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const storedFavs = localStorage.getItem("favorites");
      if (storedFavs) {
        try {
          const parsedFavs = JSON.parse(storedFavs);
          setFavoriteIds(parsedFavs);

          if (parsedFavs.length > 0) {
            const { data, error } = await supabase
              .from("products")
              .select("*")
              .in("id", parsedFavs);

            if (error) {
              console.warn("Failed to fetch favorite products:", error);
            } else {
              setProducts(data || []);
            }
          }
        } catch (e) {}
      }
      setLoading(false);
    };

    fetchFavoriteProducts();
  }, []);

  const toggleFavorite = async (productId: number) => {
    const updatedFavs = favoriteIds.filter(id => id !== productId);
    setFavoriteIds(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event("favoritesUpdated"));
    
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));

    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'remove' }),
      });
    } catch (err) {
      console.warn("Failed to sync favorite API:", err);
    }
  };

  return (
    <section style={{ padding: "120px 24px", maxWidth: "1200px", margin: "auto", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#111827" }}>
          Your Favorites <span style={{ fontSize: "1rem", color: "#6b7280", fontWeight: "600", marginLeft: "10px" }}>({products.length} Items)</span>
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#aaa", padding: "40px 0" }}>Loading your favorites...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", color: "#aaa", padding: "40px 0", fontSize: "1.2rem" }}>
          You have no favorite products yet.
        </div>
      ) : (
        <div className="products">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="card-image">
                <div className="badge">
                  {product.Stock ? "In Stock" : "Sold Out"}
                </div>
                <img src={product.image_url} alt={product.name} />
                <button 
                  className={`favorite-btn active`}
                  aria-label="Remove from Favorites"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                  </svg>
                </button>
              </div>
              <div className="card-content">
                <h3>{product.name}</h3>
                {product.description && <p>{product.description}</p>}
                <div className="card-footer">
                  <div className="price">${product.price.toFixed(2)}</div>
                  <button 
                    className="add-to-cart-btn" 
                    data-tooltip="Add to Cart" 
                    aria-label="Add to Cart"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
