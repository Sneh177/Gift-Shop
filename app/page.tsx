"use client";
import "./globals.css";
export default function Home() {
  return (
    <section className="gh-hero-section">
      <div className="gh-blob-1"></div>
      <div className="gh-blob-2"></div>

      <div className="gh-hero-container">
        <div className="gh-content">
          <h1 className="gh-headline">
            WE CURATE <br />
            <span className="gh-highlight-row">
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
        </div>
      </div>
    </section>
  );
}