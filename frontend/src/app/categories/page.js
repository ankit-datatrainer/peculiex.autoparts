import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { getCategoryGroups } from '../../lib/categoryGroups';
import { getT } from '../../lib/i18n-server';

export const revalidate = 0;

export async function generateMetadata() {
  const { t } = getT();
  return {
    title: `${t('Shop spare parts by category')} | MotoMart India`,
    description: t(
      'Browse two-wheeler spare parts by category — handle and steering, front wheel, lights, fuel supply, bearings, pipes and more.'
    )
  };
}

export default async function CategoriesPage() {
  const { t, tCat, local } = getT();
  const groups = await getCategoryGroups();
  const totalParts = groups.reduce((n, g) => n + g.partsCount, 0);

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell catalog-page">
          <nav className="catalog-crumbs" aria-label={t('Breadcrumb')}>
            <Link href="/">{t('Home')}</Link>
            <span aria-hidden="true">›</span>
            <strong>{t('Categories')}</strong>
          </nav>

          <header className="catalog-head">
            <span className="eyebrow dark">{t('SPARES BY CATEGORY')}</span>
            <h1>{t('Shop spare parts by category')}</h1>
            <p>
              {local(
                `${groups.length} categories · ${totalParts.toLocaleString('en-IN')} parts across every brand. Pick the part you need, then narrow it to your bike.`,
                `${groups.length} श्रेणियाँ · हर ब्रांड के ${totalParts.toLocaleString('en-IN')} पार्ट्स। ज़रूरी पार्ट चुनें, फिर अपनी बाइक तक सीमित करें।`,
                `${groups.length} श्रेणी · प्रत्येक ब्रँडचे ${totalParts.toLocaleString('en-IN')} पार्ट्स. हवा असलेला पार्ट निवडा, नंतर तुमच्या बाइकपुरता मर्यादित करा.`,
                `${groups.length} શ્રેણીઓ · દરેક બ્રાન્ડના ${totalParts.toLocaleString('en-IN')} પાર્ટ્સ. જરૂરી પાર્ટ પસંદ કરો, પછી તમારી બાઇક સુધી સીમિત કરો.`
              )}
            </p>
          </header>

          {groups.length === 0 ? (
            <p className="admin-empty">{t('No categories yet.')}</p>
          ) : (
            <div className="brand-grid">
              {groups.map((g) => (
                <Link key={g.id} href={`/categories/${g.id}`} className="brand-card">
                  <span className="brand-card-media">
                    <img src={g.image || '/assets/site-icon.svg'} alt={tCat(g.name)} loading="lazy" />
                  </span>
                  <span className="brand-card-body">
                    <strong>{tCat(g.name)}</strong>
                    <small>{t(g.description)}</small>
                    <em>
                      {local(
                        `${g.partsCount.toLocaleString('en-IN')} part${g.partsCount === 1 ? '' : 's'} · ${g.categories.length} type${g.categories.length === 1 ? '' : 's'}`,
                        `${g.partsCount.toLocaleString('en-IN')} पार्ट्स · ${g.categories.length} प्रकार`,
                        `${g.partsCount.toLocaleString('en-IN')} पार्ट्स · ${g.categories.length} प्रकार`,
                        `${g.partsCount.toLocaleString('en-IN')} પાર્ટ્સ · ${g.categories.length} પ્રકાર`
                      )}
                    </em>
                  </span>
                  <span className="brand-card-go" aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
