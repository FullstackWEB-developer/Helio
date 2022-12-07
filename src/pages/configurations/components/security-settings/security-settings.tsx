import Button from "@components/button/button";
import { ControlledInput } from "@components/controllers";
import { useForm } from "react-hook-form";
import "./security-settings.scss";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import {
  getSecuritySettings,
  saveSecuritySettings,
} from "@shared/services/lookups.service";
import { SecuritySettings } from "@pages/configurations/models/security-settings";
import { addSnackbarMessage } from "@shared/store/snackbar/snackbar.slice";
import { SnackbarType } from "@components/snackbar/snackbar-type.enum";
import Spinner from "@components/spinner/Spinner";
import { useDispatch } from "react-redux";
import { GetSecuritySettings } from "@constants/react-query-constants";
import { useEffect, useState } from "react";
import utils from "@shared/utils/utils";

const SecuritySettingsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>();
  const [isDirty, setDirty] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    watch,
  } = useForm({ mode: "all" });
  const { isFetching } = useQuery<SecuritySettings>(
    GetSecuritySettings,
    getSecuritySettings,
    {
      onSuccess: (response) => {
        const secSettings: SecuritySettings = {
          hipaaVerificationRetryNumber: response.hipaaVerificationRetryNumber,
          verifiedPatientExpiresInDays: response.verifiedPatientExpiresInDays,
          medicalRecordsDownloadExpirationInDays:
            response.medicalRecordsDownloadExpirationInDays,
          redirectLinkExpirationInHours: response.redirectLinkExpirationInHours,
          verificationFailWaitInMinutes: response.verificationFailWaitInMinutes,
          guestSmsExpirationInHours: response.guestSmsExpirationInHours,
          userTimeoutDueInactivity: response.userTimeoutDueInactivity,
        };
        reset(secSettings);
        setSecuritySettings(secSettings);
      },
      onError: () => {
        dispatch(
          addSnackbarMessage({
            message: "configuration.security_settings.get_error",
            type: SnackbarType.Error,
          })
        );
      },
    }
  );

  useEffect(() => {
    if (!securitySettings) {
      return;
    }
    const watchedValues: SecuritySettings = {
      hipaaVerificationRetryNumber: parseInt(
        watch("hipaaVerificationRetryNumber")
      ),
      guestSmsExpirationInHours: parseInt(watch("guestSmsExpirationInHours")),
      medicalRecordsDownloadExpirationInDays: parseInt(
        watch("medicalRecordsDownloadExpirationInDays")
      ),
      redirectLinkExpirationInHours: parseInt(
        watch("redirectLinkExpirationInHours")
      ),
      verificationFailWaitInMinutes: parseInt(
        watch("verificationFailWaitInMinutes")
      ),
      verifiedPatientExpiresInDays: parseInt(
        watch("verifiedPatientExpiresInDays")
      ),
      userTimeoutDueInactivity: parseInt(watch("userTimeoutDueInactivity")),
    };

    if (!utils.deepEqual(watchedValues, securitySettings)) {
      setDirty(true);
    } else {
      setDirty(false);
    }
  }, [watch, securitySettings]);

  const saveSecuritySettingsMutation = useMutation(saveSecuritySettings);
  const onSubmit = (form: SecuritySettings) => {
    const request: SecuritySettings = {
      hipaaVerificationRetryNumber: parseInt(
        form.hipaaVerificationRetryNumber.toString()
      ),
      verifiedPatientExpiresInDays: parseInt(
        form.verifiedPatientExpiresInDays.toString()
      ),
      medicalRecordsDownloadExpirationInDays: parseInt(
        form.medicalRecordsDownloadExpirationInDays.toString()
      ),
      redirectLinkExpirationInHours: parseInt(
        form.redirectLinkExpirationInHours.toString()
      ),
      verificationFailWaitInMinutes: parseInt(
        form.verificationFailWaitInMinutes.toString()
      ),
      guestSmsExpirationInHours: parseInt(
        form.guestSmsExpirationInHours.toString()
      ),
      userTimeoutDueInactivity: parseInt(
        form.userTimeoutDueInactivity.toString()
      ),
    };
    saveSecuritySettingsMutation.mutate(request, {
      onSuccess: () => {
        dispatch(
          addSnackbarMessage({
            type: SnackbarType.Success,
            message: "configuration.security_settings.save_success",
          })
        );
        reset(request);
        setSecuritySettings(request);
      },
      onError: () => {
        dispatch(
          addSnackbarMessage({
            message: "configuration.security_settings.save_error",
            type: SnackbarType.Error,
          })
        );
      },
    });
  };
  return isFetching ? (
    <Spinner fullScreen={true} />
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-10/12 h-full p-6 overflow-auto"
    >
      <h5 className="pb-8">{t("configuration.security_settings.title")}</h5>
      <div className="mb-8 security-settings-grid">
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.hipaa_verification_retry_number_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.hipaa_verification_retry_number_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="hipaaVerificationRetryNumber"
            label="configuration.security_settings.hipaa_verification_retry_number_label"
            control={control}
            type={"number"}
            defaultValue={0}
          ></ControlledInput>
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.hipaa_verification_retry_number_type"
            )}
          </label>
        </div>
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.verified_patient_expires_in_days_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.verified_patient_expires_in_days_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="verifiedPatientExpiresInDays"
            label="configuration.security_settings.verified_patient_expires_in_days_label"
            control={control}
            type={"number"}
            defaultValue={0}
          ></ControlledInput>
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.verified_patient_expires_in_days_type"
            )}
          </label>
        </div>
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.verification_fail_wait_in_minutes_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.verification_fail_wait_in_minutes_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="verificationFailWaitInMinutes"
            label="configuration.security_settings.verification_fail_wait_in_minutes_label"
            control={control}
            type={"number"}
            defaultValue={0}
          ></ControlledInput>
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.verification_fail_wait_in_minutes_type"
            )}
          </label>
        </div>
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.medical_records_download_expiration_in_days_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.medical_records_download_expiration_in_days_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="medicalRecordsDownloadExpirationInDays"
            data-testid="medicalRecordsDownloadExpirationInDays"
            label="configuration.security_settings.medical_records_download_expiration_in_days_label"
            control={control}
            type={"number"}
            defaultValue={0}
          ></ControlledInput>
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.medical_records_download_expiration_in_days_type"
            )}
          </label>
        </div>
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.redirect_link_expiration_in_hours_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.redirect_link_expiration_in_hours_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="redirectLinkExpirationInHours"
            label="configuration.security_settings.redirect_link_expiration_in_hours_label"
            control={control}
            type={"number"}
            defaultValue={0}
          ></ControlledInput>
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.redirect_link_expiration_in_hours_type"
            )}
          </label>
        </div>
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.guest_sms_expiration_in_hours_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.guest_sms_expiration_in_hours_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="guestSmsExpirationInHours"
            label="configuration.security_settings.guest_sms_expiration_in_hours_label"
            control={control}
            type={"number"}
            defaultValue={0}
          ></ControlledInput>
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.guest_sms_expiration_in_hours_type"
            )}
          </label>
        </div>
        <div>
          <p className="subtitle2">
            {t(
              "configuration.security_settings.user_timeout_inactivity_in_minutes_title"
            )}
          </p>
          <p className="body2-medium">
            {t(
              "configuration.security_settings.user_timeout_inactivity_in_minutes_description"
            )}
          </p>
        </div>
        <div className="flex flex-col body3-medium">
          <ControlledInput
            name="userTimeoutDueInactivity"
            label="configuration.security_settings.user_timeout_inactivity_in_minutes_label"
            control={control}
            type="number"
            defaultValue={30}
            max={120}
            min={10}
          />
          <label className="ml-4 -mt-4">
            {t(
              "configuration.security_settings.user_timeout_inactivity_in_minutes_type"
            )}
          </label>
        </div>
      </div>
      <div className="flex flex-row">
        <Button
          data-testid="submit"
          type="submit"
          buttonType="medium"
          disabled={!isValid || !isDirty}
          label="common.save"
          isLoading={saveSecuritySettingsMutation.isLoading}
        />
        <Button
          label="common.cancel"
          data-testid="reset"
          className="ml-8 "
          buttonType="secondary"
          onClick={() => reset()}
          disabled={saveSecuritySettingsMutation.isLoading}
        />
      </div>
    </form>
  );
};
export default SecuritySettingsScreen;
