import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select, message } from "antd";
import type { SelectProps } from "antd";
import { TonieInfo } from "./TonieCard";

export const TonieArticleSearch: React.FC<{
    placeholder: string;
    onChange: (newValue: string) => void;
}> = (props) => {
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState<SelectProps["options"]>([]);
    const [value, setValue] = useState<string>();
    const [tonieInfos, setTonieInfos] = useState<TonieInfo[]>();

    const handleSearch = async (search: string) => {
        const searchEncode = encodeURIComponent(search);
        const url =
            process.env.REACT_APP_TEDDYCLOUD_API_URL +
            "/api/toniesJsonSearch?" +
            "searchModel=" +
            searchEncode +
            "&searchSeries=" +
            searchEncode +
            "&searchEpisode=" +
            searchEncode;
        try {
            const response = await fetch(url, {});
            if (!response.ok) {
                throw new Error(response.status + " " + response.statusText);
            }
            const data = await response.json();
            setTonieInfos(data);
            const result = data.map((item: TonieInfo) => ({
                value: item.model,
                text: "[" + item.model + "] " + item.series + " - " + item.episode,
            }));
            setData(result);
        } catch (error) {
            message.error(t("tonieArticleSearch.failedToFetchSearchResults") + error);
            return;
        }
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
        props.onChange(newValue);
    };

    return (
        <Select
            showSearch
            value={value}
            placeholder={props.placeholder}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={(data || []).map((d) => ({
                value: d.value,
                label: d.text,
            }))}
        />
    );
};
