"use client";

import { CateringWidget } from "@swift-food-services/catering-widget";
import type { InitialData } from "@swift-food-services/catering-widget";

export default function CateringWidgetClient({
  initialData,
  stickyTopOffset = 0,
}: {
  initialData?: InitialData;
  stickyTopOffset?: number;
}) {
  return (
    <CateringWidget
      aiEnabled
      publishableKey={process.env.NEXT_PUBLIC_SWIFT_CATERING_PUBLISHABLE_KEY!}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}
      stickyTopOffset={stickyTopOffset}
      initialData={initialData}
      theme={{
        primary: "#bd2429",
      }}
      onError={(e) => {
        console.error("catering widget error", e);
      }}
    />
  );
}
