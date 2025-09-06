import { InfoCircleOutlined } from "@ant-design/icons";
import { CancelButton, SubmitButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputNumberWrapper,
  InputWrapper,
  SelectWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import DatePickerWrapper from "@components/Wrapper/DatePickerWrapper";
import { CENTER_MANAGEMENT_ROUTE, CET_MANAGEMENT_ROUTE } from "@constants/AppConstant";
import { addEditTitle, fieldRules, filterByStatus, handleKeyPress, removeNonAlphabeticCharacters } from "@utils/commonFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { upperCase } from "lodash";
import React, { useEffect } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";


const BACK_URL = CET_MANAGEMENT_ROUTE;

interface DataType {
  name: string;
  cet_type: any;
  external_id: string
  project_start_date: string;
  project_name: string;
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

const ModifyCetManagement = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-cet-management");
  const { buttonLoading, submit } = usePostRequestHandler();
  const { data: centerList, fetchData: fcen } = useGetRequestHandler();
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();

  useEffect(() => {
    // fetch all center list
    fcen("/api/center-manage-view");
  }, [])

  useEffect(() => {
    if (id) {
      fetchData("/api/cet-details", { id });
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
    const { project_start_date, project_end_date, ...restFields } = fieldsValues;
    const shortCode = fieldsValues?.cet_type;
    const name = upperCase(
      removeNonAlphabeticCharacters(fieldsValues?.name || "")?.substring(0, 2)
    );

    const payload = {
      ...restFields,
      project_start_date: dayjs(project_start_date).format(),
      project_end_date: dayjs(project_end_date).format(),
      ...(id
        ? {
            id,
            status: data?.status,
          }
        : {
            short_code: `${name}${shortCode}`,
          }),
    };
    const API_ENDPOINT = id ? "/api/cet-update" : "/api/cet-create";

    submit(API_ENDPOINT, payload, BACK_URL);
  };

  const cetId = Form.useWatch('center_id', form)

  const MainLayout = (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps
          columnWidth={[48, "2", 49]}
          rowCounts={10}
          rowHeight={70}
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={formSubmit}
          initialValues={{
            status: "in_progress",
          }}
        >
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Basic Details</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper name="status" noStyle>
                  <InputWrapper type="hidden" />
                </FormItemWrapper>
                <FormItemWrapper
                  label="Name"
                  name="name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="CET Type" name="cet_type">
                  <SelectWrapper
                    options={[
                      { label: "Contractor", value: "CR" },
                      { label: "Employer", value: "ER" },
                      { label: "Transporter", value: "TR" },
                    ]}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Select Center"
                  name="center_id"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    disabled={Boolean(id)}
                    options={filterByStatus(centerList)?.map(
                      (item: { project_name: string; id: number }) => {
                        // console.log("===", typeof item.id, typeof cetId);
                        return {
                          label: item.project_name,
                          value: item.id,
                        };
                      }
                    )}
                    // onChange={(_, obj: any) => setShortCode(obj?.title)}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Contact Number"
                  name="contactNumber"
                  rules={fieldRules("mobile")}
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Registered Address"
                  name="registeredAddress"
                  rules={fieldRules("text")}
                >
                  <Input.TextArea />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Correspondence Address"
                  name="correspondenceAddress"
                  rules={fieldRules("text")}
                >
                  <Input.TextArea />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Name"
                  name="spocName"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Whatsapp Number"
                  name="spocWhatsappNumber"
                  rules={fieldRules("mobile")}
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper label="SPOC Email Id" name="spocEmail">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Name"
                  name="alternateSpocName"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Email id"
                  name="alternateSpocEmail"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Contact Number"
                  name="alternateSpocContactNumber"
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="form-content mt-3">
            <h4 className="primary-color primary-bg-color-4">
              Financial Details
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper label="PAN" name="pan">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper label="GSTIN" name="gstin">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper label="Account Number" name="accountNumber">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="IFSC Code" name="ifscCode">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={24} span={24}>
                <FormItemWrapper label="Bank Name" name="bankName">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach PAN Copy",
                    name: "attachPanCopy",
                    id,
                    form,
                  }}
                />
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach GSTIN Copy",
                    name: "attachGstin",
                    id,
                    form,
                  }}
                />
              </Col>

              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach Cancelled Cheque or Passbook",
                    name: "attachCancelledChequeOrPassbook",
                    id,
                    form,
                  }}
                />
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach Certificate of Incorporation",
                    name: "attachCertificateOfIncorporation",
                    id,
                    form,
                  }}
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
      customTitle={`${addEditTitle(id as string)} CET`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyCetManagement;
