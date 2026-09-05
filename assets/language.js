(() => {
  const script = document.currentScript;
  const page = script?.dataset.page;
  const currentLanguage = script?.dataset.currentLanguage;

  if (!page || !currentLanguage) return;

  const params = new URLSearchParams(window.location.search);
  const explicitLanguage = params.get("lang");
  let preferredLanguage;

  if (explicitLanguage === "zh" || explicitLanguage === "en") {
    preferredLanguage = explicitLanguage;
    try {
      window.localStorage.setItem("site-language", preferredLanguage);
    } catch {
      // Continue with the current request when storage is unavailable.
    }
  }

  if (!preferredLanguage) {
    try {
      preferredLanguage = window.localStorage.getItem("site-language") || undefined;
    } catch {
      // Fall back to browser language when storage is unavailable.
    }
  }

  if (preferredLanguage !== "zh" && preferredLanguage !== "en") {
    const browserLanguages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    preferredLanguage = browserLanguages.some(language =>
      language?.toLowerCase().startsWith("zh"),
    )
      ? "zh"
      : "en";
  }

  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";

  if (preferredLanguage !== currentLanguage) {
    const destination = preferredLanguage === "en" ? `/${page}/en/` : `/${page}/`;
    window.location.replace(`${destination}${window.location.hash}`);
  }
})();
