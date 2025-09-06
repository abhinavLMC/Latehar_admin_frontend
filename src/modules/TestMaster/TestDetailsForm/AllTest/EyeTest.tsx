import { SubmitButton, CancelButton } from '@components/Common';
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, InputWrapper, ButtonWrapper, FormItemWrapper, InputNumberWrapper } from '@components/Wrapper';
import { TEST_MASTER_ROUTE } from '@constants/AppConstant';
import { FormFields } from '@utils/allTypes';
import { goBack } from '@utils/commonFunctions';
import { Form, Row, Col } from "antd";
import React, { useEffect } from 'react'
import { usePostRequestHandler, useGetRequestHandler } from 'src/hook/requestHandler';

interface PropTypes {
  backUrl?: string
}

const EyeTest = () => {
  const [form] = Form.useForm();
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, fetchData, data } = useGetRequestHandler();

  useEffect(() => {
    fetchData("/api/eye-view", {});
  }, []);

  // set form field if there has form data
  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  // submit request handler
  const submitHandler = (Values: FormFields) => {
    submit("/api/eye-update", Values, TEST_MASTER_ROUTE);
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
              Spherical AV Right Eye
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min (Below)"
                  name="spherical_right_within_deviation_value_min_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="spherical_right_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range (Below)"
                  name="spherical_right_out_of_range_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="spherical_right_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>

          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Cylindrical AV Right Eye
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min (Below)"
                  name="cylindrical_right_within_deviation_value_min_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="cylindrical_right_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range (Below)"
                  name="cylindrical_right_out_of_range_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="cylindrical_right_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>

          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Spherical AV Left Eye
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min (Below)"
                  name="spherical_left_within_deviation_value_min_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="spherical_left_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range (Below)"
                  name="spherical_left_out_of_range_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="spherical_left_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>

          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Cylindrical AV Left Eye
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min (Below)"
                  name="cylindrical_left_within_deviation_value_min_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="cylindrical_left_within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range (Below)"
                  name="cylindrical_left_out_of_range_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="cylindrical_left_out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>

          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Colour Blindness
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Option 1"
                  name="colour_blindness_option_1"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Option 2"
                  name="colour_blindness_option_2"
                >
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

export default EyeTest