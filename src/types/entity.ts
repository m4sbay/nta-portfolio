export interface Entity {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  website: string;
  logo: string;
  /** Local landing-page screenshot, never the institution logo. */
  preview?: `/${string}`;
}
