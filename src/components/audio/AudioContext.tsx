import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import logoImg from "../../assets/logo.png";

interface AudioContextType {
    playAudio: (url: string, meta?: any) => void;
    songImage: string;
    songArtist: string;
    songTitle: string;
    songTracks: number[];
}

const AudioContext = React.createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudioContext must be used within an AudioProvider");
    }
    return context;
};

interface AudioProviderProps {
    children: React.ReactNode; // Define the children prop
}

const extractFilename = (url: string) => {
    // Remove query parameters if any
    const urlWithoutParams = url.split("?")[0];
    // Extract the filename from the URL
    const parts = urlWithoutParams.split("/");
    return parts[parts.length - 1];
};

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const { t } = useTranslation();
    const [songImage, setSongImage] = useState<string>("");
    const [songArtist, setSongArtist] = useState<string>("");
    const [songTitle, setSongTitle] = useState<string>("");
    const [songTracks, setSongTracks] = useState<number[]>([]);

    const playAudio = (url: string, meta?: any) => {
        console.log("Play audio: " + url);
        const globalAudio = document.getElementById("globalAudioPlayer") as HTMLAudioElement;
        globalAudio.src = url;
        if (meta) {
            setSongImage(meta.picture);
            setSongArtist(
                meta.series || meta.episode
                    ? meta.series
                    : extractFilename(decodeURI(url).replace("500304E0", t("audio.unknownSource")))
            );
            setSongTitle(meta.episode);
            setSongTracks([]); // the tracks (starting in seconds) should be added here
        } else {
            console.log(decodeURI(url));
            setSongImage(decodeURI(url).includes(".taf?") ? "/img_unknown.png" : logoImg);
            setSongArtist("");
            setSongTitle(extractFilename(decodeURI(url)));
            setSongTracks([]);
        }
        globalAudio.play();
    };

    return (
        <AudioContext.Provider value={{ playAudio, songImage, songArtist, songTitle, songTracks }}>
            {children}
        </AudioContext.Provider>
    );
};
