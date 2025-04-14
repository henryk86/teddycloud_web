import { useTranslation } from "react-i18next";
import { Typography } from "antd";

import { StyledContent } from "../components/StyledComponents";
import { TonieMeetingElement } from "../components/TonieMeeting";

const { Paragraph } = Typography;

export const Error404Page = () => {
    const { t } = useTranslation();

    return (
        <div id="error-404">
            <StyledContent>
                <Paragraph>
                    <TonieMeetingElement
                        maxNoOfGuests={100}
                        toniesSize={150}
                        showQuestionMark={true}
                        title={t("404.title")}
                        description={t("404.description")}
                    ></TonieMeetingElement>
                </Paragraph>
            </StyledContent>
        </div>
    );
};
