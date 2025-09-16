import { useTranslations } from "next-intl";

interface DayViewPageProps {
  params: Promise<{
    restaurantId: string;
    date: string;
  }>;
}

export default async function DayViewPage({ params }: DayViewPageProps) {
  const { restaurantId, date } = await params;
  const t = useTranslations("dashboard.dayView");

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t("title")}</h1>
      <p className="text-text-secondary mt-2">{t("subtitle", { date: date })}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Day view for restaurant: <span className="font-mono text-primary">{restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          Date: <span className="font-mono text-primary">{date}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will display detailed reservation management for a specific date.
        </p>
      </div>
    </div>
  );
}
