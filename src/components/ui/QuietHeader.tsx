/** Quiet section marker: lowercase serif, muted, trailing em dash. */
export function QuietHeader({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <p className="font-serif text-[15px] text-text-muted">{label} —</p>
      {children}
    </div>
  );
}
