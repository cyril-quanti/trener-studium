/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENT_FIXTURES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
