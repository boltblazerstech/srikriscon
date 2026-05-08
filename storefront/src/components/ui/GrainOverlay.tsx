/**
 * Subtle SVG-noise grain texture — overlay inside any `relative overflow-hidden` section.
 * Renders a 200×200 fractalNoise tile repeated at very low opacity.
 */
const GRAIN_URL =
  "url(\"data:image/svg+xml;charset=utf-8," +
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
  "<filter id='n'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/>" +
  "</filter>" +
  "<rect width='200' height='200' filter='url(%23n)' opacity='1'/>" +
  "</svg>\")";

export default function GrainOverlay() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.038]"
      style={{
        backgroundImage: GRAIN_URL,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}
