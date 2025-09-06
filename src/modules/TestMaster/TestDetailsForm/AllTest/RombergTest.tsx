import { SubmitButton, CancelButton } from '@components/Common';
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, FormItemWrapper, InputWrapper } from '@components/Wrapper';
import { TEST_MASTER_ROUTE } from '@constants/AppConstant';
import { FormFields } from '@utils/allTypes';
import { Form, Row, Col } from 'antd';
import React, { useEffect } from 'react'
import { usePostRequestHandler, useGetRequestHandler } from 'src/hook/requestHandler';



const Romberg = () => {
  const [form] = Form.useForm();
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, fetchData, data } = useGetRequestHandler();

  useEffect(() => {
    fetchData("/api/romberg-view", {});
  }, []);

  // set form field if there has form data
  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  // submit request handler
  const submitHandler = (Values: FormFields) => {
    submit("/api/romberg-update", Values, TEST_MASTER_ROUTE);
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
            <h4 className="primary-color primary-bg-color-4">Romberg</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper label="Option 1" name="option_one">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="Option 2" name="option_two">
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

export default Romberg