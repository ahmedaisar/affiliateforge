/** The cairn mark: four stones, biggest first. Drawn, not an image, so it
 *  inherits `currentColor` and survives forced-colors. */
export function Brand() {
  return (
    <>
      <svg className="brand__mark" viewBox="0 0 24 24" aria-hidden="true">
        <g fill="currentColor">
          <ellipse cx="12" cy="19.5" rx="9" ry="3" />
          <ellipse cx="12" cy="14.5" rx="6.6" ry="2.6" />
          <ellipse cx="12" cy="10" rx="4.6" ry="2.2" />
          <ellipse cx="12" cy="6" rx="2.8" ry="1.7" />
        </g>
      </svg>
      Cairn
    </>
  );
}
