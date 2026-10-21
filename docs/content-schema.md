# Content schema

All learning content lives in `src/content/`. Each block has its own folder; content workers only ever edit their own `blok-<N>/` folder.

```
src/content/blok-<N>/
  meta.json                 block + topic list (pre-created, do not rename ids)
  <topic>.md                study notes
  <topic>.cards.json        flashcards
  <topic>.questions.json    oral-exam questions
```

## meta.json

```json
{
  "id": "blok-1",
  "number": 1,
  "title": "Teorie sportovního tréninku a výživa",
  "topics": [{ "id": "teorie-treninku", "title": "Teorie sportovního tréninku a psychologie sportu" }]
}
```

## `<topic>.md` – Studijní texty

- GitHub-flavoured Markdown. Start with **no** H1 (the app renders the topic title); use `##` for sections and `###` for sub-sections.
- Short paragraphs and bullet lists; **bold** key terms (the app styles bold as key-term highlights).
- Recreate diagrams/comparisons from the PDF as Markdown tables.
- Optional callouts: a blockquote starting with `> **Pozor:**` or `> **Zapamatuj si:**`.
- No images, no raw HTML, no links to the source PDFs.

## `<topic>.cards.json` – Kartičky

```json
[
  { "id": "teorie-treninku-c01", "front": "Co jsou pohybové schopnosti?", "back": "Vrozené předpoklady k provádění určité pohybové činnosti." }
]
```

- `id`: `<topic>-c<NN>` (two digits, sequential, never reused). ~15 cards per topic.
- `front`: one clear question or term (plain text). `back`: concise answer, plain text, may contain `\n` line breaks and `- ` bullet lines.

## `<topic>.questions.json` – Otázky k ústní zkoušce

```json
[
  {
    "id": "teorie-treninku-q01",
    "question": "Vysvětlete složky sportovního tréninku.",
    "modelAnswer": "Markdown answer of ~80–200 words, structured as you would answer orally.",
    "keyPoints": ["kondiční příprava – rozvoj pohybových schopností", "technická příprava – …"]
  }
]
```

- `id`: `<topic>-q<NN>`. ~8 open questions per topic, phrased like an oral examiner would ask (broad understanding, not trivia).
- `keyPoints`: 3–7 short, checkable points the answer must mention (used as a self-assessment checklist).

## Rules

- Content must come **strictly from the source PDFs**. No outside facts.
- Correct Czech with diacritics; fix PDF-extraction artifacts (e.g. `p říslušné` → `příslušné`).
- Valid UTF-8 JSON, 2-space indent, trailing newline. `npm run validate:content` must pass.
