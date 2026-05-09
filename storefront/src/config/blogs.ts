export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
  imageUrl: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Sustainable Packaging in Modern E-commerce",
    slug: "sustainable-packaging-modern-ecommerce",
    excerpt: "Discover how eco-friendly materials are reshaping the way we think about product protection and brand identity.",
    content: "Detailed content about sustainable packaging...",
    date: "May 12, 2024",
    category: "Insights",
    author: "Aditya Sharma",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "10 Essential Safety Standards for Industrial Equipment",
    slug: "safety-standards-industrial-equipment",
    excerpt: "A comprehensive guide to ensuring your workspace meets the highest safety certifications for heavy-duty machinery.",
    content: "Detailed content about industrial safety...",
    date: "May 10, 2024",
    category: "Safety",
    author: "Rajesh Kumar",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "Optimizing Your Supply Chain for Peak Festive Seasons",
    slug: "optimizing-supply-chain-festive-seasons",
    excerpt: "How to handle high demand and logistics challenges during India's busiest shopping periods without breaking a sweat.",
    content: "Detailed content about logistics...",
    date: "May 05, 2024",
    category: "Logistics",
    author: "Priya Das",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    readTime: "6 min read",
  }
];
