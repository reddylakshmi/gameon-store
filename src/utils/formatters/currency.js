import { appConfig } from "../../config/appConfig";

export const currency = new Intl.NumberFormat(appConfig.currency.locale, {
  style: "currency",
  currency: appConfig.currency.code
});
