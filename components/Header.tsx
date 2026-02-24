"use client";

import Link from "next/link";
import "../app/globals.css";

export default function Header() {
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
          <button className="icon-btn">
            <span className="material-symbols-outlined fill-icon favorite">
              favorite
            </span>
          </button>

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