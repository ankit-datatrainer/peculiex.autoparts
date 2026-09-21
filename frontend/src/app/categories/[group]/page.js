import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import Footer from '../../../components/Footer';
import PartCard from '../../../components/PartCard';
import { getCategoryGroup, getGroupProducts } from '../../../lib/categoryGroups';
import { getBrands, mapProduct } from '../../../lib/catalog';
import { getT } from '../../../lib/i18n-server';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const group = await getCategoryGroup(params.group);
  const { t, tCat, local } = getT();
  if (!group) return { title: `${t('Category not found')} | MotoMart India` };

  const name = tCat(group.name);
  return {
    title: `${name} — ${t('Bike Parts')} | MotoMart India`,
    description: local(
      `${group.description} ${group.partsCount} parts across every brand.`,
      `${t(group.description)} हर ब्रांड के ${group.partsCount} पार्ट्स।`,
      `${t(group.description)} प्रत्येक ब्रँडचे ${group.partsCount} पार्ट्स.`,
      `${t(group.description)} દરેક બ્રાન્ડના ${group.partsCount} પાર્ટ્સ.`
    )
  };
}

const PAGE_SIZE = 36;

export default async function CategoryGroupPage({ params, searchParams }) {
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const brand = searchParams?.brand || '';
  const category = searchParams?.category || '';

  const [result, brands] = await Promise.all([
    getGroupProducts(params.group, { brand, category, page, pageSize: PAGE_SIZE }),
    getBrands()
  ]);

  if (!result) notFound();

  const { group, rows, total } = result;
  const parts = (rows || []).map(mapProduct);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const linkFor = (next) => ({
    pathname: `/categories/${group.id}`,
    query: { ...(brand && { brand }), ...(category && { category }), ...next }
  });

  const { t, tCat, local } = getT();
  const groupName = tCat(group.name);

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell catalog-page">
          <nav className="catalog-crumbs" aria-label={t('Breadcrumb')}>
            <Link href="/">{t('Home')}</Link>
            <span aria-hidden="true">›</span>
            <Link href="/categories">{t('Categories')}</Link>
            <span aria-hidden="true">›</span>
            <strong>{groupName}</strong>
          </nav>

          <header className="catalog-banner">
            <div>
              <span className="catalog-chip">{t('SPARES BY CATEGORY')}</span>
              <h1>{groupName}</h1>
              <p>{t(group.description)}</p>
              <ul className="catalog-facts">
                <li>
                  {local(
                    `${total.toLocaleString('en-IN')} parts`,
                    `${total.toLocaleString('en-IN')} पार्ट्स`,
                    `${total.toLocaleString('en-IN')} पार्ट्स`,
                    `${total.toLocaleString('en-IN')} પાર્ટ્સ`
                  )}
                </li>
                <li>
                  {local(
                    `${group.categories.length} part types`,
                    `${group.categories.length} पार्ट प्रकार`,
                    `${group.categories.length} पार्ट प्रकार`,
                    `${group.categories.length} પાર્ટ પ્રકાર`
                  )}
                </li>
                <li>{t('Every brand')}</li>
              </ul>
            </div>
            {group.image && (
              <div className="catalog-banner-photo">
                <img src={group.image} alt={groupName} />
                <span>{groupName}</span>
              </div>
            )}
          </header>

          {/* brand filter */}
          <div className="sibling-row">
            <span>{t('Brand')}:</span>
            <Link href={linkFor({ brand: undefined, page: undefined })} className={!brand ? 'sibling-all' : ''}>
              {t('All brands')}
            </Link>
            {brands.slice(0, 10).map((b) => (
              <Link
                key={b.id}
                href={linkFor({ brand: b.id, page: undefined })}
                className={brand === b.id ? 'sibling-all' : ''}
              >
                {b.name}
              </Link>
            ))}
          </div>

          <div className="parts-layout">
            <aside className="parts-filters">
              <h2>{t('Part type')}</h2>
              <ul className="parts-category-list">
                <li>
                  <button type="button" className={!category ? 'active' : ''}>
                    <Link href={linkFor({ category: undefined, page: undefined })}>
                      <span>
                        {local(
                          `All in ${groupName}`,
                          `${groupName} में सभी`,
                          `${groupName} मधील सर्व`,
                          `${groupName} માં બધા`
                        )}
                      </span>
                      <em>{group.partsCount}</em>
                    </Link>
                  </button>
                </li>
                {group.categories.map((c) => (
                  <li key={c.id}>
                    <button type="button" className={category === c.id ? 'active' : ''}>
                      <Link href={linkFor({ category: c.id, page: undefined })}>
                        <span>{tCat(c.name)}</span>
                        <em>{c.count}</em>
                      </Link>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="parts-results">
              <div className="parts-toolbar">
                <span>
                  <strong>{total.toLocaleString('en-IN')}</strong> {t('parts')}
                  {brand && <> · {brands.find((b) => b.id === brand)?.name || brand}</>}
                </span>
              </div>

              {parts.length === 0 ? (
                <div className="parts-empty">
                  <span aria-hidden="true">🔧</span>
                  <h3>{t('No parts here yet')}</h3>
                  <p>{t('Try a different brand or part type.')}</p>
                  <Link href={`/categories/${group.id}`} className="account-cta">
                    {t('Clear filters')}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="parts-grid">
                    {parts.map((p) => (
                      <PartCard key={p.id} part={p} />
                    ))}
                  </div>

                  {pages > 1 && (
                    <nav className="admin-pager" aria-label={t('Pagination')}>
                      {page > 1 && (
                        <Link href={linkFor({ page: page - 1 })}>← {t('Previous')}</Link>
                      )}
                      <span>
                        {local(
                          `Page ${page} of ${pages}`,
                          `पेज ${page} / ${pages}`,
                          `पान ${page} / ${pages}`,
                          `પેજ ${page} / ${pages}`
                        )}
                      </span>
                      {page < pages && <Link href={linkFor({ page: page + 1 })}>{t('Next')} →</Link>}
                    </nav>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
