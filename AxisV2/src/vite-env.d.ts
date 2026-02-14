/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_AVA_SERVER_URL?: string
  readonly VITE_PRODUCTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
