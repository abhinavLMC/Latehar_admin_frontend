import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import Toast from "@components/Common/Toast";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { DOCTOR_MANAGEMENT_ROUTE } from "@constants/AppConstant";
import { addEditTitle, fieldRules, getBase64 } from "@utils/commonFunctions";
import { Col, Form, Row, Upload } from "antd";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";

interface DataType {
  signature: {
    name: string
    file: {
      uid: string
    }
    size: string
    type: string
  }[];
  email: string;
  name: string;
  role_id: string;
  username: string;
  phone: string;
}
const BACK_URL = DOCTOR_MANAGEMENT_ROUTE;

const ModifyDoctorManagement = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-doctor");
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  useEffect(() => {
    if (id) {
      fetchData("/api/doctor-details", { id });
    } else {
      setLoading(false)
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        username: data?.User?.username
      };
      form.setFieldsValue(finalData);
    }
  }, [data]);

  const formSubmit = async (fieldsValues: DataType) => {
    const payload = {
      ...fieldsValues,
      ...(id ? {id} : {})
    };
    const API_ENDPOINT = id
      ? `/api/doctor-update`
      : `/api/doctor-create`;
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
                  label="Doctor Name"
                  name="username"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Registration Number"
                  name="registration_number"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Contact Number"
                  name="contact_number"
                  rules={fieldRules()}
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Qualification"
                  name="qualification"
                  rules={fieldRules()}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{ id, form, name: 'signature', label: 'Signature' }}
                />
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
      customTitle={`${addEditTitle(id as string)} Doctor`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyDoctorManagement;
