import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useGlobalStore } from "@/store/module";
import * as api from "@/helpers/api";
import Icon from "./Icon";
import { generateDialog } from "./Dialog";
import LocaleSelect from "./LocaleSelect";
import AppearanceSelect from "./AppearanceSelect";

type Props = DialogProps;

const UpdateCustomizedProfileDialog: React.FC<Props> = ({ destroy }: Props) => {
  const { t } = useTranslation();
  const globalStore = useGlobalStore();
  const [state, setState] = useState<CustomizedProfile>(globalStore.state.systemStatus.customizedProfile);

  const handleCloseButtonClick = () => {
    destroy();
  };

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => {
      return {
        ...state,
        name: e.target.value as string,
      };
    });
  };

  const handleLogoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => {
      return {
        ...state,
        logoUrl: e.target.value as string,
      };
    });
  };

  const handleDescriptionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => {
      return {
        ...state,
        description: e.target.value as string,
      };
    });
  };

  const handleLocaleSelectChange = (locale: Locale) => {
    setState((state) => {
      return {
        ...state,
        locale: locale,
      };
    });
  };

  const handleAppearanceSelectChange = (appearance: Appearance) => {
    setState((state) => {
      return {
        ...state,
        appearance: appearance,
      };
    });
  };

  const handleRestoreButtonClick = () => {
    setState({
      name: "memos",
      logoUrl: "/logo.webp",
      description: "",
      locale: "en",
      appearance: "system",
      externalUrl: "",
    });
  };

  const handleSaveButtonClick = async () => {
    if (state.name === "") {
      toast.error("Please fill server name");
      return;
    }

    try {
      await api.upsertSystemSetting({
        name: "customized-profile",
        value: JSON.stringify(state),
      });
      await globalStore.fetchSystemStatus();
    } catch (error) {
      console.error(error);
      return;
    }
    toast.success(t("message.succeed-update-customized-profile"));
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">{t("setting.system-section.customize-server.title")}</p>
        <button className="btn close-btn" onClick={handleCloseButtonClick}>
          <Icon.X />
        </button>
      </div>
      <div className="dialog-content-container !w-80">
        <p className="text-sm mb-1">
          {t("setting.system-section.server-name")}
          <span className="text-sm text-gray-400 ml-1">({t("setting.system-section.customize-server.default")})</span>
        </p>
        <input type="text" className="input-text" value={state.name} onChange={handleNameChanged} />
        <p className="text-sm mb-1 mt-2">{t("setting.system-section.customize-server.icon-url")}</p>
        <input type="text" className="input-text" value={state.logoUrl} onChange={handleLogoUrlChanged} />
        <p className="text-sm mb-1 mt-2">Description</p>
        <input type="text" className="input-text" value={state.description} onChange={handleDescriptionChanged} />
        <p className="text-sm mb-1 mt-2">Server locale</p>
        <LocaleSelect className="w-full" value={state.locale} onChange={handleLocaleSelectChange} />
        <p className="text-sm mb-1 mt-2">Server appearance</p>
        <AppearanceSelect className="w-full" value={state.appearance} onChange={handleAppearanceSelectChange} />
        <div className="mt-4 w-full flex flex-row justify-between items-center space-x-2">
          <div className="flex flex-row justify-start items-center">
            <button className="btn-normal" onClick={handleRestoreButtonClick}>
              {t("common.restore")}
            </button>
          </div>
          <div className="flex flex-row justify-end items-center">
            <button className="btn-text" onClick={handleCloseButtonClick}>
              {t("common.cancel")}
            </button>
            <button className="btn-primary" onClick={handleSaveButtonClick}>
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function showUpdateCustomizedProfileDialog() {
  generateDialog(
    {
      className: "update-customized-profile-dialog",
      dialogName: "update-customized-profile-dialog",
    },
    UpdateCustomizedProfileDialog
  );
}

export default showUpdateCustomizedProfileDialog;
