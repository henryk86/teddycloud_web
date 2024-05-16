import { useTranslation } from "react-i18next";

import {
    HiddenDesktop,
    StyledBreadcrumb,
    StyledContent,
    StyledLayout,
    StyledSider,
} from "../../components/StyledComponents";
import { TonieboxesSubNav } from "../../components/tonieboxes/TonieboxesSubNav";
import { Alert, Typography } from "antd";
import { Link } from "react-router-dom";

const { Paragraph } = Typography;

export const ESP32BoxFlashing = () => {
    const { t } = useTranslation();

    return (
        <>
            <StyledSider>
                <TonieboxesSubNav />
            </StyledSider>
            <StyledLayout>
                <HiddenDesktop>
                    <TonieboxesSubNav />
                </HiddenDesktop>
                <StyledBreadcrumb
                    items={[
                        { title: t("home.navigationTitle") },
                        { title: t("tonieboxes.esp32BoxFlashing.navigationTitle") },
                    ]}
                />
                <StyledContent>
                    <h1>{t(`tonieboxes.esp32BoxFlashing.title`)}</h1>
                    <Paragraph>
                        <Alert
                            message={t("settings.information")}
                            description=<div>
                                Development still in progress - Please use legacy{" "}
                                <Link to={process.env.REACT_APP_TEDDYCLOUD_API_URL + ""} target="_blank">
                                    TeddyCloud Administration GUI
                                </Link>{" "}
                                till development is completed.
                            </div>
                            type="info"
                            showIcon
                        />
                    </Paragraph>
                </StyledContent>
            </StyledLayout>
        </>
    );
};
