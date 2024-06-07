import { Trans, useTranslation } from "react-i18next";
import { Button, Card, DatePicker, Form, Input, List, Modal, Tooltip, Typography, theme } from "antd";

import {
    HiddenDesktop,
    StyledBreadcrumb,
    StyledContent,
    StyledLayout,
    StyledSider,
} from "../../components/StyledComponents";
import { ToniesSubNav } from "../../components/tonies/ToniesSubNav";
import { Link } from "react-router-dom";
import { LinkOutlined, PlusOutlined } from "@ant-design/icons";
import LanguageFlagSVG from "../../utils/languageUtil";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Paragraph } = Typography;
const { Text } = Typography;
const { useToken } = theme;

interface SourceData {
    sourceTitle: string;
    title: string;
    description?: string;
    source: string;
    image: string;
    language: string;
    dateOfAdding?: string;
}

export const FreeContentPage = () => {
    const { t } = useTranslation();
    const { token } = useToken();

    const freeContentWebsitesExampleJson = "/freeContentWebSitesExample.json";
    const freeContentWebsitesJson = "/web/freeContentWebSites.json";
    const [sourceData, setSourceData] = useState<SourceData[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetch(freeContentWebsitesJson)
            .then((response) => response.json())
            .then((data) => setSourceData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const addEntryModal = (
        <Modal
            title={t("tonies.freeContent.addNewContent")}
            open={isModalVisible}
            onCancel={handleCancel}
            okText={t("tonies.freeContent.form.save")}
            onOk={() => {
                form.validateFields()
                    .then(() => {
                        setIsModalVisible(false);
                        setJsonData(JSON.stringify(form.getFieldsValue(), null, 2));
                        setJsonViewerModalOpened(true);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="sourceTitle"
                    label={t("tonies.freeContent.form.sourceTitle")}
                    rules={[{ required: true, message: t("tonies.freeContent.form.sourceTitleRequired") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="title" label={t("tonies.freeContent.form.title")}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label={t("tonies.freeContent.form.description")}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="source"
                    label={t("tonies.freeContent.form.source")}
                    rules={[{ required: true, message: t("tonies.freeContent.form.sourceRequired") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="image"
                    label={t("tonies.freeContent.form.image")}
                    rules={[{ required: true, message: t("tonies.freeContent.form.imageRequired") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="language" label={t("tonies.freeContent.form.language")}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );

    const [jsonData, setJsonData] = useState<string>("");
    const [jsonViewerModalOpened, setJsonViewerModalOpened] = useState(false);

    const jsonViewerModalFooter = (
        <Button type="primary" onClick={() => setJsonViewerModalOpened(false)}>
            {t("tonies.freeContent.form.ok")}
        </Button>
    );

    const handleJsonViewerModalClose = () => {
        setJsonViewerModalOpened(false);
    };

    function detectColorScheme() {
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const storedTheme = localStorage.getItem("theme");

        if (storedTheme === "auto") {
            return prefersDarkMode ? "dark" : "light";
        } else {
            return storedTheme;
        }
    }

    const jsonViewerModal = (
        <Modal
            footer={jsonViewerModalFooter}
            width={700}
            title={t("tonies.freeContent.copy")}
            open={jsonViewerModalOpened}
            onCancel={handleJsonViewerModalClose}
        >
            {jsonData ? (
                <>
                    <Paragraph>{t("tonies.freeContent.form.copyHint")}</Paragraph>
                    <SyntaxHighlighter
                        language="json"
                        style={detectColorScheme() === "dark" ? oneDark : oneLight}
                        customStyle={{
                            padding: 0,
                            borderRadius: 0,
                            margin: 0,
                            border: "none",
                        }}
                    >
                        {jsonData}
                    </SyntaxHighlighter>
                </>
            ) : (
                "Loading..."
            )}
        </Modal>
    );

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
                    {addEntryModal}
                    {jsonViewerModal}
                    {sourceData.length === 0 ? (
                        <>
                            <Paragraph>
                                <Trans
                                    i18nKey="tonies.freeContent.textNoJson"
                                    components={{
                                        exampleJsonLink: (
                                            <Link
                                                to={freeContentWebsitesExampleJson.replace("/web/", "/")}
                                                target="_blank"
                                            />
                                        ),
                                    }}
                                />
                            </Paragraph>
                            <Paragraph>
                                <Button icon={<PlusOutlined />} onClick={showModal}>
                                    {t("tonies.freeContent.addNewContent")}
                                </Button>
                            </Paragraph>
                        </>
                    ) : (
                        <>
                            <Paragraph>
                                <Trans
                                    i18nKey="tonies.freeContent.text"
                                    components={{
                                        exampleJsonLink: (
                                            <Link to={freeContentWebsitesJson.replace("/web/", "/")} target="_blank" />
                                        ),
                                    }}
                                />
                            </Paragraph>
                            <Paragraph>
                                <Button icon={<PlusOutlined />} onClick={showModal}>
                                    {t("tonies.freeContent.addNewContent")}
                                </Button>
                            </Paragraph>
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
                                    dataSource={sourceData}
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
                                                                <LanguageFlagSVG
                                                                    countryCode={source.language}
                                                                    height={20}
                                                                />
                                                            </Text>
                                                        </Tooltip>
                                                    </div>
                                                }
                                                cover={
                                                    <img
                                                        alt={source.sourceTitle}
                                                        src={source.image}
                                                        style={{ padding: 8 }}
                                                    />
                                                }
                                                actions={[
                                                    <>
                                                        <Link to={source.source} target="_blank">
                                                            {t("tonies.freeContent.toExternalFreeContent")}{" "}
                                                            <LinkOutlined />
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
                        </>
                    )}
                </StyledContent>
            </StyledLayout>
        </>
    );
};
