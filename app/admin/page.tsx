"use client";
const staticCategories = [
  { id: 1, name: "Birthdays" },
  { id: 2, name: "Anniversary" },
  { id: 3, name: "Wedding" },
];

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  Stock: boolean;
  category_id: number | null;
  description?: string; // 👈 add this
};

type ProductForm = {
  name: string;
  price: string;
  image_url: string;
  Stock: boolean;
  category_id: number | ""; // 👈 add this
};

type Category = {
  id: number;
  name: string;
};

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ChangeEvent } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [outStock, setOutStock] = useState(0);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState<Category[]>(staticCategories); // Use staticCategories initially

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    image_url: "",
    Stock: true,
    category_id: "", // default empty
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories from supabase
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      return;
    }

    if (!data) return;

    setProducts(data as Product[]);
    setTotalProducts(data.length);

    const inStockCount = data.filter(p => p.Stock === true).length;
    const outStockCount = data.filter(p => p.Stock !== true).length;

    setInStock(inStockCount);
    setOutStock(outStockCount);
  }

  async function fetchCategories() {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setCategories(data || []); // Update categories with fetched data from Supabase
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function openAddPopup() {
    setIsEditing(false);
    setEditId(null);
    setForm({
      name: "",
      price: "",
      image_url: "",
      Stock: true,
      category_id: "", // Reset category_id on adding new product
    });
    setShowPopup(true);
  }

  function openEditPopup(product: Product) {
    setIsEditing(true);
    setEditId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      image_url: product.image_url,
      Stock: product.Stock,
      category_id: product.category_id ?? "", // Ensure category_id is set correctly
    });
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
    setIsEditing(false);
    setEditId(null);
    setForm({
      name: "",
      price: "",
      image_url: "",
      Stock: true,
      category_id: "", // Reset category_id
    });
  }

  async function handleDeleteProduct(id: number) {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      fetchProducts();
    }
  }

  async function handleStatusChange(id: number, newStatusBool: boolean) {
    const { error } = await supabase
      .from("products")
      .update({ Stock: newStatusBool })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      fetchProducts();
    }
  }

  async function handleSaveProduct() {
    if (isEditing && editId !== null) {
      const { error } = await supabase
        .from("products")
        .update({
          name: form.name,
          price: Number(form.price),
          image_url: form.image_url,
          Stock: form.Stock,
          category_id: form.category_id, // Update category ID
        })
        .eq("id", editId);
      if (error) {
        alert(error.message);
      } else {
        closePopup();
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([
        {
          name: form.name,
          price: Number(form.price),
          image_url: form.image_url,
          Stock: form.Stock,
          category_id: form.category_id === "" ? null : form.category_id, // Handle category ID
        },
      ]);

      if (error) {
        alert(error.message);
      } else {
        closePopup();
        fetchProducts();
      }
    }
  }

  return (
    <div className="apx-admin-panel">

      <div className="apx-layout">

        {/* SIDEBAR */}
        <aside className="apx-sidebar">

          <div className="apx-logo">
            <div className="apx-icon-box" style={{ background: "#7b00ff", color: "white", padding: "8px", borderRadius: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <strong>Admin Panel</strong>
          </div>

          <nav className="apx-nav">
            <a href="#" className={activeSection === "dashboard" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveSection("dashboard"); }}>
              Dashboard
            </a>

            <a href="#" className={activeSection === "products" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveSection("products"); }}>
              Products
            </a>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="apx-main">
          {activeSection === "products" && (
            <div>
              <div className="apx-header-row">
                <h2>Products</h2>
                <button className="apx-add-btn" onClick={openAddPopup}>
                  + Add Product
                </button>
              </div>

              <div className="apx-search-box">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="products">
                {products
                  .filter((product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => {
                    const categoryName =
                      categories.find((cat) => cat.id === product.category_id)?.name || "None";

                    return (
                      <div key={product.id} className="card">
                        <div className="card-image">
                          <img src={product.image_url} alt={product.name} />
                          <button className="favorite-btn" aria-label="Add to Favorites">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                            </svg>
                          </button>
                        </div>

                        <div className="card-content">
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <span><strong>Category</strong>: {categoryName}</span>
                          <span><strong>Status</strong>: {product.Stock ? "In Stock" : "Out of Stock"}</span>

                          <div className="card-footer">
                            <div className="price">${product.price}</div>
                            <button
                              className="admin-action-btn admin-edit-btn"
                              data-tooltip="Edit Product"
                              aria-label="Edit"
                              onClick={() => openEditPopup(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-action-btn admin-delete-btn"
                              data-tooltip="Delete Product"
                              aria-label="Delete"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* POPUP */}
          {showPopup && (
            <div className="apx-popup-overlay">
              <div className="apx-popup">
                <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>

                <input
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                />

                <input
                  name="image_url"
                  placeholder="Image URL"
                  value={form.image_url}
                  onChange={handleChange}
                />

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  name="Stock"
                  value={form.Stock ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, Stock: e.target.value === "true" })}
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>

                <div className="apx-popup-buttons">
                  <button onClick={closePopup}>Cancel</button>
                  <button onClick={handleSaveProduct}>Save</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}