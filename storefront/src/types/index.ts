// ─── API wrapper ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  parent?: Pick<Category, "id" | "name" | "slug">;
  children?: Category[];
}

// ─── Product ─────────────────────────────────────────────────────────────────
export type VariantType = "SIZE" | "DESIGN" | "MATERIAL" | "COLOR";

export interface ProductVariant {
  id: number;
  type: VariantType;
  value: string;
  price: number;
  stockQuantity: number;
  active?: boolean;
  sortOrder?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  sortOrder: number;
  primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stockQuantity: number;
  lowStockThreshold: number;
  minOrderQty: number;
  weight?: number;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  variantsByType: Record<VariantType, ProductVariant[]>;
  startingPrice: number;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: number;
  variantId?: number;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  sku?: string;
  variantType?: VariantType;
  variantValue?: string;
  price: number;
  quantity: number;
  minOrderQty: number;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku?: string;
  variantId?: number;
  variantType?: VariantType;
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
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes?: string;
  awbCode?: string;
  shiprocketShipmentId?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderRequest {
  shippingAddressId?: number;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes?: string;
  paymentMethod?: string;
  items: {
    productId: number;
    variantId?: number;
    quantity: number;
  }[];
}

// ─── User / Auth ─────────────────────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn?: number;
  userId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// ─── CMS ─────────────────────────────────────────────────────────────────────
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface Setting {
  key: string;
  value: string;
  type: string;
  description?: string;
  group?: string;
}

export type SettingsMap = Record<string, string>;

// ─── CMS ─────────────────────────────────────────────────────────────────────
export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export interface GalleryImage {
  id: number;
  url: string;
  publicId: string;
  altText?: string;
  title?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  sortOrder: number;
  createdAt: string;
}

// ─── Shipment / Tracking ─────────────────────────────────────────────────────
export interface ServiceabilityResponse {
  pincode: string;
  available: boolean;
  availableCouriers: string[];
}

export interface ShipmentResponse {
  id?: number;
  orderId?: number;
  awbCode?: string;
  status?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt?: string;
}

// ─── Razorpay ────────────────────────────────────────────────────────────────
export interface PaymentInitResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}
