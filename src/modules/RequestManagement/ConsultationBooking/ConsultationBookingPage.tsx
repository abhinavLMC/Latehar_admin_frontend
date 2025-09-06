import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input, Button, Card, message, Select, DatePicker, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs"; // ✅ Import Day.js
import VitalsForm from "./VitalsForm"; // ✅ Include the vitals form
import { ALL_API_OBJECT, MOBILE_API_BASE_URL } from "@constants/ApiConstant";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler"; // ✅ Use Request Handlers

const { Option } = Select;

// Define Health Record Interface
interface HealthRecord {
  id: number;
  createdAt: string;
  selected_test?: {
    haemoglobin_unit: any;
    random_blood_sugar_unit?: any;
    temperature_unit?: { value: string; units?: string };
    blood_pressure_unit?: {
      systolic_bp_unit?: { value: string; units?: string };
      diastolic_bp_unit?: { value: string; units?: string };
    };
    spo2_unit?: { value: string; units?: string };
    bmi_unit?: { value: string; units?: string; height?: number; weight?: number };
    pulse_unit?:{ value: string; units?: string }; 
  };
}

// Define Doctor Interface
interface Doctor {
  User?: {username?: string}; 
  id: number;
  username: string;
  qualification: string;
}

const ConsultationBookingPage: React.FC = () => {
  const router = useRouter();
  const { requestId, driver_id, consultation_id, centerID } = router.query;
  const [isEditing, setIsEditing] = useState(false); // ✅ New state to track rescheduling
  const [loading, setLoading] = useState(false);

  // Add state for request data and centerID
  const [requestData, setRequestData] = useState<any>(null);
  const [requestCenterID, setRequestCenterID] = useState<number | null>(null);

  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [meetingLink, setMeetingLink] = useState(".");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [vitals, setVitals] = useState({
    temperature: "",
    systolicBP: "",
    diastolicBP: "",
    spo2: "",
    bmi: "",
    height: "",
    weight: "",
    haemoglobin: "",
    bloodSugar: "",
    pulse:""
  });

  // Fetch doctor list
  const { data: doctors, fetchData: fetchDoctors } = useGetRequestHandler();
  const { submit, buttonLoading } = usePostRequestHandler(); // ✅ Use Post Request Handler
  

  // Fetch request details to get centerID
  const fetchRequestDetails = async (reqId: string | string[] | undefined) => {
    if (!reqId) return;

    try {
      const response = await fetch(`${ALL_API_OBJECT["get-requests"]}/${reqId}`);
      if (!response.ok) throw new Error(`Failed to fetch request details: ${response.status}`);

      const data = await response.json();
      setRequestData(data);
      
      // Set centerID from request data or URL parameter
      if (data.centerID) {
        setRequestCenterID(data.centerID);
      } else if (centerID) {
        setRequestCenterID(Number(centerID));
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      message.error("Failed to fetch request details. Please try again later.");
    }
  };

  useEffect(() => {
    if (consultation_id) {
      setIsEditing(true);
      fetchExistingConsultation(consultation_id as string);
    }
  }, [consultation_id]);
  
  const fetchExistingConsultation = async (id: string) => {
    try {
      const response = await fetch(`${MOBILE_API_BASE_URL}/api/consultations/${id}`);
      if (!response.ok) throw new Error("Failed to fetch consultation details");
  
      const data = await response.json();
      setSelectedDoctor(data.doctor_id);
      setMeetingLink(data.meet_link);
      setSelectedDate(dayjs(data.scheduled_time));
      setSelectedTime(dayjs(data.scheduled_time));
      setVitals(data.vitals); // ✅ Populate existing vitals
    } catch (error) {
      message.error("Error fetching consultation details.");
    }
  };
  

  // Fetch health record by driver ID
  const fetchHealthRecord = async (driverId: string | string[] | undefined) => {
    if (!driverId) return;

    try {
      const response = await fetch(`${ALL_API_OBJECT["get-prevRecords"]}?driver_id=${driverId}`);
      if (!response.ok) throw new Error(`Failed to fetch health record: ${response.status}`);

      const data = await response.json();
      setHealthRecord(data);
    } catch (error) {
      console.error("Error fetching health record:", error);
      message.error("Failed to fetch health record. Please try again later.");
    }
  };

  // Populate the vitals form with test results
  const handlePopulateVitals = () => {
    if (!healthRecord || !healthRecord.selected_test) {
      message.warning("No test data available to populate.");
      return;
    }

    setVitals({
      temperature: healthRecord.selected_test.temperature_unit?.value || "",
      systolicBP: healthRecord.selected_test.blood_pressure_unit?.systolic_bp_unit?.value || "",
      diastolicBP: healthRecord.selected_test.blood_pressure_unit?.diastolic_bp_unit?.value || "",
      spo2: healthRecord.selected_test.spo2_unit?.value || "",
      bmi: healthRecord.selected_test.bmi_unit?.value || "",
      height: healthRecord.selected_test.bmi_unit?.height?.toString() || "",
      weight: healthRecord.selected_test.bmi_unit?.weight?.toString() || "",
      haemoglobin: healthRecord.selected_test.haemoglobin_unit?.value || "",
      bloodSugar: healthRecord.selected_test.random_blood_sugar_unit?.value || "",
      pulse : healthRecord.selected_test.pulse_unit?.value || ""
    });

    message.success("Vitals form populated successfully.");
  };

  // API Call to Create Consultation
  const handleCreateConsultation = async () => {
    if (!requestId || !driver_id || !selectedDoctor || !selectedDate || !selectedTime || !meetingLink) {
      console.log(requestId,driver_id,selectedDoctor,selectedDate,selectedTime,meetingLink);
      message.error("Please fill all required fields before booking.");
      return;
    }

    setLoading(true);
    const formattedDateTime = selectedDate.set("hour", selectedTime.hour()).set("minute", selectedTime.minute()).toISOString();
    const selectedDoctorData = doctors.find((doc: { id: number; }) => doc.id === selectedDoctor);

    // Define VitalsPayload interface to include optional fields
    interface VitalsPayload {
      temperature: string;
      systolicBP: string;
      diastolicBP: string;
      spo2: string;
      bmi: string;
      height: string;
      weight: string;
      haemoglobin?: string;
      bloodSugar?: string;
      pulse?: string
    }

    // Build the vitals object with required fields
    const vitalsPayload: VitalsPayload = {
      temperature: vitals?.temperature,
      systolicBP: vitals?.systolicBP,
      diastolicBP: vitals?.diastolicBP,
      spo2: vitals?.spo2,
      bmi: vitals?.bmi,
      height: vitals?.height,
      weight: vitals?.weight,
      pulse: vitals?.pulse
    };

    // Add optional fields only if they have values
    if (vitals?.haemoglobin) {
      vitalsPayload.haemoglobin = vitals.haemoglobin;
    }

    if (vitals?.bloodSugar) {
      vitalsPayload.bloodSugar = vitals.bloodSugar;
    }

    if (vitals?.pulse) {
      vitalsPayload.pulse = vitals.pulse;
    }



    const payload = {
      request_id: requestId,
      driver_id: Number(driver_id),
      isBooked: true,
      scheduled_time: formattedDateTime,
      meet_link: meetingLink,
      doctor_id: selectedDoctor,
      doctor_name: selectedDoctorData?.User?.username || "Unknown Doctor",
      // consultation_id: uuidv4(),
      vitals: vitalsPayload,
      // Include centerID if available
      ...(requestCenterID && { centerID: requestCenterID })
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch(
        `${MOBILE_API_BASE_URL}/api/consultations/${isEditing ? consultation_id : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) throw new Error(isEditing ? "Failed to reschedule consultation." : "Failed to create consultation.");
      
      message.success(isEditing ? "Consultation Rescheduled!" : "Consultation Created!");
      router.push("/consultation-management");
    } catch (error) {
      message.error("Error saving consultation.");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    if (driver_id) fetchHealthRecord(driver_id as string);
    if (requestId) fetchRequestDetails(requestId);
    fetchDoctors("/api/doctor-list");
  }, [driver_id, requestId]);

  return (
    <div>
      <h1>Consultation Booking</h1>

      {/* <label>Meet Link:</label>
      <Input placeholder="Enter meeting link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} /> */}

      {/* Doctor Selection */}
      <div style={{ marginTop: "20px" }}>
        <label>Select Doctor:</label>
            <Select style={{ width: "100%" }} placeholder="Select a doctor" value={selectedDoctor || undefined} onChange={(value) => setSelectedDoctor(value)}>
      {doctors?.map((doctor: Doctor) => (
        <Option key={doctor.id} value={doctor.id}>
          {doctor.User ? `${doctor.User.username} - ${doctor.qualification}` : `Doctor ID: ${doctor.id}`}
        </Option>
      ))}
    </Select> 
      </div>

      {/* Date & Time Picker */}
      <div style={{ marginTop: "20px" }}>
        <h3>Select Date & Time</h3>

        <label>Date:</label>
        <DatePicker style={{ width: "100%" }} value={selectedDate} onChange={(date) => setSelectedDate(date)} format="YYYY-MM-DD" />

        <label>Time:</label>
        <TimePicker style={{ width: "100%" }} value={selectedTime} onChange={(time) => setSelectedTime(time)} format="HH:mm" use12Hours />
      </div>

      {/* Display Health Record */}
      {healthRecord ? (
        <Card style={{ marginTop: "20px" }}>
          <h3>Last Health Record</h3>
          <p><strong>Test Date:</strong> {dayjs(healthRecord.createdAt).format("YYYY-MM-DD HH:mm")}</p>
          <p><strong>Temperature:</strong> {healthRecord.selected_test?.temperature_unit?.value || "N/A"} {healthRecord.selected_test?.temperature_unit?.units || ""}</p>
          <p><strong>Blood Pressure:</strong> {healthRecord.selected_test?.blood_pressure_unit?.systolic_bp_unit?.value || "N/A"}/ {healthRecord.selected_test?.blood_pressure_unit?.diastolic_bp_unit?.value || "N/A"} mm Hg</p>
          <p><strong>SPO2:</strong> {healthRecord.selected_test?.spo2_unit?.value || "N/A"} {healthRecord.selected_test?.spo2_unit?.units || ""}</p>
          <p><strong>Blood Sugar:</strong> {healthRecord.selected_test?.random_blood_sugar_unit?.value || "N/A"} {healthRecord.selected_test?.random_blood_sugar_unit?.units || ""}</p>
          <p><strong>Haemoglobin:</strong> {healthRecord.selected_test?.haemoglobin_unit?.value || "N/A"} {healthRecord.selected_test?.haemoglobin_unit?.units || ""}</p>
          <p><strong>Pulse:</strong> {healthRecord.selected_test?.pulse_unit?.value || "N/A"} {healthRecord.selected_test?.pulse_unit?.units || ""}</p>          
          <Button type="primary" onClick={handlePopulateVitals}>Populate Vitals</Button>
        </Card>
      ) : (
        <p>Loading health record...</p>
      )}

      {/* ✅ Vitals Form Displayed Here */}
      <VitalsForm vitals={vitals} setVitals={setVitals} />

      {/* Confirm Booking Button */}
      <Button type="primary" onClick={handleCreateConsultation} loading={buttonLoading} style={{ marginTop: "20px" }}>
        Confirm Booking
      </Button>
    </div>
  );
};

export default ConsultationBookingPage;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

