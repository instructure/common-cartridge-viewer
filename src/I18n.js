import { useLingui } from "@lingui/react";

export default function I18n({ children }) {
  const { i18n } = useLingui();
  return children({ i18n });
}
