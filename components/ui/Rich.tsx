// Renders plain text where **segments** are measured results, set heavier in the same ink.
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="num font-bold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
