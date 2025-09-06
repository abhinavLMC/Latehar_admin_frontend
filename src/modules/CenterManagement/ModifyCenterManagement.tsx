import { InfoCircleOutlined } from "@ant-design/icons";
import { CancelButton, SubmitButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputNumberWrapper,
  InputWrapper,
  TooltipWrapper,
  UploadWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import DatePickerWrapper from "@components/Wrapper/DatePickerWrapper";
import { CENTER_MANAGEMENT_ROUTE, EXTERNAL_ID, INVALID_INPUT_MSG, REQUIRED_MESSAGE } from "@constants/AppConstant";
import { addEditTitle, fieldRules, handleKeyPress } from "@utils/commonFunctions";
import { Col, Form, Input, Row, Space } from "antd";
import { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { lowerCase, upperCase } from "lodash";
import React, { useEffect } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";

const { TextArea } = Input;
const BACK_URL = CENTER_MANAGEMENT_ROUTE;

interface DataType {
  external_id: string
  project_start_date: string;
  project_name: string;
  center_shortcode: string;
  project_district: string;
  project_state: string;
  project_address: string;
  agency_name: string;
  agency_district: string;
  agency_state: string;
  agency_spoc_name: string;
  agency_spoc_email: string;
  agency_spoc_contact_number: string;
  project_end_date: string;
  status: string;
}

const ModifyCenterManagement = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-center");
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();

  useEffect(() => {
    if (id) {
      fetchData("/api/center-user-edit", { id });
    } else {
      setLoading(false);
    }
  }, [id]);
  

  useEffect(() => {
    if (!!data) {
      const start =  data?.project_start_date ? dayjs( data?.project_start_date ): '';
      const end = data?.project_end_date ? dayjs(data?.project_end_date) : "";
      const finalData = {
        ...data,
        project_start_date: start,
        project_end_date: end,
      };
      form.setFieldsValue(finalData);
    }
  }, [data])

  // update or new creation
  const formSubmit = async (fieldsValues: DataType) => {
    const { project_start_date, project_end_date, center_shortcode, ...restFields } = fieldsValues;
    const shortCode = center_shortcode.toUpperCase()
    const payload = {
      ...restFields,
      center_shortcode,
      project_start_date: dayjs(project_start_date).format(),
      project_end_date: dayjs(project_end_date).format(),
      ...(id
        ? {
            id,
            status: data?.status
          }
        : {short_code: shortCode}),
    };
    const API_ENDPOINT = id
      ? "/api/center-manage-update"
      : "/api/center-manage-create";

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
            <h4 className="primary-color primary-bg-color-4">
              Project Details
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Name"
                  name="project_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label={"Center ID"}
                  name={"center_shortcode"}
                  extra={
                    <small className="fs-7 text-warning">
                      <InfoCircleOutlined /> Only 3 character supported, It can't be changed in future!
                    </small>
                  }
                  rules={fieldRules("text")}
                >
                  <InputWrapper
                    maxLength={3}
                    onKeyPress={handleKeyPress}
                    disabled={id ? true : false}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="District"
                  name="project_district"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="State"
                  name="project_state"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col span={24}>
                <FormItemWrapper
                  label="Address"
                  name="project_address"
                  rules={fieldRules("text")}
                >
                  <TextArea rows={4} />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="form-content mt-3">
            <h4 className="primary-color primary-bg-color-4">Agency Details</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Authorization Agency Name"
                  name="agency_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="District"
                  name="agency_district"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={24} span={24}>
                <FormItemWrapper
                  label="Agency Address"
                  name="agency_address"
                  rules={fieldRules("text")}
                >
                  <Input.TextArea />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="State"
                  name="agency_state"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Name"
                  name="agency_spoc_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Email"
                  name="agency_spoc_email"
                  rules={fieldRules("email")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Contact Number"
                  name="agency_spoc_contact_number"
                  rules={fieldRules()}
                >
                  <InputNumberWrapper
                    controls={false}
                    className="w-100"
                    maxLength={10}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Name"
                  name="agency_spoc_alternate_name"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Contact Number"
                  name="agency_spoc_alternate_contact_number"
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={24} span={24}>
                <CommonUploadWrapper
                  {...{
                    id,
                    label: "Project Signed Agreement/MoU",
                    name: "project_signed_agreement_file",
                    form,
                  }}
                />
              </Col>
            </Row>
          </div>
          <div className="form-content mt-3">
            <h4 className="primary-color primary-bg-color-4">
              Project Duration
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Project Start Date"
                  name="project_start_date"
                >
                  <DatePickerWrapper className="w-100" />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Project End Date"
                  name="project_end_date"
                >
                  <DatePickerWrapper className="w-100" />
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
      customTitle={`${addEditTitle(id as string)} Center`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyCenterManagement;
