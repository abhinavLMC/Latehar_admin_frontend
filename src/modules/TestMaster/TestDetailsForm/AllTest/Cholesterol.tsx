import { SubmitButton, CancelButton } from '@components/Common';
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, InputNumberWrapper, ButtonWrapper, InputWrapper, FormItemWrapper } from '@components/Wrapper';
import { TEST_MASTER_ROUTE } from '@constants/AppConstant';
import { FormFields } from '@utils/allTypes';
import { goBack } from '@utils/commonFunctions';
import { Form, Row, Col } from 'antd';
import React, { useEffect } from 'react'
import { usePostRequestHandler, useGetRequestHandler } from 'src/hook/requestHandler';



const Cholesterol = () => {
  const [form] = Form.useForm();
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, fetchData, data } = useGetRequestHandler();

  useEffect(() => {
    fetchData("/api/cholesterol-view", {});
  }, []);

  // set form field if there has form data
  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  // submit request handler
  const submitHandler = (Values: FormFields) => {
    submit("/api/cholesterol-update", Values, TEST_MASTER_ROUTE);
  };

  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps
          columnWidth={[48, "2", 49]}
          rowCounts={10}
          rowHeight={70}
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={submitHandler}>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Total cholesterol
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Min"
                  name="total_cholesterol_standard_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Max"
                  name="total_cholesterol_standard_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="total_cholesterol_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper
                  label="Within deviation value Max"
                  name="total_cholesterol_within_deviation_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="total_cholesterol_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper label="Units" name="total_cholesterol_units">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">LD Cholesterol</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Min"
                  name="ld_cholesterol_standard_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Max"
                  name="ld_cholesterol_standard_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="ld_cholesterol_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper
                  label="Within deviation value Max"
                  name="ld_cholesterol_within_deviation_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="ld_cholesterol_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper label="Units" name="ld_cholesterol_units">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">HD Cholesterol</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Min"
                  name="hd_cholesterol_standard_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Max"
                  name="hd_cholesterol_standard_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="hd_cholesterol_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper
                  label="Within deviation value Max"
                  name="hd_cholesterol_within_deviation_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="hd_cholesterol_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper label="Units" name="hd_cholesterol_units">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-start gap-3">
            <SubmitButton loading={buttonLoading} />
            <CancelButton backUrl={TEST_MASTER_ROUTE} />
          </div>
        </Form>
      )}
    </CardWrapper>
  );
};

export default Cholesterol