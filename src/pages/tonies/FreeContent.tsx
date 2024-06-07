import { useTranslation } from "react-i18next";
import { Card, List, Tooltip, Typography, theme } from "antd";

import {
    HiddenDesktop,
    StyledBreadcrumb,
    StyledContent,
    StyledLayout,
    StyledSider,
} from "../../components/StyledComponents";
import { ToniesSubNav } from "../../components/tonies/ToniesSubNav";
import { Link } from "react-router-dom";
import { LinkOutlined } from "@ant-design/icons";
import LanguageFlagSVG from "../../utils/languageUtil";

const { Paragraph } = Typography;
const { Text } = Typography;
const { useToken } = theme;

export const FreeContentPage = () => {
    const { t } = useTranslation();
    const { token } = useToken();

    const sourceArray = [
        {
            sourceTitle: "ohrka.de",
            title: "Das hochwertige Hörportal für Kinder",
            description:
                "Bekannte und beliebte Stimmen wie Anke Engelke oder Katharina Thalbach lesen Hörspiele und Hörbücher für Kinder. Über 80 Stunden anhören. Kostenlos, werbefrei. Auch zum downloaden. Pädi-Gütesiegel 2013. Spannende, lustige und vor allem kostenlose Kinderhörspiele zum Hören und als mp3-Datei zum Download.",
            source: "https://www.ohrka.de",
            image: "https://www.ohrka.de/templates/public/img/logo.png",
            language: "de-de",
            dateOfAdding: "2024-06-07",
        },
        {
            sourceTitle: "Vorleser.net",
            title: "Kostenlose mp3-Hörbücher und Hörspiele",
            description:
                "750+ kostenlose mp3-Hörbücher und Hörspiele legal als Stream oder zum Download! Von professionellen Sprechern exklusiv für vorleser.net produzierte Hörbücher und Hörspiele",
            source: "https://www.vorleser.net",
            image: "https://www.vorleser.net/resources/images/favicon/android-chrome-192x192.png",
            language: "de-de",
            dateOfAdding: "2024-06-07",
        },
        {
            sourceTitle: "Gratis-Hoerspiele.de",
            title: "Gratis Hörspiele & Hörbücher | Kostenlos und legal",
            description:
                "Über 3.000 kostenlose Hörspiele und Hörbücher. Legal und gratis als MP3 runterladen oder streamen! Entdecke täglich neue kostenfreie Downloads und Streams.",
            source: "https://www.gratis-hoerspiele.de",
            image: "https://www.gratis-hoerspiele.de/wp-content/uploads/2018/02/cropped-symbol-270x270.png",
            language: "de-de",
            dateOfAdding: "2024-06-07",
        },
        {
            sourceTitle: "Hörbuch Kostenlos 2024",
            title: "Hörbücher kostenlose hören oder herunterladen",
            description:
                "Kostenlose Hörbuch-Sammlung von mehr als 200.000 heutzutage beliebtesten Titeln von vielen weltberühmten Autoren. Hörbücher kostenlos online hören oder herunterladen mit nur einem Klick.",
            source: "https://horbuchkostenlos.de/",
            image: "https://horbuchkostenlos.de/wp-content/uploads/2022/02/HorbuchKostenlos.png",
            language: "de-de",
            dateOfAdding: "2024-06-07",
        },
        {
            sourceTitle: "Internet Archive",
            title: "Audio Books & Poetry",
            description:
                "Listen to free audio books and poetry recordings! This library of audio books and poetry features digital recordings and MP3's from the Naropa Poetics Audio Archive, LibriVox, Project Gutenberg, Maria Lectrix, and Internet Archive users.",
            source: "https://archive.org/details/audio_bookspoetry",
            image: "https://archive.org/services/img/audio_bookspoetry",
            language: "en-us",
            dateOfAdding: "2024-06-07",
        },
    ];
    return (
        <>
            <StyledSider>
                <ToniesSubNav />
            </StyledSider>
            <StyledLayout>
                <HiddenDesktop>
                    <ToniesSubNav />
                </HiddenDesktop>
                <StyledBreadcrumb
                    items={[
                        { title: t("home.navigationTitle") },
                        { title: t("tonies.navigationTitle") },
                        { title: t("tonies.freeContent.navigationTitle") },
                    ]}
                />
                <StyledContent>
                    <h1>{t(`tonies.freeContent.title`)}</h1>
                    <Paragraph>{t("tonies.freeContent.text")}</Paragraph>
                    <Paragraph>
                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 3,
                                xl: 4,
                                xxl: 6,
                            }}
                            dataSource={sourceArray}
                            renderItem={(source) => (
                                <List.Item key={source.sourceTitle}>
                                    <Card
                                        style={{
                                            background: token.colorBgContainerDisabled,
                                        }}
                                        size="small"
                                        title={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {source.sourceTitle}
                                                </div>
                                                <Tooltip
                                                    placement="top"
                                                    zIndex={2}
                                                    title={t("languageUtil." + source.language)}
                                                >
                                                    <Text style={{ height: 20, width: "auto" }}>
                                                        <LanguageFlagSVG countryCode={source.language} height={20} />
                                                    </Text>
                                                </Tooltip>
                                            </div>
                                        }
                                        cover={
                                            <img alt={source.sourceTitle} src={source.image} style={{ padding: 8 }} />
                                        }
                                        actions={[
                                            <>
                                                <Link to={source.source} target="_blank">
                                                    {t("tonies.freeContent.toExternalFreeContent")} <LinkOutlined />
                                                </Link>
                                            </>,
                                        ]}
                                    >
                                        <Card.Meta title={source.title} description={source.description} />
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Paragraph>
                </StyledContent>
            </StyledLayout>
        </>
    );
};
