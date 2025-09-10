import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard.home");

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t("title")}</h1>
      <p className="text-text-secondary mt-2">{t("subtitle")}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          This is the main dashboard overview page. It will display key metrics, recent reservations, and quick actions.
        </p>
      </div>
    </div>
  );
}
