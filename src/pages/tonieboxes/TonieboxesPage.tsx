import React, { useEffect, useState } from 'react';
import { Alert } from "antd";
import { useTranslation } from 'react-i18next';
import {
  HiddenDesktop, StyledBreadcrumb, StyledContent, StyledLayout, StyledSider
} from '../../components/StyledComponents';
import { TonieboxCardProps } from '../../components/tonieboxes/TonieboxCard'; // Import the TonieboxCard component and its props type
import { defaultAPIConfig } from "../../config/defaultApiConfig";
import { TeddyCloudApi } from "../../api";
import { TonieboxesList } from '../../components/tonieboxes/TonieboxesList';
import { TonieboxesSubNav } from '../../components/tonieboxes/TonieboxesSubNav';

const api = new TeddyCloudApi(defaultAPIConfig());

export const TonieboxesPage = () => {
  const { t } = useTranslation();

  // Define the state with TonieCardProps[] type
  const [tonieboxes, setTonieboxes] = useState<TonieboxCardProps[]>([]);

  useEffect(() => {
    const fetchTonieboxes = async () => {
      // Perform API call to fetch Toniebox data
      const tonieboxData = await api.apiGetTonieboxesIndex();
      console.log(tonieboxData);
      setTonieboxes(tonieboxData);
    };

    fetchTonieboxes();
  }, []);

  return (
    <>
      <StyledSider><TonieboxesSubNav /></StyledSider>
      <StyledLayout>
        <HiddenDesktop>
          <TonieboxesSubNav />
        </HiddenDesktop>
        <StyledBreadcrumb
          items={[
            { title: t('home.navigationTitle') },
            { title: t('tonieboxes.navigationTitle') },
          ]}
        />
        <StyledContent>
          <h1>{t('tonieboxes.title')}</h1>
          <p><Alert
                          message="Warning! PoC state."
                          description= "This page is still in development and is in state of a PoC! No data is saved. Box appearance is hardcoded and if you change it, after reload of page it's reset."
                          type="warning"
                          showIcon
                    />
          </p>
          <TonieboxesList tonieboxCards={tonieboxes} />
        </StyledContent>
      </StyledLayout>
    </>
  );
};