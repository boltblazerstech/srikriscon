/**
 * Smooth wave transition between two section background colours.
 * Place between sections in page.tsx:
 *   <WaveDivider from="#ffffff" to="#0B3A42" />  (white → teal)
 *   <WaveDivider from="#0B3A42" to="#ffffff" />  (teal → white)
 *
 * The `from` colour fills a downward arch at the top of the divider;
 * the `to` colour is the div background (visible below the arch).
 */
export default function WaveDivider({ from, to }: { from: string; to: string }) {
  return (
    <div aria-hidden style={{ background: to, lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block w-full h-10 sm:h-14 lg:h-20"
      >
        {/* Arch dips to ~y=45 at centre, stays at y=10 at edges */}
        <path d="M 0 0 L 1440 0 L 1440 10 Q 720 80 0 10 Z" style={{ fill: from }} />
      </svg>
    </div>
  );
}
