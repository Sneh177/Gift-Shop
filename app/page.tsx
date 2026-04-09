"use client";
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as Icons from "./icons";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  Stock: boolean;
  category_id: number | null;
  description?: string;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    fetchFeatured();
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) {
      try {
        setFavoriteIds(JSON.parse(storedFavs));
      } catch (e) { }
    }
  }, []);

  async function fetchFeatured() {
    const { data, error } = await supabase.from("products").select("*").limit(4);
    if (!error) {
      setFeaturedProducts(data || []);
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

  return (
    <>
      <section className="gh-hero-section">
        <div className="gh-blob-1"></div>
        <div className="gh-blob-2"></div>

        <div className="gh-hero-container">
          <div className="gh-content">
            <h1 className="gh-headline">
              WE CURATE <br />
              <span className="gh-highlight-row" style={{ color: '#111827' }}>
                UNFORGETTABLE
              </span>
              <br />
              <span className="stroke">MOMENTS</span>
            </h1>

            <div className="gh-social-proof">
              <div className="gh-rating">
                <div className="gh-stars">★★★★★</div>
                <div className="gh-rating-text">
                  4.9 | GOLD VERIFIED
                </div>
              </div>

              <div className="gh-proof-text">
                Our customers love working with us. 40+ curated hampers sent daily.
              </div>
            </div>

            <div style={{ marginTop: "40px" }}>
              <Link href="/products" style={{
                display: "inline-block",
                background: "#111827",
                color: "white",
                padding: "16px 32px",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "18px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                Shop All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "auto" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", marginBottom: "40px" }}>Featured Products</h2>
        {loading ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: "40px 0" }}>Loading...</div>
        ) : (
          <div className="products">
            {featuredProducts.map((product) => (
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
                  <h3 style={{ color: '#1f2937' }}>{product.name}</h3>
                  {product.description && <p style={{ color: '#6b7280' }}>{product.description}</p>}
                  <div className="card-footer">
                    <div className="price" style={{ color: '#111827' }}>${product.price.toFixed(2)}</div>
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




      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div>
            <div className="lp-badge"><Icons.SparkleSVG /> Creative Design Studio</div>
            <h1>
              We design digital experiences that people <span>love</span>
            </h1>
            <p>
              Our award-winning team crafts beautiful, functional designs that drive growth and engagement.
            </p>
            <div className="lp-hero-btns">
              <a href="#contact" className="lp-btn lp-btn-primary">Get Started &rarr;</a>
              <Link href="/products" className="lp-btn lp-btn-outline">Shop Products</Link>
            </div>
          </div>
          <div className="lp-hero-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", height: "100%" }}></div>
        </div>
      </section>

      {/* ===== CLIENTS ===== */}
      <section id="clients" className="lp-clients">
        <div className="lp-clients-inner">
          <div style={{ textAlign: "center" }}>
            <div className="lp-section-label">Trusted by</div>
            <h2 className="lp-section-title">Our Clients</h2>
            <p className="lp-section-sub">We've had the pleasure of working with some amazing companies</p>
          </div>
          <div className="lp-clients-grid">
            {["ACME", "NOVA", "BOLT", "FLUX", "APEX", "ZENO"].map((name) => (
              <div key={name} className="lp-client-logo">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="lp-services">
        <div className="lp-services-inner">
          <div className="lp-section-head">
            <div className="lp-section-label">Services</div>
            <h2 className="lp-section-title">What We Do</h2>
            <p className="lp-section-sub">A comprehensive range of design and development services</p>
          </div>
          <div className="lp-services-grid">
            {[
              { icon: <Icons.PaintSVG />, title: "UI/UX Design", desc: "We create intuitive, engaging user experiences that delight your customers and drive conversions." },
              { icon: <Icons.CodeSVG />, title: "Web Development", desc: "Our developers build fast, responsive, and accessible websites that work across all devices." },
              { icon: <Icons.SparkleSVG />, title: "Brand Identity", desc: "We craft distinctive brand identities that communicate your values and resonate with your audience." },
              { icon: <Icons.DeviceSVG />, title: "Mobile Apps", desc: "We design and develop native and cross-platform mobile applications that users love." },
              { icon: <Icons.ChartSVG />, title: "Digital Marketing", desc: "We help you reach your target audience and grow with data-driven marketing strategies." },
              { icon: <Icons.ChatSVG />, title: "Content Creation", desc: "We produce engaging content that tells your story and connects with your customers." },
            ].map((s) => (
              <div key={s.title} className="lp-service-card">
                <span className="lp-service-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORK / PORTFOLIO ===== */}
      <section id="work" className="lp-work">
        <div className="lp-work-inner">
          <div className="lp-section-head">
            <div className="lp-section-label">Portfolio</div>
            <h2 className="lp-section-title">Our Work</h2>
            <p className="lp-section-sub">A showcase of our recent projects and collaborations</p>
          </div>
          <div className="lp-bento">
            {[
              { emoji: <Icons.BagSVG />, title: "E-commerce Redesign", desc: "A complete overhaul of an online retail platform" },
              { emoji: <Icons.DeviceSVG />, title: "Mobile App Design", desc: "UI/UX for a fitness tracking application" },
              { emoji: <Icons.TagSVG />, title: "Brand Identity", desc: "Complete rebrand for a tech startup" },
              { emoji: <Icons.DesktopSVG />, title: "Web Application", desc: "Dashboard design for a SaaS platform" },
              { emoji: <Icons.MegaphoneSVG />, title: "Marketing Campaign", desc: "Integrated digital campaign for product launch" },
            ].map((item, idx) => (
              <div key={item.title} className="lp-bento-item">
                <div className="lp-bento-bg" style={{ color: idx % 2 === 0 ? '#4f46e5' : '#8b5cf6' }}>
                  {item.emoji}
                </div>
                <div className="lp-bento-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-work-cta">
            <a href="#" className="lp-btn lp-btn-primary">View All Projects →</a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="lp-about">
        <div className="lp-about-inner">
          <div className="lp-about-top">
            <div className="lp-about-text">
              <div className="lp-section-label">About Us</div>
              <h2>Our Story</h2>
              <p>
                Founded in 2015, our design studio has grown from a small team of passionate designers to a
                full-service creative agency. We believe in the power of design to transform businesses and create
                meaningful connections with audiences.
              </p>
              <p>
                Our approach combines strategic thinking, creative excellence, and technical expertise to deliver
                solutions that not only look beautiful but also drive results.
              </p>
              <div className="lp-hero-btns" style={{ marginTop: "24px" }}>
                <a href="#" className="lp-btn lp-btn-outline">Our Process</a>
                <a href="#" className="lp-btn lp-btn-outline">Join Our Team</a>
              </div>
            </div>
            <div className="lp-about-img" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "100%"
            }}></div>
          </div>
          <div className="lp-team">
            <h3>Meet Our Team</h3>
            <div className="lp-team-grid">
              {[
                { name: "Alex Johnson", role: "Creative Director", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                { name: "Sam Taylor", role: "Lead Designer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                { name: "Jordan Smith", role: "Senior Developer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                { name: "Casey Brown", role: "Project Manager", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              ].map((m) => (
                <div key={m.name} className="lp-team-card">
                  <div className="lp-team-avatar" style={{
                    backgroundImage: `url('${m.img}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%"
                  }}></div>
                  <div className="lp-team-info">
                    <h4>{m.name}</h4>
                    <p>{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="lp-testimonials">
        <div className="lp-testimonials-inner">
          <div className="lp-section-head">
            <div className="lp-section-label">Testimonials</div>
            <h2 className="lp-section-title">What Our Clients Say</h2>
            <p className="lp-section-sub">Don't just take our word for it</p>
          </div>
          <div className="lp-testi-grid">
            {[
              { quote: "Working with this team transformed our brand. They understood our vision perfectly and delivered beyond our expectations.", author: "Sarah Johnson", company: "CEO, TechStart", initials: "SJ" },
              { quote: "The attention to detail and creative solutions provided helped us increase our conversion rate by 40%.", author: "Michael Chen", company: "Marketing Director, GrowthCo", initials: "MC" },
              { quote: "Their strategic approach to design not only improved our user experience but also strengthened our brand identity.", author: "Emma Rodriguez", company: "Product Manager, InnovateLabs", initials: "ER" },
              { quote: "From concept to execution, the team demonstrated exceptional skill and professionalism. Highly recommended!", author: "David Kim", company: "Founder, NextWave", initials: "DK" },
            ].map((t) => (
              <div key={t.author} className="lp-testi-card">
                <div className="lp-stars">★★★★★</div>
                <blockquote>"{t.quote}"</blockquote>
                <div className="lp-testi-author">
                  <div className="lp-testi-avatar">{t.initials}</div>
                  <div className="lp-testi-author-info">
                    <strong>{t.author}</strong>
                    <span>{t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="lp-contact">
        <div className="lp-contact-inner">
          <div className="lp-contact-left">
            <div className="lp-section-label">Contact</div>
            <h2>Let's Work Together</h2>
            <p>Ready to start your next project? Get in touch with us to discuss how we can help bring your vision to life.</p>
            <div className="lp-contact-info">
              <div className="lp-contact-row">
                <div className="lp-contact-icon"><Icons.LocationSVG /></div>
                <div>
                  <h4>Our Location</h4>
                  <p>123 Design Street, Creative City, 10001</p>
                </div>
              </div>
              <div className="lp-contact-row">
                <div className="lp-contact-icon"><Icons.MailSVG /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>hello@designstudio.com</p>
                </div>
              </div>
              <div className="lp-contact-row">
                <div className="lp-contact-icon"><Icons.PhoneSVG /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            <div className="lp-socials">
              <a aria-label="Instagram" href="#" className="lp-social-btn"><Icons.InstagramSVG /></a>
              <a aria-label="Twitter" href="#" className="lp-social-btn"><Icons.TwitterSVG /></a>
              <a aria-label="LinkedIn" href="#" className="lp-social-btn"><Icons.LinkedInSVG /></a>
              <a aria-label="Github" href="#" className="lp-social-btn"><Icons.GithubSVG /></a>
            </div>
          </div>
          <div className="lp-contact-right">
            <h3>Send Us a Message</h3>
            <p>Fill out the form below and we'll get back to you shortly.</p>
            <div className="lp-form">
              <div className="lp-form-row">
                <div className="lp-field">
                  <label htmlFor="lp-first">First name</label>
                  <input id="lp-first" type="text" placeholder="Enter your first name" />
                </div>
                <div className="lp-field">
                  <label htmlFor="lp-last">Last name</label>
                  <input id="lp-last" type="text" placeholder="Enter your last name" />
                </div>
              </div>
              <div className="lp-field">
                <label htmlFor="lp-email">Email</label>
                <input id="lp-email" type="email" placeholder="Enter your email" />
              </div>
              <div className="lp-field">
                <label htmlFor="lp-msg">Message</label>
                <textarea id="lp-msg" placeholder="Enter your message"></textarea>
              </div>
              <button type="button" className="lp-submit">Send Message</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <a href="/" className="lp-footer-logo">
              <div className="lp-footer-logo-icon"><Icons.SparkleSVG /></div>
              <span>Studio</span>
            </a>
            <p>We create beautiful, functional designs that help businesses grow and connect with their audience.</p>
            <div className="lp-footer-socials">
              <a aria-label="Instagram" href="#" className="lp-footer-social"><Icons.InstagramSVG /></a>
              <a aria-label="Twitter" href="#" className="lp-footer-social"><Icons.TwitterSVG /></a>
              <a aria-label="LinkedIn" href="#" className="lp-footer-social"><Icons.LinkedInSVG /></a>
              <a aria-label="Github" href="#" className="lp-footer-social"><Icons.GithubSVG /></a>
            </div>
          </div>
          <div className="lp-footer-col">
            <h4>Company</h4>
            <nav>
              <a href="#about">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Our Process</a>
              <a href="#">News & Press</a>
            </nav>
          </div>
          <div className="lp-footer-col">
            <h4>Services</h4>
            <nav>
              <a href="#">UI/UX Design</a>
              <a href="#">Web Development</a>
              <a href="#">Brand Identity</a>
              <a href="#">Digital Marketing</a>
            </nav>
          </div>
          <div className="lp-footer-newsletter">
            <h4>Newsletter</h4>
            <p>Stay updated with our latest projects, design tips, and company news.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <div className="lp-footer-bottom-inner">
            <p>© {new Date().getFullYear()} Design Studio. All rights reserved.</p>
            <p>Crafted with passion</p>
          </div>
        </div>
      </footer>

    </>
  );
}