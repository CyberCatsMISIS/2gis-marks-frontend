/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_2GIS_API_KEY: string
  readonly VITE_2GIS_APP_ID: string
  readonly VITE_API_URL: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
