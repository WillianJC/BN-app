/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_HTML_LANG?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_DEFAULT_PAGE_LIMIT?: string;
  readonly SERVER_PORT?: string;
  readonly CLIENT_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
