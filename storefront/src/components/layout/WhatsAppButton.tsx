"use client";

import WhatsAppIcon from "@/src/components/ui/WhatsAppIcon";
import { motion } from "framer-motion";
import { theme } from "@/src/config/theme";
import { whatsappLink } from "@/src/lib/utils";
import { useSetting } from "@/src/hooks/useSettings";

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { value: storeName } = useSetting("storeName");
  const { value: whatsappNumber } = useSetting("whatsappNumber");

  const whatsapp = whatsappNumber || theme.business.whatsapp;
  const name = storeName || theme.business.name;

  if (!mounted || !whatsapp) return null;

  const href = whatsappLink(
    whatsapp,
    `Hi! I have a question about ${name}.`
  );

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20"
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25d366] opacity-30" />
    </motion.a>
  );
}
