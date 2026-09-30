// Swaps a failed product image for the site mark, once. Shared so every place
// that shows a product photo degrades the same way instead of rendering the
// browser's broken-image icon.
export const FALLBACK_IMAGE = '/assets/site-icon.svg';

export function onImageError(e) {
  const img = e.currentTarget;
  if (img.dataset.fellBack) return;
  img.dataset.fellBack = '1';
  img.src = FALLBACK_IMAGE;
}
