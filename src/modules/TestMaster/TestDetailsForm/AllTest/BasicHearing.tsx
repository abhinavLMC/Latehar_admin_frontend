import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import {
  CardWrapper,
  InputNumberWrapper,
  UploadWrapper,
  ButtonWrapper,
  InputWrapper,
  FormItemWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { TEST_MASTER_ROUTE } from "@constants/AppConstant";
import { FormFields } from "@utils/allTypes";
import { goBack } from "@utils/commonFunctions";
import { Form, Row, Col, Input } from "antd";
import React, { useEffect } from "react";
import { usePostRequestHandler, useGetRequestHandler } from "src/hook/requestHandler";


const BasicHearing = () => {
  const [form] = Form.useForm();
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, fetchData, data } = useGetRequestHandler();

  useEffect(() => {
    fetchData("/api/hearing-view", {});
  }, []);

  // set form field if there has form data
  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  // submit request handler
  const submitHandler = (Values: FormFields) => {
    submit("/api/hearing-update", Values, TEST_MASTER_ROUTE);
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
            {/* <h4 className="primary-color primary-bg-color-4">ECG</h4> */}
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper label="Option 1" name="option_1">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="Option 2" name="option_2">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="Option 3" name="option_3">
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

export default BasicHearing;
