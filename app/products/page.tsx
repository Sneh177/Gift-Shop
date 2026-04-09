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

type Category = {
  id: number;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(500);

  useEffect(() => {
    fetchData();
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) {
      try {
        setFavoriteIds(JSON.parse(storedFavs));
      } catch (e) {}
    }
  }, []);

  // Debouncing effect for Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  async function fetchData() {
    // Parallel fetching for performance
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("categories").select("*")
    ]);

    if (!productsRes.error) {
      setProducts(productsRes.data || []);
      // Calculate realistic max price bounds from existing products
      if (productsRes.data && productsRes.data.length > 0) {
        const highestPrice = Math.max(...productsRes.data.map(p => p.price));
        setMaxPrice(Math.ceil(highestPrice));
      }
    } else {
      console.warn("Failed to fetch products:", productsRes.error);
    }

    if (!categoriesRes.error) {
      setCategories(categoriesRes.data || []);
    } else {
      console.warn("Failed to fetch categories:", categoriesRes.error);
    }

    setLoading(false);
  }

  const toggleFavorite = async (productId: number) => {
    let updatedFavs;
    let action;
    if (favoriteIds.includes(productId)) {
      updatedFavs = favoriteIds.filter(id => id !== productId);
      action = "remove";
    } else {
      updatedFavs = [...favoriteIds, productId];
      action = "add";
    }
    
    setFavoriteIds(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event("favoritesUpdated"));

    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action }),
      });
    } catch (err) {
      console.warn("Failed to sync favorite API:", err);
    }
  };

  // Compute final filtered products to render
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.category_id === selectedCategoryId : true;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div style={{ padding: "80px 24px", maxWidth: "1200px", margin: "auto", minHeight: "80vh" }}>
      
      {/* Filtering Options UX */}
      <div style={{ marginBottom: "50px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#111827" }}>All Products</h2>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", background: "#f9fafb", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          {/* Search Input */}
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #d1d5db", minWidth: "250px", outline: "none" }}
          />

          {/* Category Chips */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCategoryId(null)}
              style={{
                padding: "8px 16px", borderRadius: "20px", border: "1px solid #d1d5db", cursor: "pointer",
                background: selectedCategoryId === null ? "#111827" : "#fff",
                color: selectedCategoryId === null ? "#fff" : "#111827",
                transition: "all 0.2s"
              }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                style={{
                  padding: "8px 16px", borderRadius: "20px", border: "1px solid #d1d5db", cursor: "pointer",
                  background: selectedCategoryId === cat.id ? "#111827" : "#fff",
                  color: selectedCategoryId === cat.id ? "#fff" : "#111827",
                  transition: "all 0.2s"
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price Filter Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "auto" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#4b5563" }}>Max Price: ${maxPrice}</span>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: "#111827" }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#aaa", padding: "40px 0" }}>Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", color: "#aaa", padding: "40px 0", fontSize: "1.2rem" }}>No products match your filters.</div>
      ) : (
        <div className="products">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card">
              <div className="card-image">
                <div className="badge">
                  {product.Stock ? "In Stock" : "Sold Out"}
                </div>
                <img src={product.image_url} alt={product.name} />
                <button 
                  className={`favorite-btn ${favoriteIds.includes(product.id) ? 'active' : ''}`}
                  aria-label="Toggle Favorite"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                  </svg>
                </button>
              </div>
              <div className="card-content">
                <h3 style={{color: '#1f2937'}}>{product.name}</h3>
                {product.description && <p style={{color: '#6b7280'}}>{product.description}</p>}
                <div className="card-footer">
                  <div className="price" style={{color: '#111827'}}>${product.price.toFixed(2)}</div>
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
    </div>
  );
}
