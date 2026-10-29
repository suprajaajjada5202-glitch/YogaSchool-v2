export type Img = { src: string; alt: string; width: number; height: number };
/** Home hero slide: a photo, or a video (muted, looping) with the photo shown until it plays.
    position: CSS object-position for the crop (default "50% 40%"). */
export type HeroSlide = Img & { video?: string; position?: string };
export type GalleryPhoto = Img & { full: string };

export type Teacher = { slug: string; name: string; role: string; spec: string; photo: Img; bio: string[] };

export type ClassItem = {
  slug: string;
  name: string;
  level: string;
  duration: string | null;
  summary: string;
  description: string[];
  tag: string | null;
  image: Img | null;
};

/** A home page "Our classes" card. classMatch finds its class on /pages/classes by name (null: the page itself). */
export type Modality = { name: string; blurb: string; classMatch: RegExp | null; image: Img };

/** path = the article URL (built-in articles keep their original /blog/YYYY/MM/DD/slug address) */
export type Post = {
  slug: string;
  path?: string;
  title: string;
  author: string;
  excerpt: string;
  body: string[];
  image: Img | null;
  publishedAt?: string;
};

export type Video = { id: string; title: string; duration: string };
export type ShortTestimonial = { quote: string; name: string; role: string };
/** highlight: a line from the story, set large above it (short stories without one are shown whole) */
export type Testimonial = { name: string; role: string; paragraphs: string[]; highlight?: string };
export type TestimonialChapter = { id: string; title: string; intro: string; image: Img; stories: Testimonial[] };
export type FeaturedTestimonial = Testimonial & { highlight: string; benefits: string[]; closing: string[] };

export type Membership = {
  name: string;
  description: string;
  priceLabel: string;
  period: string | null;
  terms: string;
  features: string[];
  badge: string | null;
  featured: boolean;
  ctaLabel: string;
  ctaUrl: string;
};
/** A pass item's url is its Momence checkout page (shown as a Buy button). */
export type PassGroup = { title: string; items: { name: string; price: string; url?: string | null }[]; note: string | null };

export type Product = {
  name: string;
  category: string;
  description: string;
  priceLabel: string;
  image: Img | null;
  ctaLabel: string;
  ctaUrl: string;
};

export type TimetableRow = {
  id: string;
  day: number; // 1 = Monday … 7 = Sunday
  start: string; // "HH:MM"
  end: string | null;
  className: string;
  classSlug: string | null;
  teacher: string | null;
  level: string | null;
  notes: string | null;
  bookUrl: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  teacher: string | null;
  priceLabel: string | null;
  description: string | null;
  bookUrl: string | null;
};

export type Voucher = { id: string; name: string; price: number | null; description: string | null; buyUrl: string };
