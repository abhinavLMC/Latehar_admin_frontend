import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import Toast from "@components/Common/Toast";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputWrapper,
} from "@components/Wrapper";
import { DOCTOR_MANAGEMENT_ROUTE, WORKFORCE_TYPE_MANAGEMENT_ROUTE } from "@constants/AppConstant";
import { addEditTitle, fieldRules, getBase64 } from "@utils/commonFunctions";
import { Col, Form, Row, Upload } from "antd";
import { upperCase } from "lodash";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";

interface DataType {
  short_name: string;
  full_name: string;
}
const BACK_URL = WORKFORCE_TYPE_MANAGEMENT_ROUTE;

const ModifyWorkforceManagementComp = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-workforce-type");
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  useEffect(() => {
    if (id) {
      fetchData("/api/workforce-type-details", { id });
    } else {
      setLoading(false)
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
      };
      form.setFieldsValue(finalData);
    }
  }, [data]);

  const formSubmit = async (fieldsValues: DataType) => {
    const payload = {
      ...fieldsValues,
      ...(id ? {id} : {}),
    };
    const API_ENDPOINT = id
      ? `/api/workforce-type-update`
      : `/api/workforce-type-create`;
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  const MainLayout = (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps
          columnWidth={[48, "2", 49]}
          rowCounts={10}
          rowHeight={70}
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={formSubmit}>
          <div className="form-content">
            {/* <h4 className="primary-color primary-bg-color-4">Project Details</h4> */}
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Full Name"
                  name="full_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Short Name"
                  name="short_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper disabled={Boolean(id)} />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-start gap-3">
            <SubmitButton loading={buttonLoading} />
            <CancelButton backUrl={BACK_URL} />
          </div>
        </Form>
      )}
    </CardWrapper>
  );

  return (
    <DynamicPageLayout
      customTitle={`${addEditTitle(id as string)} Workforce Type`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyWorkforceManagementComp;
