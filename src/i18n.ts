import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ["en", "de", "fr", "es"],
        fallbackLng: "en",
        ns: ["teddycloud"],
        defaultNS: "teddycloud",
        debug: false,
        backend: {
            queryStringParams: { v: "2023072701" },
            loadPath: `${import.meta.env.VITE_APP_TEDDYCLOUD_WEB_BASE}/translations/{{lng}}.json`,
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
