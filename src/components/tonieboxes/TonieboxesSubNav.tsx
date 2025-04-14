import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { MenuProps } from "antd";
import {
    CodeSandboxOutlined,
    DeliveredProcedureOutlined,
    InfoCircleOutlined,
    MinusOutlined,
    OrderedListOutlined,
    PlusOutlined,
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import i18n from "../../i18n";

import { useTeddyCloud } from "../../TeddyCloudContext";
import { StyledSubMenu } from "../StyledComponents";
import { TonieboxIcon } from "../utils/TonieboxIcon";
import { TeddyCloudSection } from "../../types/pluginsMetaTypes";

export const TonieboxesSubNav = () => {
    const { t } = useTranslation();
    const { setNavOpen, setSubNavOpen, setCurrentTCSection, plugins } = useTeddyCloud();
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const currentLanguage = i18n.language;
    useEffect(() => {
        setCurrentTCSection(t("tonieboxes.navigationTitle"));
    }, [openKeys, currentLanguage]);

    const pluginItems = plugins
        .filter((p) => p.teddyCloudSection === TeddyCloudSection.Tonieboxes)
        .map((plugin) => ({
            key: `plugin-${plugin.pluginId}`,
            label: (
                <Link
                    to={`/tonieboxes/plugin/${plugin.pluginId}`}
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {plugin.pluginName}
                </Link>
            ),
            icon: React.createElement(CodeSandboxOutlined),
            title: plugin.pluginName,
        }));

    const updateOpenKeys = (pathname: string) => {
        const newKeys: string[] = [];

        if (pathname.includes("/tonieboxes/boxsetup")) {
            newKeys.push("boxsetup");
            if (pathname.includes("/tonieboxes/boxsetup/esp32")) {
                newKeys.push("esp32");
            } else if (pathname.includes("/tonieboxes/boxsetup/cc3200")) {
                newKeys.push("cc3200");
            } else if (pathname.includes("/tonieboxes/boxsetup/cc3235")) {
                newKeys.push("cc3235");
            }
        }
        setOpenKeys((prevKeys) => Array.from(new Set([...prevKeys, ...newKeys])));
    };

    useEffect(() => {
        updateOpenKeys(location.pathname);
    }, [location.pathname]);

    const onOpenChange = (keys: string[]) => {
        const latestOpenKey = keys.find((key) => !openKeys.includes(key)); // New key being opened
        const latestCloseKey = openKeys.find((key) => !keys.includes(key)); // Key being closed

        if (latestOpenKey) {
            setOpenKeys((prevKeys) => [...prevKeys, latestOpenKey]);
        } else if (latestCloseKey) {
            setOpenKeys((prevKeys) => prevKeys.filter((key) => key !== latestCloseKey));
        }
    };

    const customExpandIcon = ({ isOpen }: { isOpen?: boolean }) => {
        const isExpanded = isOpen ?? false;
        return isExpanded ? (
            <MinusOutlined style={{ margin: "16px 0 16px 16px" }} />
        ) : (
            <PlusOutlined style={{ margin: "16px 0 16px 16px" }} />
        );
    };

    const subnav: MenuProps["items"] = [
        {
            key: "tonieboxes",
            label: (
                <Link
                    to="/tonieboxes"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("tonieboxes.navigationTitle")}
                </Link>
            ),
            icon: React.createElement(TonieboxIcon),
            title: t("tonieboxes.navigationTitle"),
        },
        {
            key: "boxsetup",
            label: (
                <Link
                    to="/tonieboxes/boxsetup"
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "currentColor",
                    }}
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("tonieboxes.boxSetup.navigationTitle")}
                </Link>
            ),
            icon: React.createElement(PlusSquareOutlined),
            title: t("tonieboxes.boxSetup.navigationTitle"),
            children: [
                {
                    key: "boxversioninfo",
                    label: (
                        <Link
                            to="/tonieboxes/boxsetup/boxversioninfo"
                            onClick={() => {
                                setNavOpen(false);
                                setSubNavOpen(false);
                            }}
                        >
                            {t("tonieboxes.boxSetup.boxVersion.navigationTitle")}
                        </Link>
                    ),
                    icon: React.createElement(InfoCircleOutlined),
                    title: t("tonieboxes.boxSetup.boxVersion.navigationTitle"),
                },
                {
                    key: "identifyboxversion",
                    label: (
                        <Link
                            to="/tonieboxes/boxsetup/identifyboxversion"
                            onClick={() => {
                                setNavOpen(false);
                                setSubNavOpen(false);
                            }}
                        >
                            {t("tonieboxes.boxSetup.identifyVersion.navigationTitle")}
                        </Link>
                    ),
                    icon: React.createElement(SearchOutlined),
                    title: t("tonieboxes.boxSetup.identifyVersion.navigationTitle"),
                },
                {
                    key: "openbox",
                    label: (
                        <Link
                            to="/tonieboxes/boxsetup/openboxguide"
                            onClick={() => {
                                setNavOpen(false);
                                setSubNavOpen(false);
                            }}
                        >
                            {t("tonieboxes.boxSetup.openBoxGuide.navigationTitle")}
                        </Link>
                    ),
                    icon: React.createElement(OrderedListOutlined),
                    title: t("tonieboxes.boxSetup.openBoxGuide.navigationTitle"),
                },
                {
                    key: "esp32",
                    label: (
                        <Link
                            to="/tonieboxes/boxsetup/esp32/flashing"
                            style={{
                                color: "currentColor",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 50px 0 0",
                            }}
                            onClick={() => {
                                setNavOpen(false);
                                setSubNavOpen(false);
                            }}
                        >
                            {t("tonieboxes.esp32BoxFlashing.navigationTitle")}
                        </Link>
                    ),
                    icon: React.createElement(DeliveredProcedureOutlined),
                    title: t("tonieboxes.esp32BoxFlashing.navigationTitle"),
                    children: [
                        {
                            key: "esp32legacy",
                            label: (
                                <Link
                                    to="/tonieboxes/boxsetup/esp32/legacy"
                                    onClick={() => {
                                        setNavOpen(false);
                                        setSubNavOpen(false);
                                    }}
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: "currentColor",
                                    }}
                                >
                                    {t("tonieboxes.esp32BoxFlashing.legacy.navigationTitle")}
                                </Link>
                            ),
                            icon: React.createElement(DeliveredProcedureOutlined),
                            title: t("tonieboxes.esp32BoxFlashing.legacy.navigationTitle"),
                        },
                    ],
                },
                {
                    key: "cc3200",
                    label: (
                        <Link
                            to="/tonieboxes/boxsetup/cc3200/flashing"
                            onClick={() => {
                                setNavOpen(false);
                                setSubNavOpen(false);
                            }}
                        >
                            {t("tonieboxes.cc3200BoxFlashing.navigationTitle")}
                        </Link>
                    ),
                    icon: React.createElement(DeliveredProcedureOutlined),
                    title: t("tonieboxes.cc3200BoxFlashing.navigationTitle"),
                },
                {
                    key: "cc3235",
                    label: (
                        <Link
                            to="/tonieboxes/boxsetup/cc3235/flashing"
                            onClick={() => {
                                setNavOpen(false);
                                setSubNavOpen(false);
                            }}
                        >
                            {t("tonieboxes.cc3235BoxFlashing.navigationTitle")}
                        </Link>
                    ),
                    icon: React.createElement(DeliveredProcedureOutlined),
                    title: t("tonieboxes.cc3235BoxFlashing.navigationTitle"),
                },
            ],
        },
        ...pluginItems,
    ];

    return (
        <StyledSubMenu
            mode="inline"
            defaultOpenKeys={["sub"]}
            openKeys={openKeys}
            selectedKeys={[]}
            onOpenChange={onOpenChange}
            items={subnav}
            expandIcon={({ isOpen }) => customExpandIcon({ isOpen })}
        />
    );
};
