import { useEffect, useState } from "react";

interface FlagSVGProps {
    countryCode: string;
    height: number;
}

const getFlag = async (code: string) => {
    try {
        const flag = await import(`../assets/country-flags-3x2/${code}.svg`);
        console.log(flag);
        return flag.default; // Return the URL for the image
    } catch (error) {
        console.error(`Flag for country code "${code}" not found.`);
        return null;
    }
};

type LanguageFlagIconProps = {
    name: string;
    height?: number | string;
    [key: string]: any;
};

export const LanguageFlagIcon: React.FC<LanguageFlagIconProps> = ({ name, height = 24, ...props }) => {
    const [flagUrl, setFlagUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadFlag = async () => {
            console.log("Loading flag for:", name);
            const flagImage = await getFlag(name);
            console.log(flagImage); // Check what URL we are receiving
            if (flagImage) {
                setFlagUrl(flagImage); // Set the URL for the flag
            }
        };

        loadFlag();
    }, [name]); // Only load the flag when the `name` changes

    if (!flagUrl) {
        return <div>Loading...</div>; // Show a loading state while the flag is being fetched
    }

    return <img src={flagUrl} height={height} {...props} alt={`Flag for ${name}`} />; // Render the flag as an image once it's available
};

export const languageOptions: string[] = [
    "de-de",
    "en-gb",
    "en-us",
    "es-es",
    "fr-fr",
    "it-it",
    "nl-be",
    "nl-nl",
    "pl-pl",
    "pt-pt",
    "tr-tr",
    "ca-ad",
    "ar-ae",
    "af-af",
    "en-ag",
    "en-ai",
    "sq-al",
    "hy-am",
    "pt-ao",
    "xx-aq",
    "es-ar",
    "en-as",
    "de-at",
    "en-au",
    "nl-aw",
    "sv-ax",
    "az-az",
    "bs-ba",
    "en-bb",
    "bn-bd",
    "fr-bf",
    "bg-bg",
    "ar-bh",
    "en-bi",
    "fr-bj",
    "fr-bl",
    "en-bm",
    "ms-bn",
    "es-bo",
    "nl-bq",
    "pt-br",
    "en-bs",
    "dz-bt",
    "no-bv",
    "en-bw",
    "be-by",
    "en-bz",
    "en-ca",
    "en-cc",
    "fr-cd",
    "fr-cf",
    "fr-cg",
    "de-ch",
    "fr-ci",
    "en-ck",
    "es-cl",
    "fr-cm",
    "zh-cn",
    "es-co",
    "es-cr",
    "es-cu",
    "pt-cv",
    "nl-cw",
    "en-cx",
    "el-cy",
    "cs-cz",
    "fr-dj",
    "da-dk",
    "en-dm",
    "es-do",
    "ar-dz",
    "es-ec",
    "et-ee",
    "ar-eg",
    "ar-eh",
    "ti-er",
    "am-et",
    "xx-eu",
    "fi-fi",
    "en-fj",
    "en-fk",
    "en-fm",
    "fo-fo",
    "fr-ga",
    "en-gd",
    "ka-ge",
    "fr-gf",
    "en-gg",
    "en-gh",
    "en-gi",
    "kl-gl",
    "en-gm",
    "fr-gn",
    "fr-gp",
    "es-gq",
    "el-gr",
    "en-gs",
    "es-gt",
    "en-gu",
    "pt-gw",
    "en-gy",
    "zh-hk",
    "en-hm",
    "es-hn",
    "hr-hr",
    "fr-ht",
    "hu-hu",
    "es-ic",
    "id-id",
    "en-ie",
    "he-il",
    "en-im",
    "hi-in",
    "en-io",
    "ar-iq",
    "fa-ir",
    "is-is",
    "en-je",
    "en-jm",
    "ar-jo",
    "ja-jp",
    "sw-ke",
    "ky-kg",
    "km-kh",
    "en-ki",
    "ar-km",
    "en-kn",
    "ko-kp",
    "ko-kr",
    "ar-kw",
    "en-ky",
    "kk-kz",
    "lo-la",
    "ar-lb",
    "en-lc",
    "de-li",
    "si-lk",
    "en-lr",
    "en-ls",
    "lt-lt",
    "fr-lu",
    "lv-lv",
    "ar-ly",
    "ar-ma",
    "fr-mc",
    "ro-md",
    "sr-me",
    "fr-mf",
    "mg-mg",
    "en-mh",
    "mk-mk",
    "bm-ml",
    "my-mm",
    "mn-mn",
    "zh-mo",
    "en-mp",
    "fr-mq",
    "ar-mr",
    "en-ms",
    "mt-mt",
    "en-mu",
    "dv-mv",
    "en-mw",
    "es-mx",
    "ms-my",
    "pt-mz",
    "en-na",
    "fr-nc",
    "fr-ne",
    "en-nf",
    "en-ng",
    "es-ni",
    "no-no",
    "ne-np",
    "en-nr",
    "en-nu",
    "en-nz",
    "ar-om",
    "es-pa",
    "es-pe",
    "fr-pf",
    "en-pg",
    "tl-ph",
    "ur-pk",
    "fr-pm",
    "en-pn",
    "es-pr",
    "ar-ps",
    "en-pw",
    "es-py",
    "ar-qa",
    "fr-re",
    "ro-ro",
    "sr-rs",
    "ru-ru",
    "rw-kg",
    "ar-sa",
    "en-sb",
    "en-sc",
    "ar-sd",
    "sv-se",
    "en-sg",
    "en-sh",
    "sl-si",
    "no-sj",
    "sk-sk",
    "en-sl",
    "it-sm",
    "fr-sn",
    "so-so",
    "nl-sr",
    "en-ss",
    "pt-st",
    "es-sv",
    "nl-sx",
    "ar-sy",
    "en-sz",
    "en-ta",
    "en-tc",
    "fr-td",
    "fr-tf",
    "fr-tg",
    "th-th",
    "tg-tj",
    "en-tk",
    "tet-tl",
    "tk-tm",
    "ar-tn",
    "en-to",
    "en-tt",
    "en-tv",
    "zh-tw",
    "sw-tz",
    "uk-ua",
    "en-ug",
    "en-um",
    "es-uy",
    "uz-uz",
    "it-va",
    "en-vc",
    "es-ve",
    "en-vg",
    "en-vi",
    "vi-vn",
    "en-vu",
    "fr-wf",
    "en-ws",
    "sq-xk",
    "ar-ye",
    "fr-yt",
    "en-za",
    "en-zm",
    "en-zw",
    "undefined",
];
