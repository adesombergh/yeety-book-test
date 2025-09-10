import { useTranslations } from "next-intl";

interface ReservationDetailPageProps {
  params: {
    restaurantId: string;
    id: string;
  };
}

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const t = useTranslations("dashboard.reservationDetail");

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-dark">{t("title")}</h1>
      <p className="text-text-secondary mt-2">{t("subtitle", { id: params.id })}</p>

      <div className="mt-8 p-6 border border-border rounded-lg bg-background">
        <p className="text-text-secondary">
          Reservation detail for restaurant: <span className="font-mono text-primary">{params.restaurantId}</span>
        </p>
        <p className="text-text-secondary mt-2">
          Reservation ID: <span className="font-mono text-primary">{params.id}</span>
        </p>
        <p className="text-text-secondary mt-2">
          This page will display detailed information and management options for a specific reservation.
        </p>
      </div>
    </div>
  );
}
