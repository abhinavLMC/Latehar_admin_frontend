import React, { useEffect, useState } from 'react';
import { Space, Button, Row, Col, DatePicker, message, Card, Select, Spin } from 'antd';
import ChartComponent from './ChartComponent'; // Component to render charts
import { usePostRequestHandler } from 'src/hook/requestHandler';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface HealthAnalysisData {
  [key: string]: HealthMetric;
  blood_oxygen: HealthMetric;
  haemoglobin: HealthMetric;
  blood_sugar: HealthMetric;
  blood_pressure: HealthMetric;
  pulmonary_function: HealthMetric;
  ecg: HealthMetric;
  eye_test: HealthMetric;
  hiv_test: HealthMetric;
}

interface HealthMetric {
  green: string;
  yellow?: string; // Some fields don't have yellow values
  red: string;
  redRecords?: { name: string; value?: number; issue?: string }[]; // Add redRecords property to hold detailed data
}

interface CetOption {
  id: number;
  name: string;
  short_code: string;
}

interface CenterOption{
  id: number;
  short_code: string;
}

const HealthAnalysisPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [chartData, setChartData] = useState<HealthAnalysisData | null>(null);
  const [cetId, setCetId] = useState<string | null>(null); // For storing selected CET ID
  const [cetOptions, setCetOptions] = useState<CetOption[]>([]); // State to store CET options
  const [loading, setLoading] = useState(false); // Loading state for CET fetching
  const [centerId, setCenterId] = useState<string | null>(null); // For storing selected CET ID
  const [centerOptions, setCenterOptions] = useState<CetOption[]>([]); // State to store CET options


  // Custom hooks for API calls
  const { submit } = usePostRequestHandler(); // Custom hook for handling POST requests

  // Function to fetch CET list from the API using a standard fetch method
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

  // Function to fetch CET list from the API using a standard fetch method
  const loadCenterOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/center-manage-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (result && result.status && Array.isArray(result.data)) {
        const options = result.data.map((center: { id: number; short_code: string }) => ({
          id: center.id,
          short_code: center.short_code
        }));
        setCenterOptions(options);
      } else {
        message.error('Failed to fetch Center options.');
      }
    } catch (error) {
      message.error('Error fetching Center options.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCenterOptions();
  }, []);

  const handleFetchData = async () => {
    if (!startDate || !endDate) {
      message.error('Please select both start and end dates.');
      return;
    }

    const payload = {
      cet: cetId || '',
      start_date: dayjs(startDate).toISOString(),
      end_date: dayjs(endDate).toISOString(),
      center: centerId
    };

    try {
      const response = await submit(`/api/cumulativeHealthAnalysis`, payload);

      if (response && response.status) {
        setChartData(response.data as unknown as HealthAnalysisData);
        message.success('Health analysis data fetched successfully!');
      } else {
        message.error(response?.message || 'Failed to fetch health analysis data.');
      }
    } catch (error) {
      message.error('Error fetching health analysis data.');
    }
  };

  return (
    <div>
      <Card>
        <h2>Health Analysis</h2>
        <div style={{ marginBottom: '16px' }}>
          <Space size="large">
            CET:
            <Select
              placeholder="All"
              style={{ width: 200 }}
              value={cetId || undefined}
              onChange={(value) => setCetId(value)}
              allowClear
              loading={loading}
            >
              {cetOptions.length > 0 ? (
                cetOptions.map((option) => (
                  <Option key={option.id} value={option.id.toString()}>
                    {option.name}
                  </Option>
                ))
              ) : (
                <Option disabled>No CET options available</Option>
              )}
            </Select>
            CENTER:
            <Select
              placeholder="All"
              style={{ width: 200 }}
              value={centerId || undefined}
              onChange={(value) => setCenterId(value)}
              allowClear
              loading={loading}
            >
              {centerOptions.length > 0 ? (
                centerOptions.map((option) => (
                  <Option key={option.id} value={option.id.toString()}>
                    {option.short_code}
                  </Option>
                ))
              ) : (
                <Option disabled>No Center options available</Option>
              )}
            </Select>
            DATES:
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

        {loading && <Spin />}
        {chartData && (
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {Object.keys(chartData).map((key) => {
              const metric = chartData[key as keyof HealthAnalysisData];
              return (
                <Col span={8} key={key}>
                  {/* Pass redRecords to the ChartComponent to handle click events for the red portion */}
                  <ChartComponent
                    title={key}
                    data={[
                      { name: 'Green', value: parseFloat(metric.green) },
                      { name: 'Yellow', value: parseFloat(metric.yellow ?? '0') },
                      { name: 'Red', value: parseFloat(metric.red) }
                    ]}
                    redRecords={metric.redRecords || []} // Send redRecords as a prop
                  />
                </Col>
              );
            })}
          </Row>
        )}
        {!chartData && !loading && <div>No data available for the selected filters.</div>}
      </Card>
    </div>
  );
};

export default HealthAnalysisPage;
