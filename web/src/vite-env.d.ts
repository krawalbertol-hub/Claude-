/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_FORM_ENDPOINT?: string; readonly VITE_SITE_ORIGIN?: string; readonly BASE_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }
