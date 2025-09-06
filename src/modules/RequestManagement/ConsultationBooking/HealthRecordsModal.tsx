import React from "react";
import { Modal, List, Button } from "antd";

interface HealthRecord {
  temperature_unit?: string;
  blood_pressure_unit?: {
    systolic_bp_unit?: string;
    diastolic_bp_unit?: string;
  };
  spo2_unit?: string;
  [key: string]: any; // For any additional fields
}

interface HealthRecordsModalProps {
  records: HealthRecord[];
  visible: boolean;
  onClose: () => void;
  onAutoFill: (record: HealthRecord) => void; // Callback to autofill selected record
}

const HealthRecordsModal: React.FC<HealthRecordsModalProps> = ({
  records,
  visible,
  onClose,
  onAutoFill,
}) => {
  return (
    <Modal
      title="Health Records"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        dataSource={records}
        renderItem={(record) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <p>
                <strong>Temperature:</strong>{" "}
                {record.temperature_unit || "N/A"}
              </p>
              <p>
                <strong>Blood Pressure:</strong>{" "}
                {record.blood_pressure_unit
                  ? `${record.blood_pressure_unit.systolic_bp_unit || "N/A"} / ${
                      record.blood_pressure_unit.diastolic_bp_unit || "N/A"
                    }`
                  : "N/A"}
              </p>
              <p>
                <strong>SPO2:</strong> {record.spo2_unit || "N/A"}
              </p>
              {/* Button to autofill */}
              <Button
                type="link"
                onClick={() => onAutoFill(record)}
                style={{ paddingLeft: 0 }}
              >
                Autofill
              </Button>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default HealthRecordsModal;
