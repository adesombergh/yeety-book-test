import { useTranslations } from "next-intl";

interface CalendarPageProps {
  params: {
    restaurantId: string;
  };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const t = useTranslations("dashboard.calendar");

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t("title")}</h1>
      <p className="text-text-secondary mt-2">{t("subtitle")}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Calendar view for restaurant: <span className="font-mono text-primary">{params.restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will display a calendar interface for managing reservations by date.
        </p>
      </div>
    </div>
  );
}
