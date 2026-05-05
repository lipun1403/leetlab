export function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
      63: "JAVASCRIPT",
      71: "PYTHON",
      62: "JAVA",
      54: "CPP",
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
  }



export function getLanguageId(language) {
  const languageMap = {
    "PYTHON": 71,
    "JAVASCRIPT": 63,
    "JAVA": 62,
    "CPP": 54,
  };
  return languageMap[language.toUpperCase()];
}