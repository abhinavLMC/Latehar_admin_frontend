import React from "react";
import { Input, Card } from "antd";

// Define props for VitalsForm
interface VitalsFormProps {
  vitals: {
    temperature: string;
    systolicBP: string;
    diastolicBP: string;
    spo2: string;
    bmi: string;
    height: string;
    weight: string;
    haemoglobin: string;
    bloodSugar: string;
    pulse: string;
  };
  setVitals: (vitals: any) => void;
}

const VitalsForm: React.FC<VitalsFormProps> = ({ vitals, setVitals }) => {
  return (
    <Card style={{ marginTop: "20px", padding: "15px" }}>
      <h3>Vitals</h3>

      <label>Temperature:</label>
      <Input
        value={vitals?.temperature}
        placeholder="Enter temperature"
        onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
      />

      <label>Blood Pressure (Systolic):</label>
      <Input
        value={vitals?.systolicBP}
        placeholder="Enter systolic BP"
        onChange={(e) => setVitals({ ...vitals, systolicBP: e.target.value })}
      />

      <label>Blood Pressure (Diastolic):</label>
      <Input
        value={vitals?.diastolicBP}
        placeholder="Enter diastolic BP"
        onChange={(e) => setVitals({ ...vitals, diastolicBP: e.target.value })}
      />

      <label>SPO2:</label>
      <Input
        value={vitals?.spo2}
        placeholder="Enter SPO2"
        onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
      />

      <label>BMI:</label>
      <Input
        value={vitals?.bmi}
        placeholder="Enter BMI"
        onChange={(e) => setVitals({ ...vitals, bmi: e.target.value })}
      />

      <label>Height (cm):</label>
      <Input
        value={vitals?.height}
        placeholder="Enter height"
        onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
      />

      <label>Weight (kg):</label>
      <Input
        value={vitals?.weight}
        placeholder="Enter weight"
        onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
      />

      <label>Haemoglobin (g/dl): </label>
      <Input
        value={vitals?.haemoglobin}
        placeholder="Enter Haemoglobin"
        onChange={(e) => setVitals({ ...vitals, haemoglobin: e.target.value })}
      />

      <label>Blood Sugar (mg/dl): </label>
      <Input
        value={vitals?.bloodSugar}
        placeholder="Enter Blood Sugar"
        onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })}
      />
      <label>Pulse (BPM):</label>
      <Input
        value={vitals?.pulse}
        placeholder="Enter Pulse"
        onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
      />

    </Card>
  );
};

export default VitalsForm;
