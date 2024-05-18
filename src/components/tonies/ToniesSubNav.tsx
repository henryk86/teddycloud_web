import { MenuProps } from "antd";
import {
    UserOutlined,
    SettingOutlined,
    BookOutlined,
    SoundOutlined,
    CloudUploadOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StyledSubMenu } from "../StyledComponents";

export const ToniesSubNav = () => {
    const { t } = useTranslation();

    const subnav: MenuProps["items"] = [
        {
            key: "tonies",
            label: <Link to="/tonies">{t("tonies.tonies.navigationTitle")}</Link>,
            icon: React.createElement(UserOutlined),
        },
        {
            key: "encoder",
            label: <Link to="/tonies/encoder">{t("tonies.encoder.navigationTitle")}</Link>,
            icon: React.createElement(CloudUploadOutlined),
        },
        {
            key: "tap",
            label: <Link to="/tonies/tap">{t("tonies.tap.navigationTitle")}</Link>,
            icon: React.createElement(UnorderedListOutlined),
        },
        {
            key: "library",
            label: <Link to="/tonies/library">{t("tonies.library.navigationTitle")}</Link>,
            icon: React.createElement(BookOutlined),
        },
        {
            key: "content",
            label: <Link to="/tonies/content">{t("tonies.content.navigationTitle")}</Link>,
            icon: React.createElement(SoundOutlined),
        },
        {
            key: "system-sounds",
            label: <Link to="/tonies/system-sounds">{t("tonies.system-sounds.navigationTitle")}</Link>,
            icon: React.createElement(SettingOutlined),
        },
    ];

    return (
        <StyledSubMenu
            mode="inline"
            //defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub"]}
            items={subnav}
        />
    );
};
