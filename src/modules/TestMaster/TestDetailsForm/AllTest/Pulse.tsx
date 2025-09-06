import { SubmitButton, CancelButton } from '@components/Common';
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, InputNumberWrapper, ButtonWrapper, InputWrapper, FormItemWrapper } from '@components/Wrapper';
import { TEST_MASTER_ROUTE } from '@constants/AppConstant';
import { FormFields } from '@utils/allTypes';
import { goBack } from '@utils/commonFunctions';
import { Form, Row, Col } from 'antd';
import React, { useEffect } from 'react'
import { usePostRequestHandler, useGetRequestHandler } from 'src/hook/requestHandler';



const Pulse = () => {
  const [form] = Form.useForm();
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, fetchData, data } = useGetRequestHandler();

  useEffect(() => {
    fetchData("/api/pulse-view", {});
  }, []);

  // set form field if there has form data
  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  // submit request handler
  const submitHandler = (Values: FormFields) => {
    submit("/api/pulse-update", Values, TEST_MASTER_ROUTE);
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
            <h4 className="primary-color primary-bg-color-4">Pulse</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Min"
                  name="standard_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Standard Values Max"
                  name="standard_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min (Below)"
                  name="within_deviation_value_min_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper
                  label="Within deviation value Max (Below)"
                  name="within_deviation_value_max_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Within deviation value Min"
                  name="within_deviation_value_min"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper
                  label="Within deviation value Max"
                  name="within_deviation_value_max"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range (Below)"
                  name="out_of_range_below"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Out of range"
                  name="out_of_range"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24} md={12}>
                <FormItemWrapper label="Units" name="units">
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

export default Pulse