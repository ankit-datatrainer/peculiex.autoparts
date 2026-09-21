import React from 'react';
import { getT } from '../../lib/i18n-server';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { fetchProducts } from '../../lib/api';
import { companyBrands, bikePartTypes } from '../../lib/catalogData';

export const revalidate = 0;

export async function generateMetadata({ searchParams }) {
  const { brand, partType, q, category } = searchParams;
  let title = 'Catalog | MotoMart India';
  if (brand && partType) {
    title = `${brand} Genuine ${partType} Parts | MotoMart India`;
  } else if (brand) {
    title = `${brand} Genuine Parts & Spares | MotoMart India`;
  } else if (partType) {
    title = `Genuine ${partType} Parts for Bikes & Scooters | MotoMart India`;
  } else if (q) {
    title = `Search: ${q} | MotoMart India`;
  }
  return {
    title,
    description: `Shop authentic OEM two-wheeler spare parts with guaranteed factory fitment.`
  };
}

export default async function SearchPage({ searchParams }) {
  const { q = '', category = 'all', brand = '', partType = '', vehicleType = '' } = searchParams;

  const { t, tCat, local } = getT();

  const currentBrandObj = companyBrands.find(
    (b) => b.name.toLowerCase() === brand.toLowerCase() || b.id.toLowerCase() === brand.toLowerCase()
  );

  const [products, allProducts] = await Promise.all([
    fetchProducts({
      search: q === 'all' ? '' : q,
      category: category === 'all' ? '' : category,
      brand,
      partType,
      vehicleType
    }),
    fetchProducts()
  ]);

  const displayTitle = brand
    ? `${currentBrandObj ? currentBrandObj.fullName : brand + ' Genuine Parts'}`
    : partType
    ? `Genuine ${partType} Parts & Assemblies`
    : q && q !== 'all'
    ? `Results for “${q}”`
    : 'All Genuine Two-Wheeler Parts';

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="search-view page-shell">
          {/* Brand Official Banner */}
          {currentBrandObj && (
            <div className="brand-hero-banner" style={{
              background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem 2rem',
              marginBottom: '2rem',
              border: '1px solid #3F3F46',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem'
            }}>
              <div style={{ maxWidth: '680px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: '#DC2626',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: '900',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    letterSpacing: '0.5px'
                  }}>
                    {currentBrandObj.code} • {t('OFFICIAL OEM')}
                  </span>
                  <span style={{ color: '#A1A1AA', fontSize: '13px' }}>
                    {t('100% Genuine Guaranteed')}
                  </span>
                </div>

                <h1 style={{ fontSize: '1.85rem', fontWeight: '900', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>
                  {currentBrandObj.fullName}
                </h1>

                <p style={{ color: '#D4D4D8', fontSize: '14px', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  {(() => {
                    const s = currentBrandObj.models.scooters;
                    const b = currentBrandObj.models.bikes;
                    const list =
                      s.length > 0 && b.length > 0
                        ? `${s.slice(0, 3).join(', ')}, ${b.slice(0, 3).join(', ')}`
                        : s.length > 0
                          ? s.join(', ')
                          : b.join(', ');
                    return local(
                      `Official factory spares for ${list}.`,
                      `${list} के लिए आधिकारिक फ़ैक्ट्री स्पेयर।`,
                      `${list} साठी अधिकृत फॅक्टरी स्पेअर.`,
                      `${list} માટે અધિકૃત ફેક્ટરી સ્પેર.`
                    );
                  })()}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <a
                    href={currentBrandObj.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#FFFFFF',
                      color: '#000000',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {t('Verified Manufacturer Portal')} ↗
                  </a>
                  <span style={{ fontSize: '12px', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ✓ {t('Direct Fitment Warranty')}
                  </span>
                  <span style={{ fontSize: '12px', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ⚡ {t('Next-Day Dispatch')}
                  </span>
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '1px solid #E4E4E7',
                textAlign: 'center',
                minWidth: '160px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={currentBrandObj.image}
                  alt={`${currentBrandObj.name} ${t('official logo')}`}
                  style={{ maxHeight: '48px', maxWidth: '140px', objectFit: 'contain', margin: '0 auto 8px auto', display: 'block' }}
                />
                <span style={{ fontSize: '12px', color: '#0F172A', fontWeight: '800' }}>
                  {local(
                    `${products.length} Parts Available`,
                    `${products.length} पार्ट्स उपलब्ध`,
                    `${products.length} पार्ट्स उपलब्ध`,
                    `${products.length} પાર્ટ્સ ઉપલબ્ધ`
                  )}
                </span>
              </div>
            </div>
          )}

          {/* 10 Bike Parts Filter Strip */}
          <div style={{
            background: '#F4F4F5',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid #E4E4E7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px', color: '#52525B' }}>
                {t('FILTER BY BIKE PART')}:
              </span>
              {(partType || brand) && (
                <Link
                  href={brand ? `/search?brand=${encodeURIComponent(brand)}` : '/search'}
                  style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', textDecoration: 'underline' }}
                >
                  {t('Clear part filter')}
                </Link>
              )}
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <Link
                href={brand ? `/search?brand=${encodeURIComponent(brand)}` : '/search'}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: !partType ? '800' : '500',
                  background: !partType ? '#18181B' : '#FFFFFF',
                  color: !partType ? '#FFFFFF' : '#27272A',
                  border: !partType ? '1px solid #18181B' : '1px solid #D4D4D8',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {t('All Parts')} ({products.length})
              </Link>

              {bikePartTypes.map((pt) => {
                const isActive = partType.toLowerCase() === pt.toLowerCase();
                const targetUrl = brand
                  ? `/search?brand=${encodeURIComponent(brand)}&partType=${encodeURIComponent(pt)}`
                  : `/search?partType=${encodeURIComponent(pt)}`;

                return (
                  <Link
                    key={pt}
                    href={targetUrl}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: isActive ? '800' : '600',
                      background: isActive ? '#DC2626' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#27272A',
                      border: isActive ? '1px solid #DC2626' : '1px solid #D4D4D8',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tCat(pt)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Header Info */}
          <div className="search-head" style={{ marginBottom: '1.5rem' }}>
            <div>
              <span className="eyebrow dark">
                {brand
                  ? `${brand} ${t('OFFICIAL CATALOG')}`
                  : partType
                    ? `${tCat(partType).toUpperCase()} ${t('SPARES')}`
                    : t('CATALOG SEARCH')}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '4px 0' }}>
                {local(
                  `${products.length} genuine part${products.length === 1 ? '' : 's'} available`,
                  `${products.length} असली पार्ट्स उपलब्ध`,
                  `${products.length} अस्सल पार्ट्स उपलब्ध`,
                  `${products.length} અસલી પાર્ટ્સ ઉપલબ્ધ`
                )}
              </h2>
              <p style={{ color: '#71717A', margin: 0 }}>
                {brand && partType
                  ? local(
                      `Displaying ${brand} OEM ${partType} components with certified factory fitment.`,
                      `प्रमाणित फ़ैक्ट्री फ़िटमेंट के साथ ${brand} OEM ${tCat(partType)} दिखाए जा रहे हैं।`,
                      `प्रमाणित फॅक्टरी फिटमेंटसह ${brand} OEM ${tCat(partType)} दाखवले जात आहेत.`,
                      `પ્રમાણિત ફેક્ટરી ફિટમેન્ટ સાથે ${brand} OEM ${tCat(partType)} બતાવવામાં આવે છે.`
                    )
                  : brand
                    ? local(
                        `Displaying genuine factory spares for ${brand} motorcycles and scooters.`,
                        `${brand} मोटरसाइकिल और स्कूटर के असली फ़ैक्ट्री स्पेयर दिखाए जा रहे हैं।`,
                        `${brand} मोटरसायकल आणि स्कूटरचे अस्सल फॅक्टरी स्पेअर दाखवले जात आहेत.`,
                        `${brand} મોટરસાયકલ અને સ્કૂટરના અસલી ફેક્ટરી સ્પેર બતાવવામાં આવે છે.`
                      )
                    : partType
                      ? local(
                          `Displaying genuine ${partType} components across all major manufacturers.`,
                          `सभी प्रमुख निर्माताओं के असली ${tCat(partType)} दिखाए जा रहे हैं।`,
                          `सर्व प्रमुख उत्पादकांचे अस्सल ${tCat(partType)} दाखवले जात आहेत.`,
                          `બધા મુખ્ય ઉત્પાદકોના અસલી ${tCat(partType)} બતાવવામાં આવે છે.`
                        )
                      : t('All prices include applicable GST. Guaranteed genuine or 100% money back.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link className="outline-cta" href="/">
                ← {t('Back to home')}
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="search-results">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="search-empty" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <span style={{ fontSize: '3rem' }}>🔧</span>
              <h2>{t('No parts found matching your selection')}</h2>
              <p style={{ color: '#71717A', maxWidth: '480px', margin: '0.5rem auto 1.5rem auto' }}>
                {t(
                  'Try selecting a different part category or clear the brand filter to browse the complete catalog.'
                )}
              </p>
              <Link href="/search" className="primary-cta" style={{ display: 'inline-block' }}>
                {t('Browse all genuine parts')}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
