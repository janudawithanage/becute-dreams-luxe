import anime from "@/assets/cat-anime.jpg";
import laptop from "@/assets/cat-laptop.jpg";
import phone from "@/assets/cat-phone.jpg";
import aesthetic from "@/assets/cat-aesthetic.jpg";
import cute from "@/assets/cat-cute.jpg";
import custom from "@/assets/cat-custom.jpg";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tag?: string;
}

export const categories: Category[] = [
  { slug: "anime", name: "Anime Stickers", tagline: "Curated character icons", image: anime },
  { slug: "cute", name: "Cute Stickers", tagline: "Kawaii everyday softness", image: cute },
  { slug: "laptop", name: "Laptop Stickers", tagline: "Designer-grade vinyl", image: laptop },
  { slug: "phone", name: "Phone Stickers", tagline: "Delicate, removable art", image: phone },
  {
    slug: "aesthetic",
    name: "Aesthetic Packs",
    tagline: "Editorial sticker series",
    image: aesthetic,
  },
  { slug: "custom", name: "Custom Designs", tagline: "Made just for you", image: custom },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "sakura-dream-pack",
    name: "Sakura Dream Pack",
    price: 18,
    category: "aesthetic",
    image: aesthetic,
    description:
      "A 24-piece botanical sticker series printed on premium matte vinyl, finished by hand.",
    tag: "Bestseller",
  },
  {
    id: "p2",
    slug: "kawaii-cloud-set",
    name: "Kawaii Cloud Set",
    price: 14,
    category: "cute",
    image: cute,
    description:
      "Soft pastel kitten characters with a velvet-touch laminate. Made to make your day softer.",
  },
  {
    id: "p3",
    slug: "midnight-anime",
    name: "Midnight Anime Edition",
    price: 22,
    category: "anime",
    image: anime,
    description: "Limited-run anime icons with foil detailing. Numbered series of 500.",
    tag: "Limited",
  },
  {
    id: "p4",
    slug: "atelier-laptop-skin",
    name: "Atelier Laptop Skin",
    price: 28,
    category: "laptop",
    image: laptop,
    description: 'Curated collage of editorial designs. Residue-free. Cut for 13–16" laptops.',
  },
  {
    id: "p5",
    slug: "pressed-petal-phone",
    name: "Pressed Petal Phone Set",
    price: 12,
    category: "phone",
    image: phone,
    description:
      "Delicate floral stickers cut from translucent film. A whisper of nature on your device.",
  },
  {
    id: "p6",
    slug: "monogram-custom",
    name: "Monogram Custom Pack",
    price: 32,
    category: "custom",
    image: custom,
    description: "Designed around your initials. Hand-finished with champagne foil.",
    tag: "New",
  },
  {
    id: "p7",
    slug: "lavender-fields",
    name: "Lavender Fields Edition",
    price: 19,
    category: "aesthetic",
    image: aesthetic,
    description: "A dreamy series in muted lavender and rose. Editorial calm for your everyday.",
  },
  {
    id: "p8",
    slug: "cloud-nine-anime",
    name: "Cloud Nine Anime",
    price: 16,
    category: "anime",
    image: anime,
    description: "Soft kawaii anime portraits with a luxurious soft-touch finish.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByCategory = (slug: string) => products.filter((p) => p.category === slug);
