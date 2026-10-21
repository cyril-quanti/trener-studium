import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { useAppState } from "../state/AppStateContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export function SettingsPage() {
  const { resetProgress } = useAppState();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Nastavení</h1>
      </header>

      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-text">Vzhled</p>
        <ThemeToggle />
      </Card>

      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-text">Pokrok</p>
        <p className="text-sm text-text-muted">
          Pokrok se ukládá pouze v tomto prohlížeči. Reset nevratně smaže všechny kartičky a výsledky otázek.
        </p>
        {!confirming ? (
          <Button variant="secondary" icon={<Trash2 size={16} strokeWidth={1.75} />} onClick={() => setConfirming(true)}>
            Resetovat pokrok
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-danger/30 bg-danger/5 p-3">
            <p className="text-sm text-text">Opravdu smazat veškerý pokrok?</p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" icon={<RotateCcw size={14} strokeWidth={1.75} />} onClick={() => { resetProgress(); setConfirming(false); }}>
                Ano, smazat
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Zrušit
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
