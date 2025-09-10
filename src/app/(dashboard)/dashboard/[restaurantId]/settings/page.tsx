import { useTranslations } from "next-intl";

interface SettingsPageProps {
  params: {
    restaurantId: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const t = useTranslations("dashboard.settings");

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t("title")}</h1>
      <p className="text-text-secondary mt-2">{t("subtitle")}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Settings for restaurant: <span className="font-mono text-primary">{params.restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will contain restaurant configuration options, business hours, table management, and other preferences.
        </p>
      </div>
    </div>
  );
}
