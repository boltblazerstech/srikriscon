// ─── Auth ─────────────────────────────────────────────────────────────────────
export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  active?: boolean;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
// Matches backend PagedResponse<T>
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** Current page index (0-based), backend field: "page" */
  page: number;
  /** Alias for page — some callers use "number" */
  number?: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ─── API wrapper ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Category ─────────────────────────────────────────────────────────────────
// Matches backend CategoryResponse
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  active: boolean;
  sortOrder: number;
  children?: Category[];
}

export interface CategoryRequest {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  parentId?: number;
}

// ─── Product ──────────────────────────────────────────────────────────────────
// Matches backend ProductResponse.ImageDto
export interface ProductImage {
  id: number;
  /** Public URL of the image */
  url: string;
  altText?: string;
  primary: boolean;
  sortOrder: number;
}

// Matches backend ProductResponse.VariantDto
export interface ProductVariant {
  id: number;
  /** Variant type: SIZE | DESIGN | MATERIAL */
  type: string;
  value: string;
  price?: number | null;
  stockQuantity: number;
  active: boolean;
  sortOrder: number;
}

// Matches backend ProductResponse
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  startingPrice?: number;
  sku?: string;
  stockQuantity: number;
  minOrderQty?: number;
  inStock: boolean;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  categoryId?: number;
  categoryName?: string;
  /** Full images array — use image.url for the src */
  images: ProductImage[];
  variants: ProductVariant[];
  variantsByType?: Record<string, ProductVariant[]>;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

export interface VariantRequest {
  id?: number;
  /** Variant type: SIZE | DESIGN | MATERIAL */
  type: string;
  value: string;
  price?: number | null;
  stockQuantity: number;
  active: boolean;
}

export interface ProductRequest {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  categoryId?: number;
  active: boolean;
  featured: boolean;
  images: string[];
  variants: VariantRequest[];
  metaTitle?: string;
  metaDescription?: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "PLACED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED"
  | "CANCELLED" | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  variantId?: number;
  variantValue?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  customerId?: number;
  customerEmail?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: OrderItem[];
  notes?: string;
  shipment?: Shipment;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: number;
  awbCode: string;
  courierName?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  status?: string;
}

export interface ShipmentRequest {
  awbCode: string;
  courierName?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
// Matches backend GalleryImage entity (field is "url" not "imageUrl")
export interface GalleryImage {
  id: number;
  /** The public image URL — backend field name is "url" */
  url: string;
  altText?: string;
  title?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  sortOrder: number;
  createdAt?: string;
}

// ─── Banner ───────────────────────────────────────────────────────────────────
// Matches backend BannerResponse
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface BannerRequest {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
// Matches backend TestimonialResponse
export interface Testimonial {
  id: number;
  /** Customer/author name — backend field: "name" */
  name: string;
  designation?: string;
  company?: string;
  /** Review text — backend field: "content" */
  content: string;
  rating: number;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface TestimonialRequest {
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  active: boolean;
}

// ─── CMS Page ─────────────────────────────────────────────────────────────────
export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  active: boolean;
  updatedAt: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface StoreSettings {
  storeName: string;
  storeTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  storeEmail: string;
  storePhone: string;
  whatsappNumber?: string;
  storeAddress: string;
  gstNumber?: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingFee: number;
  razorpayKeyId: string;
  googleAnalyticsId?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  revenuePaid: number;
  totalProducts: number;
  totalCustomers: number;
  totalCategories: number;
  newCustomersToday: number;
  lowStockProducts: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Order[];
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export interface UploadResponse {
  url: string;
  key: string;
}

// ─── Admin User Request ───────────────────────────────────────────────────────
export interface AdminUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: AdminRole;
}

// ─── Customer ──────────────────────────────────────────────────────────────────
export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  active: boolean;
}

// ─── BlogPost ──────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  readTime?: string;
}
