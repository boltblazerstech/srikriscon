import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ── Request: attach Bearer token if present ────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: unwrap ApiResponse wrapper ───────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Our backend always wraps in { success, message, data }
    let data = response.data;
    if (
      data &&
      typeof data === "object" &&
      "success" in data
    ) {
      data = data.data;
    }

    // --- Inject Mock Images ---
    const CATEGORY_IMAGES = [
      "/categories_images/cake_boxes.webp",
      "/categories_images/lids.webp",
      "/categories_images/modak.webp",
      "/categories_images/noodle_boxes.webp",
      "/categories_images/paper_bags.webp",
      "/categories_images/paper_cups.webp",
      "/categories_images/pizza_boxes.webp",
      "/categories_images/popcorn_box.webp",
      "/categories_images/restaurant_boxes.webp",
      "/categories_images/sweet_boxes.webp",
    ];

    function injectMockImages(obj: any, visited = new Set()) {
      if (!obj || typeof obj !== "object" || visited.has(obj)) return;
      visited.add(obj);

      if (Array.isArray(obj)) {
        obj.forEach((item) => injectMockImages(item, visited));
        return;
      }

      // Duck-type check for Product
      if ("id" in obj && "name" in obj && "slug" in obj && "price" in obj) {
        const id = Number(obj.id) || 1;
        const index = (id % 17) + 1;
        obj.images = [
          {
            id: 999900 + id,
            url: `/product_images/SKI_SWEET-BOXES (${index}).webp`,
            altText: obj.name,
            primary: true,
            sortOrder: 0,
          },
        ];
      }

      // Duck-type check for Category
      // Make sure it's not a Product (no price) and has standard category fields
      if ("id" in obj && "name" in obj && "slug" in obj && !("price" in obj) && "sortOrder" in obj) {
        const slug = String(obj.slug).toLowerCase();
        let matchedImage = null;

        if (slug.includes("pizza")) matchedImage = "/categories_images/pizza_boxes.webp";
        else if (slug.includes("sweet") || slug.includes("mithai")) matchedImage = "/categories_images/sweet_boxes.webp";
        else if (slug.includes("cake")) matchedImage = "/categories_images/cake_boxes.webp";
        else if (slug.includes("noodle") || slug.includes("chowmein")) matchedImage = "/categories_images/noodle_boxes.webp";
        else if (slug.includes("bag") || slug.includes("carry")) matchedImage = "/categories_images/paper_bags.webp";
        else if (slug.includes("cup") || slug.includes("glass")) matchedImage = "/categories_images/paper_cups.webp";
        else if (slug.includes("popcorn")) matchedImage = "/categories_images/popcorn_box.webp";
        else if (slug.includes("restaurant") || slug.includes("food") || slug.includes("meal")) matchedImage = "/categories_images/restaurant_boxes.webp";
        else if (slug.includes("lid") || slug.includes("cover")) matchedImage = "/categories_images/lids.webp";
        else if (slug.includes("modak")) matchedImage = "/categories_images/modak.webp";

        if (matchedImage) {
          obj.imageUrl = matchedImage;
        } else {
          const id = Number(obj.id) || 1;
          const index = id % CATEGORY_IMAGES.length;
          obj.imageUrl = CATEGORY_IMAGES[index];
        }
      }

      for (const key in obj) {
        if (typeof obj[key] === "object") {
          injectMockImages(obj[key], visited);
        }
      }
    }

    injectMockImages(data);
    // --------------------------

    return { ...response, data };
  },
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong";

    // Auto-clear tokens on 401
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
