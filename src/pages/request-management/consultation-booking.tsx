// pages/request-management/consultation-booking.tsx
import React from "react";
import { useRouter } from "next/router";
import ConsultationBookingPage from "../../modules/RequestManagement/ConsultationBooking/ConsultationBookingPage"; // Adjust path as needed

const ConsultationBooking: React.FC = () => {
  const router = useRouter();
  const { requestId } = router.query;

  return (
    <div>
      {/* Render the ConsultationBookingPage Component */}
      <ConsultationBookingPage />
    </div>
  );
};

export default ConsultationBooking;
