export const locales = ['en','zh'] as const;\nexport type Locale = typeof locales[number];\nexport const defaultLocale: Locale = 'en';\n
