"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../app/globals.css";

export default function Header() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const fetchFavs = () => {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        try {
          const arr = JSON.parse(stored);
          setFavCount(arr.length);
        } catch (e) {}
      } else {
        setFavCount(0);
      }
    };
    
    fetchFavs();

    // Custom event broadcasted locally + storage event broadcasted by other tabs
    window.addEventListener("favoritesUpdated", fetchFavs);
    window.addEventListener("storage", fetchFavs);

    return () => {
      window.removeEventListener("favoritesUpdated", fetchFavs);
      window.removeEventListener("storage", fetchFavs);
    };
  }, []);

  return (
    <header className="header">
      <nav className="nav">

        {/* Logo */}
        <Link href="/" className="logo">
          <span className="material-symbols-outlined">hub</span>
          <span>E-Jump</span>
        </Link>

        {/* Search */}
        <div className="search-wrapper">
          <div className="search-box">
            <input type="text" placeholder="Search products..." />
            <button className="search-btn">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="actions">
          <Link href="/favorites" className="icon-btn icon-btn-relative" style={{ textDecoration: 'none' }}>
            <span className="material-symbols-outlined fill-icon favorite">
              favorite
            </span>
            {favCount > 0 && (
              <span className="fav-badge">{favCount}</span>
            )}
          </Link>

          <button className="icon-btn">
            <span className="material-symbols-outlined fill-icon bag">
              shopping_bag
            </span>
          </button>

          <div className="profile">
            <span>User</span>
            <img
              src="https://i.pravatar.cc/100"
              alt="User Avatar"
            />
          </div>
        </div>

      </nav>
    </header>
  );
}