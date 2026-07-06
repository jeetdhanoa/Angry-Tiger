/* Placeholder for real photography. Art direction: B&W or red-duotone,
   grainy, a wide range of people on and off screen. Swap the inner span
   for an <img>/<Image> once shots exist — parents apply the duotone filter. */

export default function ImageSlot({
  placeholder,
  style,
}: {
  placeholder: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="image-slot" style={style}>
      <span>{placeholder}</span>
    </div>
  );
}
