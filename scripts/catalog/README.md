# Spares-by-bike catalog pipeline

Builds the brand → model → spare-parts data that powers `/brands` on the frontend.
Source: the live eauto.co.in storefront (Shopify JSON endpoints + the brand landing pages).

Run from the repo root, in order:

```bash
python scripts/catalog/scrape_models.py       # brand pages  -> brand_models.json
python scripts/catalog/scrape_parts.py        # collections  -> eauto_catalog.json
python scripts/catalog/build_site_data.py     # -> frontend/src/data/eauto/* + model photos
python scripts/catalog/add_ev_brands.py       # folds in the electric brands
```

The first two write their intermediate JSON into the current working directory, so run
them from the same folder each time.

`add_ev_brands.py` is independent of the scrape: OLA, ATHER, VIDA and IQUBE are not sold
on the scraped source, so their models and parts are derived from the curated catalog in
`frontend/src/lib/catalogData.js`. Re-run it on its own after editing those brands there.
It is idempotent and never touches the scraped brands.

## What gets written

| Path | Contents |
| --- | --- |
| `frontend/src/data/eauto/index.json` | Brands + model metadata (names, slugs, photos, counts) |
| `frontend/src/data/eauto/models/<brand>__<model>.json` | Every part for one model, plus its category facets |
| `frontend/src/data/eauto/part-index.json` | `partId -> chunk` map, used by `/product/ea-*` |
| `frontend/public/assets/models/<brand>__<model>.jpg` | Model card photos (self-hosted) |

## Images

Model and brand photos are downloaded locally. Part photos are referenced from the
source CDN by default to keep the repo small (~5,000 files / ~95 MB otherwise).

To self-host the part photos as well:

```bash
python scripts/catalog/localize_part_images.py
```

That downloads them into `frontend/public/assets/parts-catalog/` and rewrites the model
chunks to point at the local copies. It is idempotent and leaves the JSON untouched if
any download fails.
