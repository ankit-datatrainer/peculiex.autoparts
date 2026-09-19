import React from 'react';
import SiteHeader from '../components/SiteHeader';
import HeroSlider from '../components/HeroSlider';
import GarageFinder from '../components/GarageFinder';
import CategoryGrid from '../components/CategoryGrid';
import DealSection from '../components/DealSection';
import ProductCard from '../components/ProductCard';
import BrandPromo from '../components/BrandPromo';
import MaintenanceGrid from '../components/MaintenanceGrid';
import TrustStrip from '../components/TrustStrip';
import Footer from '../components/Footer';
import { fetchProducts, fetchCategories, fetchGarageModels } from '../lib/api';
import HomeClientSections from './HomeClientSections';
import BrandRail from '../components/BrandRail';
import { getBrands } from '../lib/eautoCatalog';

export const revalidate = 0;

export default async function HomePage() {
  const [products, categories, garageModels] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchGarageModels()
  ]);

  return (
    <div id="homeView">
      <SiteHeader />

      <main id="main">
        <HeroSlider />
        <GarageFinder garageModels={garageModels} />
        <BrandRail brands={getBrands()} />
        <CategoryGrid categories={categories} />
        <DealSection products={products} />

        <HomeClientSections products={products} />

        <BrandPromo />
        <MaintenanceGrid />

        {/* More for your ride section */}
        <section className="section more-products-section" id="moreProducts">
          <div className="page-shell">
            <div className="section-title more-products-title">
              <div>
                <span className="eyebrow dark">MORE FOR YOUR RIDE</span>
                <h2>Built to go the distance</h2>
                <p>Hand-picked essentials for everyday commutes, weekend rides and workshop care.</p>
              </div>
              <a href="#products">
                Explore all products <span>↗</span>
              </a>
            </div>
            <div className="more-products-grid" id="moreProductsGrid">
              {products.slice(-8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        <TrustStrip />

        {/* Sign in Banner */}
        <section className="signin-banner">
          <h2>See personalised picks for your ride</h2>
          <button type="button" id="signInButton">
            Sign in securely
          </button>
          <small>
            New to MotoMart?{' '}
            <button type="button" id="registerButton">
              Create an account
            </button>
          </small>
        </section>
      </main>

      <Footer />
    </div>
  );
}
