/**
 * Homepage section visibility toggles.
 * These are build-time constants — change a flag and rebuild to show/hide a section.
 */
export const homepageConfig = {
  showHero: true,
  showCollections: true,
  showFeatured: true,
  showWhyChooseUs: true,
  showProductSpotlight: true,
  showBundles: true,
  showScentQuiz: true,
  showStory: true,
  showTestimonials: true,
  showNewsletter: true,
} as const;
