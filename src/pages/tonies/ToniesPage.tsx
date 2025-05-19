import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Select, Tooltip } from "antd";

import { TonieCardProps } from "../../types/tonieTypes";

import { defaultAPIConfig } from "../../config/defaultApiConfig";
import { TeddyCloudApi } from "../../api";

import BreadcrumbWrapper, { StyledContent, StyledLayout, StyledSider } from "../../components/StyledComponents";
import { ToniesList } from "../../components/tonies/ToniesList";
import { ToniesSubNav } from "../../components/tonies/ToniesSubNav";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import { useTeddyCloud } from "../../TeddyCloudContext";
import { NotificationTypeEnum } from "../../types/teddyCloudNotificationTypes";
import { useTonieboxContent } from "../../components/utils/OverlayContentDirectories";
import { QuestionCircleOutlined } from "@ant-design/icons";
import HelpModal from "../../components/utils/ToniesHelpModal";

const api = new TeddyCloudApi(defaultAPIConfig());

const { Option } = Select;

interface LanguageCounts {
    [key: string]: number;
}

export const ToniesPage = () => {
    const { t } = useTranslation();
    const { addNotification } = useTeddyCloud();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const linkOverlay = searchParams.get("overlay");
    const { tonieBoxContentDirs, overlay, handleContentOverlayChange } = useTonieboxContent(linkOverlay);

    const [tonies, setTonies] = useState<TonieCardProps[]>([]);
    const [defaultLanguage, setMaxTag] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const handleUpdate = (updatedTonieCard: TonieCardProps) => {
        setTonies((prevTonies) =>
            prevTonies.map((tonie) => (tonie.ruid === updatedTonieCard.ruid ? updatedTonieCard : tonie))
        );
    };

    useEffect(() => {
        const fetchTonies = async () => {
            setLoading(true);
            try {
                const tonieData = (await api.apiGetTagIndex(overlay ? overlay : "", true)).filter((item) => !item.hide);
                setTonies(
                    tonieData.sort((a, b) => {
                        if (a.tonieInfo.series < b.tonieInfo.series) {
                            return -1;
                        }
                        if (a.tonieInfo.series > b.tonieInfo.series) {
                            return 1;
                        }
                        if (a.tonieInfo.episode < b.tonieInfo.episode) {
                            return -1;
                        }
                        if (a.tonieInfo.episode > b.tonieInfo.episode) {
                            return 1;
                        }
                        return 0;
                    })
                );
            } catch (error) {
                addNotification(
                    NotificationTypeEnum.Error,
                    t("tonies.errorFetchingTonies"),
                    t("tonies.errorFetchingTonies") + ": " + error,
                    t("tonies.navigationTitle")
                );
                console.log("error: fetching tonies failed: " + error);
            } finally {
                setLoading(false);
            }
        };

        fetchTonies();
    }, [overlay]);

    // Update tagCounts state and find the language tag with the highest count when tags prop changes
    useEffect(() => {
        const counts: LanguageCounts = {};

        // Iterate over the tags array and count occurrences of each language tag
        tonies.forEach((tonies) => {
            const language = tonies.tonieInfo.language;
            // If the language tag already exists in the counts object, increment its count by 1
            if (counts[language]) {
                counts[language]++;
            } else {
                // If the language tag doesn't exist in the counts object, initialize its count to 1
                counts[language] = 1;
            }
        });

        // Find the language tag with the highest count
        let maxCount = 0;
        let maxLanguage = "";
        for (const language in counts) {
            if (counts.hasOwnProperty(language) && counts[language] > maxCount) {
                maxCount = counts[language];
                maxLanguage = language;
            }
        }
        // Update maxTag state with the language tag with the highest count
        setMaxTag(maxLanguage);
    }, [tonies]);

    return (
        <>
            <StyledSider>
                <ToniesSubNav />
            </StyledSider>
            <StyledLayout>
                <BreadcrumbWrapper
                    items={[{ title: t("home.navigationTitle") }, { title: t("tonies.navigationTitle") }]}
                />
                <StyledContent>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignContent: "center",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                    >
                        <h1 style={{ width: "200px" }}>{t("tonies.title")}</h1>

                        {tonieBoxContentDirs.length > 1 ? (
                            <Tooltip title={t("tonies.content.showToniesOfBoxes")}>
                                <Select
                                    id="contentDirectorySelect"
                                    defaultValue=""
                                    onChange={handleContentOverlayChange}
                                    style={{ maxWidth: "300px" }}
                                    value={overlay}
                                >
                                    {tonieBoxContentDirs.map(([contentDir, boxNames, boxId]) => (
                                        <Option key={boxId} value={boxId}>
                                            {boxNames.join(", ")}
                                        </Option>
                                    ))}
                                </Select>
                            </Tooltip>
                        ) : (
                            ""
                        )}
                        <Button
                            size="small"
                            icon={<QuestionCircleOutlined />}
                            onClick={() => setIsHelpModalOpen(true)}
                            style={{ marginLeft: 8 }}
                        >
                            {t("fileBrowser.help.showHelp")}
                        </Button>
                        {isHelpModalOpen && (
                            <HelpModal isHelpModalOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
                        )}
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <ToniesList
                            showFilter={true}
                            showPagination={true}
                            tonieCards={tonies.filter((tonie) => tonie.type === "tag")}
                            overlay={overlay}
                            readOnly={false}
                            defaultLanguage={defaultLanguage}
                            onToniesCardUpdate={handleUpdate}
                        />
                    )}
                </StyledContent>
            </StyledLayout>
        </>
    );
};
