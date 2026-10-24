import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import credits from '../../data/imageCredits.json';
import { getT } from '../../lib/i18n-server';

export const metadata = {
  title: 'Image credits | MotoMart India',
  description: 'Photographers and licences of the part-type photos used on MotoMart.'
};

/**
 * The part-type photos come from Wikimedia Commons under free licences; the
 * BY licences ask for the author, licence and source to be credited and for
 * changes to be noted.
 */
export default function ImageCreditsPage() {
  const { t } = getT();
  return (
    <div>
      <SiteHeader />
      <main id="main" className="page-shell credits-page">
        <h1>{t('Image credits')}</h1>
        <p>
          {t(
            'Part-type photos on this site come from Wikimedia Commons under the licences below. Each was cropped and resized. Illustrations are MotoMart’s own.'
          )}
        </p>
        <ul className="credits-list">
          {credits.map((c) => (
            <li key={c.key}>
              <img src={c.image} alt="" loading="lazy" />
              <div>
                <a href={c.page} target="_blank" rel="noopener noreferrer">
                  {c.title}
                </a>
                <span>
                  {t('by')} {c.author} ·{' '}
                  {c.licenseUrl ? (
                    <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer license">
                      {c.license}
                    </a>
                  ) : (
                    c.license
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
