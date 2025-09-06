import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Label } from 'recharts';
import { Modal } from 'antd'; // Assuming you're using Ant Design for Modals

// Props for the ChartComponent
interface ChartComponentProps {
  title: string; // Title for each chart
  data: { name: string, value: number }[]; // Chart data for each health metric
  redRecords: { name: string; value?: number | string; issue?: string }[]; // Red records with patient details
}

// Define colors for the Pie chart sections
const COLORS = ['#4CAF50', '#FFC107', '#F44336']; // Green, Yellow, Red

const ChartComponent: React.FC<ChartComponentProps> = ({ 
  title = 'Default Tilte',
  data = [], 
  redRecords = [] }) => {
  const [visible, setVisible] = useState(false); // Modal visibility state
  const [selectedRecord, setSelectedRecord] = useState<{ name: string; value?: number | string; issue?: string }[]>([]); // Selected patient details


  // Show Modal with red records on clicking red portions
  const handleClick = (dataIndex: number) => {
    if (dataIndex === 2) { // Assuming index 2 is the red portion
      setSelectedRecord(redRecords); // Set the redRecords to be displayed
      setVisible(true); // Show the modal
    }
  };

  // Close the modal
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{title.replace('_', ' ')}</h3> {/* Display the title of each chart */}
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          fill="#8884d8"
          onClick={(e, index) => handleClick(index)} // Handle click event
          labelLine={false} // Remove default label line
          // label={({ name, value }) => `${value.toFixed(2)}%`} // Format the label text
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value={`${title.replace('_', ' ')}`} // Add a custom label for the center
            position="center"
            style={{ fontSize: '16px', fontWeight: 'bold' }}
          />
        </Pie>
        <Tooltip />
      </PieChart>

      {/* Modal to display the red patient details */}
      <Modal
        title={`Red Records for ${title}`}
        visible={visible}
        onCancel={handleClose}
        footer={null}
      >
        {selectedRecord.length > 0 ? (
          <ul>
            {selectedRecord.map((record, idx) => (
              <li key={idx}>
                {`Patient: ${record.name}, `}
                {record.value !== undefined ? `Value: ${record.value}` : ''}
                {record.issue ? `Issue: ${record.issue}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Red Records</p>
        )}
      </Modal>
    </div>
  );
}; 

export default ChartComponent;
