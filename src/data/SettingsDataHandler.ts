import { Dispatch, SetStateAction } from "react";
import { t, TFunction } from "i18next";
import { TeddyCloudApi } from "../api/apis/TeddyCloudApi";
import { defaultAPIConfig } from "../config/defaultApiConfig";
import { NotificationTypeEnum } from "../types/teddyCloudNotificationTypes";

export interface Setting {
    description: string;
    iD: string;
    label: string;
    overlayed: boolean | undefined;
    shortname: string;
    type: string;
    value: boolean | string | number;
    initialValue?: boolean | string | number;
    initialOverlayed?: boolean | undefined;
    overlayId?: string;
}

const api = new TeddyCloudApi(defaultAPIConfig());

export default class SettingsDataHandler {
    private static instance: SettingsDataHandler | undefined = undefined;
    private settings: Setting[] = [];
    private unsavedChanges: boolean = false;
    private listeners: (() => void)[] = [];
    private idListeners: { iD: string; listener: () => {} }[] = [];
    private addNotification!: (type: NotificationTypeEnum, message: string, description: string, title: string) => void;
    private t!: TFunction;
    private setFetchCloudStatus!: Dispatch<SetStateAction<boolean>> | undefined;

    private constructor() {}

    public static initialize(
        addNotification: (type: NotificationTypeEnum, message: string, description: string, title: string) => void,
        t: TFunction,
        setFetchCloudStatus?: Dispatch<SetStateAction<boolean>>
    ) {
        if (!SettingsDataHandler.instance) {
            SettingsDataHandler.instance = new SettingsDataHandler();
            SettingsDataHandler.instance.addNotification = addNotification;
            SettingsDataHandler.instance.t = t;
            SettingsDataHandler.instance.setFetchCloudStatus = setFetchCloudStatus || undefined;
        }
        return SettingsDataHandler.instance;
    }

    public hasUnchangedChanges() {
        return this.unsavedChanges;
    }

    public static getInstance() {
        if (!SettingsDataHandler.instance) {
            throw new Error("SettingsDataHandler not initialized. Call initialize() first.");
        }
        return SettingsDataHandler.instance;
    }

    //initialize settings from server
    public initializeSettings(data: Setting[], overlayId: string | undefined) {
        data.forEach((setting) => {
            setting.initialValue = setting.value;
            setting.initialOverlayed = setting.overlayed !== undefined ? setting.overlayed : undefined;
            setting.overlayId = overlayId;
        });
        this.settings = data;
    }

    public addListener(listener: () => void) {
        if (!this.listeners.find((currentListener) => currentListener === listener)) {
            this.listeners.push(listener);
        }
    }

    removeListener(listener: () => void) {
        this.listeners.filter((currentListener) => currentListener !== listener);
    }

    public addIdListener(listener: () => void, iD: string) {
        if (!this.idListeners.find((element) => element.listener === listener)) {
            this.listeners.push(listener);
        }
    }

    removeIdListener(listener: () => void) {
        this.idListeners.filter((element) => element.listener !== listener);
    }

    private callAllListeners() {
        this.listeners.forEach((listener) => listener());
    }

    public async saveAll() {
        const triggerWriteConfig = async () => {
            await api.apiTriggerWriteConfigGet();
        };

        const savePromises = this.settings.map(async (setting) => {
            if (setting.initialValue !== setting.value || setting.initialOverlayed !== setting.overlayed) {
                return this.saveSingleSetting(setting);
            }
        });

        try {
            await Promise.all(savePromises);
            await triggerWriteConfig();
            this.settings.forEach((setting) => {
                setting.initialValue = setting.value;
                setting.initialOverlayed = setting.overlayed !== undefined ? setting.overlayed : undefined;
            });
            this.unsavedChanges = false;
            this.callAllListeners();
        } catch (e) {
            this.addNotification(
                NotificationTypeEnum.Error,
                t("settings.errorWhileSavingConfig"),
                t("settings.errorWhileSavingConfigDetails") + e,
                t("settings.navigationTitle")
            );
        }
    }

    private saveSingleSetting(setting: Setting) {
        try {
            const reset = setting.overlayId !== undefined && setting.overlayed === false ? true : false;

            return api
                .apiPostTeddyCloudSetting(setting.iD, setting.value, setting.overlayId, reset)
                .then(() => {
                    this.addNotification(
                        NotificationTypeEnum.Success,
                        t("settings.saved"),
                        reset
                            ? t("settings.resetToTCDetails", {
                                  setting: setting.label,
                                  overlay: setting.overlayId !== undefined ? ` [${setting.overlayId}]` : "",
                              })
                            : t("settings.saveDetails", {
                                  setting: setting.label,
                                  overlay: setting.overlayId !== undefined ? ` [${setting.overlayId}]` : "",
                              }),
                        setting.overlayId === undefined
                            ? t("settings.navigationTitle")
                            : t("tonieboxes.navigationTitle")
                    );
                })
                .then(() => {
                    if (setting.iD === "cloud.enabled" && this.setFetchCloudStatus) {
                        this.setFetchCloudStatus((prev) => !prev);
                    }
                })
                .catch((e) => {
                    this.addNotification(
                        NotificationTypeEnum.Error,
                        t("settings.errorWhileSavingConfig") + setting.label,
                        t("settings.errorWhileSavingConfigDetails") + e,
                        setting.overlayId === undefined
                            ? t("settings.navigationTitle")
                            : t("tonieboxes.navigationTitle")
                    );
                });
        } catch (e) {
            this.addNotification(
                NotificationTypeEnum.Error,
                t("settings.errorWhileSavingConfig") + setting.label,
                t("settings.errorWhileSavingConfigDetails") + e,
                setting.overlayId === undefined ? t("settings.navigationTitle") : t("tonieboxes.navigationTitle")
            );
            return Promise<null>;
        }
    }

    public resetAll() {
        this.settings.forEach((setting) => {
            setting.value = setting.initialValue ?? "";
            setting.overlayed = setting.initialOverlayed !== undefined ? setting.initialOverlayed : undefined;
        });

        this.unsavedChanges = false;
        this.callAllListeners();
        this.idListeners.forEach((element) => element.listener());
    }

    public getSetting(iD: string) {
        return this.settings.find((setting) => setting.iD === iD);
    }

    public changeSetting(iD: string, newValue: boolean | string | number, overlayed: boolean | undefined) {
        const settingToChange = this.settings.find((setting) => setting.iD === iD);
        if (settingToChange) {
            if (typeof settingToChange.initialValue === typeof newValue) {
                settingToChange.value = newValue;
                if (settingToChange.initialValue === settingToChange.value) {
                    this.unsavedChanges = false;
                    this.settings.forEach((setting) => {
                        if (setting.initialValue !== setting.value) {
                            this.unsavedChanges = true;
                        }
                        if (setting.initialOverlayed !== setting.overlayed) {
                            this.unsavedChanges = true;
                        }
                    });
                } else {
                    this.unsavedChanges = true;
                }
                this.idListeners
                    .filter((element) => element.iD === iD)
                    .forEach((element) => {
                        element.listener();
                    });
                this.callAllListeners();
            } else {
                console.warn("The type of newValue and initialValue for '" + iD + "' do not match! Omitting.");
            }
        } else {
            console.warn("Unknown setting '" + iD + "' to be changed. Omitting.");
        }
    }

    public changeSettingOverlayed(iD: string, newOverlayed: boolean) {
        const settingToChange = this.settings.find((setting) => setting.iD === iD);
        if (settingToChange) {
            settingToChange.overlayed = newOverlayed;
            if (newOverlayed === false) {
                const fetchFieldValue = () => {
                    try {
                        api.apiGetTeddyCloudSettingRaw(iD)
                            .then((response) => response.text())
                            .then((fieldValue) => {
                                let typedFieldValue: boolean | number | string;

                                if (settingToChange.type === "bool") {
                                    typedFieldValue = fieldValue === "true";
                                } else if (settingToChange.type === "uint") {
                                    typedFieldValue = parseInt(fieldValue, 10);
                                    if (isNaN(typedFieldValue)) {
                                        console.warn(
                                            `Expected a number for setting type "uint", but got "${fieldValue}". Defaulting to 0.`
                                        );
                                        typedFieldValue = 0;
                                    }
                                } else {
                                    typedFieldValue = fieldValue;
                                }

                                this.changeSetting(iD, typedFieldValue, newOverlayed);
                            })
                            .catch((error) => {
                                this.addNotification(
                                    NotificationTypeEnum.Error,
                                    t("settings.errorFetchingFieldValue"),
                                    t("settings.errorFetchingFieldValueDetails", {
                                        setting: settingToChange.label,
                                        overlay:
                                            settingToChange.overlayId !== undefined
                                                ? ` [${settingToChange.overlayId}]`
                                                : "",
                                    }) + error,
                                    settingToChange.overlayId === undefined
                                        ? t("settings.navigationTitle")
                                        : t("tonieboxes.navigationTitle")
                                );
                            });
                    } catch (error) {
                        this.addNotification(
                            NotificationTypeEnum.Error,
                            t("settings.errorFetchingFieldValue"),
                            t("setting.errorFetchingFieldValueDetails", {
                                setting: settingToChange.label,
                                overlay:
                                    settingToChange.overlayId !== undefined ? ` [${settingToChange.overlayId}]` : "",
                            }) + error,
                            settingToChange.overlayId === undefined
                                ? t("settings.navigationTitle")
                                : t("tonieboxes.navigationTitle")
                        );
                    }
                };

                fetchFieldValue();
            }

            if (settingToChange.initialOverlayed === settingToChange.overlayed) {
                this.unsavedChanges = false;
                this.settings.forEach((setting) => {
                    if (setting.initialValue !== setting.value) {
                        this.unsavedChanges = true;
                    }
                    if (setting.initialOverlayed !== setting.overlayed) {
                        this.unsavedChanges = true;
                    }
                });
            } else {
                this.unsavedChanges = true;
            }
            this.idListeners
                .filter((element) => element.iD === iD)
                .forEach((element) => {
                    element.listener();
                });
            this.callAllListeners();
        } else {
            console.warn("Unknown setting '" + iD + "' to be changed. Omitting.");
        }
    }
}
