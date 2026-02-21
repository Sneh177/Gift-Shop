

"use client";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  Stock: boolean;
};

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {

const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [outStock, setOutStock] = useState(0);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    image_url: "",
    Stock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  if (!data) return;

  const typedData = data as Product[];

  setProducts(typedData);
  setTotalProducts(typedData.length);

  const inStockCount = typedData.filter(p => p.Stock === true).length;
  const outStockCount = typedData.filter(p => p.Stock !== true).length;

  setInStock(inStockCount);
  setOutStock(outStockCount);
}

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function openAddPopup() {
    setIsEditing(false);
    setEditId(null);
    setForm({
      name: "",
      price: "",
      image_url: "",
      Stock: true
    });
    setShowPopup(true);
  }

  function openEditPopup(product) {
    setIsEditing(true);
    setEditId(product.id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      image_url: product.image_url || "",
      Stock: product.Stock !== undefined ? product.Stock : true
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
      Stock: true
    });
  }

  async function handleDeleteProduct(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      fetchProducts();
    }
  }

  async function handleStatusChange(id, newStatusBool) {
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
    if (isEditing) {
      const { error } = await supabase.from("products").update({
        name: form.name,
        price: form.price,
        image_url: form.image_url,
        Stock: form.Stock
      }).eq("id", editId);

      if (error) {
        alert(error.message);
      } else {
        closePopup();
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([{
        name: form.name,
        price: form.price,
        image_url: form.image_url,
        Stock: form.Stock
      }]);

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

            <a
              href="#"
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("dashboard");
              }}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </a>

            <a
              href="#"
              className={activeSection === "products" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("products");
              }}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Products
            </a>

          </nav>

        </aside>

        {/* MAIN */}
        <main className="apx-main">

          {/* DASHBOARD */}
          {activeSection === "dashboard" && (

            <div>

              <h1>Dashboard</h1>

              <div className="apx-grid">

                <div className="apx-card">
                  <div className="apx-icon-box" style={{ background: "rgba(123, 0, 255, 0.1)", color: "#7b00ff" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                  <div className="apx-label">Total Products</div>
                  <div className="apx-value">{totalProducts}</div>
                </div>

                <div className="apx-card">
                  <div className="apx-icon-box" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l5 5L20 7"></path>
                    </svg>
                  </div>
                  <div className="apx-label">In Stock</div>
                  <div className="apx-value">{inStock}</div>
                </div>

                <div className="apx-card">
                  <div className="apx-icon-box" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="5" x2="19" y2="19"></line>
                      <line x1="19" y1="5" x2="5" y2="19"></line>
                    </svg>
                  </div>
                  <div className="apx-label">Out Of Stock</div>
                  <div className="apx-value">{outStock}</div>
                </div>

              </div>

            </div>

          )}

          {/* PRODUCTS */}
          {activeSection === "products" && (

            <div>

              <div className="apx-header-row">
                <h2>Products</h2>

                <button
                  className="apx-add-btn"
                  onClick={openAddPopup}
                >
                  + Add Product
                </button>
              </div>

              <div className="apx-search-box">
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

                  <input
                    type="text"
                    placeholder="Search products by name..."
                    style={{ paddingLeft: "40px" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="apx-table-wrapper">

                <table className="apx-table">

                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {products
                      .filter(product =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((product) => (

                        <tr key={product.id}>

                          <td>
                            <img
                              src={product.image_url}
                              className="apx-product-img"
                              alt="product"
                            />
                          </td>

                          <td>{product.name}</td>

                          <td>₹{product.price}</td>

                          <td>
                            {product.Stock ? (
                              <span className="apx-status apx-in">In Stock</span>
                            ) : (
                              <span className="apx-status apx-out">Out of Stock</span>
                            )}
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <div className="apx-actions" style={{ justifyContent: "flex-end" }}>
                              <button
                                className="apx-icon-btn apx-edit-btn"
                                title="Edit"
                                onClick={() => openEditPopup(product)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"></path>
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                              </button>
                              <button
                                className="apx-icon-btn apx-delete-btn"
                                title="Delete"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

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
                      name="Stock"
                      value={form.Stock ? "true" : "false"}
                      onChange={(e) => setForm({ ...form, Stock: e.target.value === "true" })}
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>

                    <div className="apx-popup-buttons">

                      <button className="apx-popup-btn-cancel" onClick={closePopup}>
                        Cancel
                      </button>

                      <button className="apx-popup-btn-save" onClick={handleSaveProduct}>
                        Save
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}

        </main>

      </div>

    </div>
  );
} 