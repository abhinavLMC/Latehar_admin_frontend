import React, { useState , useEffect} from 'react';
// import { DatePicker, Button, message, Card, Space, Select } from 'antd';
import { Space, Button, Row, Col, DatePicker, message, Card, Select, Spin } from 'antd';

import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { usePostRequestHandler } from 'src/hook/requestHandler';
import dayjs, { Dayjs } from 'dayjs';

// Interface for the center data including new fields for different test types
interface TestCountPerCenter {
  center_name: string;
  total_test_count: string; // Assuming the test count comes as a string, otherwise use 'number'
  basic_test_count: string;
  advanced_test_count: string;
  counselling_test_count: string;
}

// API Response Interface
interface ApiResponse {
  status: boolean;
  code: number;
  data: TestCountPerCenter[];
  message: string;
}
interface CetOption {
  id: number;
  name: string;
}
const { RangePicker } = DatePicker;

// Register the necessary components for Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TestCountPerCenter = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const { submit } = usePostRequestHandler(); // Custom hook to handle API calls
  const [cetId, setCetId] = useState<string | null>(null); // For storing selected CET ID
  const [cetOptions, setCetOptions] = useState<CetOption[]>([]); // State to store CET options
  const [loading, setLoading] = useState(false); // Loading state for CET fetching

  const loadCetOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cet-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (result && result.status && Array.isArray(result.data)) {
        const options = result.data.map((cet: { id: number; name: string }) => ({
          id: cet.id,
          name: cet.name,
        }));
        setCetOptions(options);
      } else {
        message.error('Failed to fetch CET options.');
      }
    } catch (error) {
      message.error('Error fetching CET options.');
    }
    setLoading(false);
  };
  useEffect(() => {
    loadCetOptions();
  }, []);

  // Fetch data from the API based on selected date range
  const handleFetchData = async () => {
    if (!startDate || !endDate) {
      message.error('Please select both start and end dates.');
      return;
    }

    const payload = {
      cet: cetId || '',
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
    };

    try {
      // Make the API request and expect the response to match the ApiResponse interface
      const response = await submit('/api/test-count-per-center', payload) as unknown as ApiResponse;

      // Ensure the response exists and is successful
      if (response && response.status) {
        const data = response.data;

        const labels = data.map((item) => item.center_name);  // Extract center names
        const basicCounts = data.map((item) => Number(item.basic_test_count));  // Convert basic_test_count to numbers
        const advancedCounts = data.map((item) => Number(item.advanced_test_count));  // Convert advanced_test_count to numbers
        const counsellingCounts = data.map((item) => Number(item.counselling_test_count));  // Convert counselling_test_count to numbers

        // Set the chart data for Chart.js
        setChartData({
          labels,
          datasets: [
            {
              label: 'BASIC Tests',
              data: basicCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for BASIC tests
            },
            {
              label: 'ADVANCED Tests',
              data: advancedCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color for ADVANCED tests
            },
            {
              label: 'COUNSELLING',
              data: counsellingCounts,
              backgroundColor: 'rgba(255, 206, 86, 0.6)', // Color for COUNSELLING tests
            },
          ],
        });

        message.success('Data fetched successfully!');
      } else {
        message.error(response?.message || 'Failed to fetch data');
      }
    } catch (error) {
      message.error('Error fetching data.');
      console.error(error);
    }
  };

  return (
    <Card>
      <h2>Test Count Per Center</h2>
      <div style={{ marginBottom: '16px' }}>
          <Space size="large">
            CET:
            <Select
              placeholder="Select CET"
              style={{ width: 200 }}
              value={cetId || undefined}
              onChange={(value) => setCetId(value)}
              allowClear
              loading={loading}
            >
              {cetOptions.length > 0 ? (
                cetOptions.map((option) => (
                  <Select.Option key={option.id} value={option.id.toString()}>
                    {option.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No CET options available</Select.Option>
              )}
            </Select>
            <RangePicker
              onChange={(dates) => {
                setStartDate(dates ? dates[0] : null);
                setEndDate(dates ? dates[1] : null);
              }}
              style={{ marginLeft: '8px' }}
            />
            <Button type="primary" onClick={handleFetchData} style={{ marginLeft: '8px' }} disabled={!startDate || !endDate}>
              Fetch Analysis
            </Button>
          </Space>
        </div>

      {chartData && (
        <div style={{ height: '400px', width: '100%' }}>
          <Bar
            data={chartData}
            options={{
              scales: {
                y: { beginAtZero: true }, // Ensure the Y-axis starts at 0
              },
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Test Count Per Center',
                },
              },
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default TestCountPerCenter;
