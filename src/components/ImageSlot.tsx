/* Where real photography will go. Until then: an in-world slate card —
   tiger watermark over the dark surface, "Still to come." and a shot line,
   like a leader frame from an unfinished print. Monochrome by design so it
   survives the B&W/duotone filters some parents apply. */

export default function ImageSlot({
  scene,
  shot,
}: {
  scene: string;
  shot: string;
}) {
  return (
    <div className="image-slot" role="img" aria-label={`Production still coming soon, ${scene}`}>
      <img
        src="/logos/at-brand-symbol-white.svg"
        alt=""
        className="image-slot__watermark"
      />
      <div className="image-slot__frame" />
      <div className="image-slot__slate">
        <span className="image-slot__eyebrow">Angry Tiger · Production still</span>
        <span className="image-slot__title">Still to come.</span>
        <span className="image-slot__line">
          Scene: {scene} · Shot {shot}
        </span>
      </div>
    </div>
  );
}
