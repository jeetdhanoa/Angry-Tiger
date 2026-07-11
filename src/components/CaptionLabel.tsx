/** The red (or white) all-caps eyebrow label used at the top of nearly
 *  every section — Inter, uppercase, `.caption-label`. */
export default function CaptionLabel({
  children,
  white = false,
}: {
  children: React.ReactNode;
  white?: boolean;
}) {
  return (
    <span className={`caption-label${white ? " caption-label--white" : ""}`}>{children}</span>
  );
}
