export type Brand =
  | 'Schneider Electric'
  | 'ABB'
  | 'Siemens'
  | 'LS Electric'
  | 'Omron'
  | 'Madar Electric';
export type CategoryId =
  | 'breaker'
  | 'contactor'
  | 'power'
  | 'inverter'
  | 'cable'
  | 'relay'
  | 'panel'
  | 'sensor'
  | 'meter';
export type Availability = 'in-stock' | 'limited' | 'order';
export interface Product {
  id: string;
  name: string;
  brand: Brand;
  model: string;
  category: CategoryId;
  description: string;
  voltage: number;
  current: number;
  power: number | null;
  price: number | null;
  availability: Availability;
  stock: number;
  application: string;
  tags: string[];
  specs: Record<string, string>;
  relatedIds: string[];
  alternativeIds: string[];
  featured: boolean;
}
export interface Category {
  id: CategoryId;
  name: string;
  subtitle: string;
}
export interface QuoteItem {
  productId: string;
  quantity: number;
}
export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  items: QuoteItem[];
  productSnapshot: { id: string; name: string; model: string }[];
  status: 'new' | 'reviewed' | 'answered';
}
export interface DemoEvent {
  type: 'view' | 'search' | 'ai' | 'quote';
  value: string;
  at: string;
}
export interface DemoState {
  version: 1;
  products: Product[];
  favorites: string[];
  recent: string[];
  comparison: string[];
  quoteItems: QuoteItem[];
  quotes: QuoteRequest[];
  events: DemoEvent[];
}
export interface AIReply {
  text: string;
  products: Product[];
  intent: string;
  followUps: string[];
}
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  intent?: string;
}
export interface RecommendationInput {
  project: string;
  category: CategoryId;
  voltage: string;
  current: string;
  power: string;
  brand: string;
  budget: string;
  application: string;
}
export interface Recommendation {
  product: Product;
  score: number;
  reasons: string[];
}
export interface GeneratedContent {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  instagram: string;
  technical: string;
}
