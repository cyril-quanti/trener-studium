interface FlashcardProps {
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ front, back, flipped, onFlip }: FlashcardProps) {
  return (
    <div className="[perspective:1200px]">
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={flipped ? "Zobrazit otázku" : "Otočit kartičku a zobrazit odpověď"}
        className="relative h-72 w-full rounded-lg text-left [transform-style:preserve-3d] transition-transform duration-500 ease-out motion-reduce:transition-none sm:h-80"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface-raised p-6 shadow-subtle [backface-visibility:hidden]">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Otázka</span>
          <p className="max-w-measure text-center text-lg font-medium text-text">{front}</p>
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto rounded-lg border border-accent/40 bg-surface-raised p-6 shadow-subtle [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-xs font-medium uppercase tracking-wide text-accent">Odpověď</span>
          <p className="max-w-measure whitespace-pre-line text-center text-base text-text">{back}</p>
        </div>
      </button>
    </div>
  );
}
