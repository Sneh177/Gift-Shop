
"use client";

import { useState } from "react";
import Link from "next/link";
import "../app/globals.css";
export default function Header() {

  const [isOpen, setIsOpen] = useState(false);

  function togglePanel() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <header className="afg-header">
        <nav className="afg-navbar">

          <Link href="/" style={{ display: 'flex', gap: '12px', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div className="afg-brand-icon">⚡</div>
            <div className="afg-brand-title">E-Jump</div>
          </Link>

          <ul className="afg-nav-list">
            <li className="afg-nav-item">
              <Link href="/" className="afg-nav-link">Home</Link>
            </li>

            <li className="afg-nav-item">
              <Link href="/admin" className="afg-nav-link">Admin</Link>
            </li>

            <li className="afg-nav-item">
              <a href="#" className="afg-nav-link">Store</a>
              <div className="afg-dropdown">
                <a href="#">New Arrivals</a>
                <a href="#">Best Sellers</a>
                <a href="#">Accessories</a>
              </div>
            </li>

            <li className="afg-nav-item">
              <a href="#" className="afg-nav-link">About us</a>
            </li>

            <li className="afg-nav-item">
              <a href="#" className="afg-nav-link">Blog</a>
            </li>
          </ul>

          <div className="afg-right">
            <button className="afg-icon-btn">♡</button>
            <button className="afg-icon-btn">👜</button>
            <button className="afg-cta-btn">Contact us</button>
            <span className="afg-hamburger" onClick={togglePanel}>☰</span>
          </div>

        </nav>
      </header>

      <div className={`afg-mobile-panel ${isOpen ? "active" : ""}`}>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
        <a href="#">Store</a>
        <a href="#">About us</a>
        <a href="#">Blog</a>
        <button className="afg-cta-btn">Contact us</button>
      </div>
    </>
  );
}

