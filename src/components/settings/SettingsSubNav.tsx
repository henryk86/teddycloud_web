import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MenuProps } from "antd";
import {
    SafetyCertificateOutlined,
    SettingOutlined,
    PoweroffOutlined,
    FileSearchOutlined,
    SyncOutlined,
    HistoryOutlined,
    BellOutlined,
    CodeSandboxOutlined,
} from "@ant-design/icons";
import i18n from "../../i18n";

import { TeddyCloudApi } from "../../api";
import { defaultAPIConfig } from "../../config/defaultApiConfig";

import { StyledSubMenu } from "../StyledComponents";
import { restartServer } from "../../utils/restartServer";
import { useTeddyCloud } from "../../TeddyCloudContext";
import { NotificationTypeEnum } from "../../types/teddyCloudNotificationTypes";
import { TeddyCloudSection } from "../../types/pluginsMetaTypes";

const api = new TeddyCloudApi(defaultAPIConfig());

export const SettingsSubNav = () => {
    const { t } = useTranslation();
    const { setNavOpen, setSubNavOpen, setCurrentTCSection, plugins } = useTeddyCloud();
    const { addNotification, addLoadingNotification, closeLoadingNotification } = useTeddyCloud();
    const currentLanguage = i18n.language;
    const [selectedKey, setSelectedKey] = useState("");
    useEffect(() => {
        setCurrentTCSection(t("settings.navigationTitle"));
    }, [currentLanguage]);

    const pluginItems = plugins
        .filter((p) => p.teddyCloudSection === TeddyCloudSection.Settings)
        .map((plugin) => ({
            key: `plugin-${plugin.pluginId}`,
            label: (
                <Link
                    to={`/settings/plugin/${plugin.pluginId}`}
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

    const extractBaseUrl = (fullUrl: URL) => {
        const url = new URL(fullUrl);
        const port = url.port ? `:${url.port}` : "";
        return `${url.protocol}//${url.hostname}${port}`;
    };

    const handleRestartServer = async () => {
        await restartServer(true, addNotification, addLoadingNotification, closeLoadingNotification);
        setSelectedKey("");
    };

    const handleReloadToniesJson = async () => {
        const key = "reloadToniesJson";
        addLoadingNotification(key, t("settings.toniesJsonUpdate"), t("settings.toniesJsonUpdateInProgress"));

        try {
            const response = await api.apiGetTeddyCloudApiRaw("/api/toniesJsonUpdate");
            const data = await response.text();
            setSelectedKey("");

            closeLoadingNotification(key);
            if (data.toString() !== "Triggered tonies.json update") {
                addNotification(
                    NotificationTypeEnum.Error,
                    t("settings.toniesJsonUpdateFailed"),
                    t("settings.toniesJsonUpdateFailed") + ": " + data.toString(),
                    t("settings.navigationTitle")
                );
            } else {
                addNotification(
                    NotificationTypeEnum.Success,
                    t("settings.toniesJsonUpdateSuccessful"),
                    t("settings.toniesJsonUpdateSuccessful"),
                    t("settings.navigationTitle")
                );
            }
        } catch (error) {
            addNotification(
                NotificationTypeEnum.Error,
                t("settings.toniesJsonUpdateFailed"),
                t("settings.toniesJsonUpdateFailed") + ": " + error,
                t("settings.navigationTitle")
            );
        }
    };

    const subnav: MenuProps["items"] = [
        {
            key: "general",
            label: (
                <Link
                    to="/settings"
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("settings.general.navigationTitle")}
                </Link>
            ),
            icon: React.createElement(SettingOutlined),
            title: t("settings.general.navigationTitle"),
        },
        {
            key: "certificates",
            label: (
                <Link
                    to="/settings/certificates"
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("settings.certificates.navigationTitle")}
                </Link>
            ),
            icon: React.createElement(SafetyCertificateOutlined),
            title: t("settings.certificates.navigationTitle"),
        },
        {
            key: "rtnl",
            label: (
                <Link
                    to="/settings/rtnl"
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("settings.rtnl.navigationTitle")}
                </Link>
            ),
            icon: React.createElement(FileSearchOutlined),
            title: t("settings.rtnl.navigationTitle"),
        },
        {
            key: "notifications",
            label: (
                <Link
                    to="/settings/notifications"
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("settings.notifications.navigationTitle")}
                </Link>
            ),
            icon: React.createElement(BellOutlined),
            title: t("settings.notifications.navigationTitle"),
        },
        {
            key: "reload_toniesJson",
            label: <label style={{ cursor: "pointer" }}>{t("settings.toniesJsonUpdate")}</label>,
            onClick: () => {
                handleReloadToniesJson();
                setNavOpen(false);
                setSubNavOpen(false);
            },
            icon: React.createElement(SyncOutlined),
            title: t("settings.toniesJsonUpdate"),
        },
        {
            key: "restart_server",
            label: <label style={{ cursor: "pointer" }}>{t("settings.restartServer")}</label>,
            onClick: () => {
                handleRestartServer();
                setNavOpen(false);
                setSubNavOpen(false);
            },
            icon: React.createElement(PoweroffOutlined),
            title: t("settings.restartServer"),
        },
        {
            key: "legacy",
            label: (
                <Link
                    to={`${extractBaseUrl(new URL(window.location.href))}/legacy.html`}
                    target="_blank"
                    onClick={() => {
                        setNavOpen(false);
                        setSubNavOpen(false);
                    }}
                >
                    {t("settings.legacyGui")}
                </Link>
            ),
            icon: React.createElement(HistoryOutlined),
            title: t("settings.legacyGui"),
        },
        ...pluginItems,
    ];

    return <StyledSubMenu mode="inline" selectedKeys={[selectedKey]} defaultOpenKeys={["sub"]} items={subnav} />;
};
