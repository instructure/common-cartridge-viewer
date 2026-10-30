module.exports = {
  locales: ["ar", "ca", "cy", "da", "da-x-k12", "de", "en", "en_AU", "en_CA", "en_CY", "en_GB", "es", "es_ES", "fi", "fr", "fr_CA", "ga", "hi", "is", "it", "ja", "nb", "nb-x-k12", "nl", "pl", "pt", "pt_BR", "ru", "sl", "sv", "sv-x-k12", "th", "vi", "zh", "zh-Hans", "zh-Hant", "zh_HK"],
  sourceLocale: "en",
  fallbackLocales: { default: "en" },
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"]
    }
  ],
  format: "po"
};
