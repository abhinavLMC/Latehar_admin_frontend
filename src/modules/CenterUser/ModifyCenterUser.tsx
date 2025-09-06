import { EditOutlined } from "@ant-design/icons";
import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputNumberWrapper,
  InputWrapper,
  SelectWrapper,
  UploadWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { CENTER_USER_ROUTE } from "@constants/AppConstant";
import { FormFields } from "@utils/allTypes";
import { addEditTitle, fieldRules, filterByStatus, normFile } from "@utils/commonFunctions";
import { Col, Form, Input, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";

const BACK_URL = CENTER_USER_ROUTE

const ModifyCenterUser = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-center-user");

  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { data: permissionList, fetchData: fetchPer } = useGetRequestHandler();
  const { data: centerList, fetchData: fcen } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  const [enableFields, setEnableFields] = useState(false);
  const [shortCode, setShortCode] = useState<string>('')

  useEffect(() => {
    fcen("/api/center-manage-view");
    fetchPer("/api/view-permission");
  }, []);

  useEffect(() => {
    if (id) {
      setEnableFields(true);
      fetchData("/api/center-user-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        center_id: data?.centerusers[0]?.center_id || "",
        signature: data?.centerusers[0]?.signature || ""
      };
      form.setFieldsValue(finalData);
    }
  }, [data]);


  const formSubmit = async (fieldsValues: FormFields) => {
    const payload = {
      ...fieldsValues,
      ...(id ? { id } : {short_code: `CU${shortCode}`}),
    };
    const API_ENDPOINT = id
      ? "/api/center-user-update"
      : "/api/add-center-user";
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  // permission option based on the center role and center id is equal to 2
  const permissionOptions = permissionList?.filter(
    (item: { role_id: string }) => item.role_id === "2"
  );

  const MainLayout = (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps
          columnWidth={[48, "2", 49]}
          rowCounts={8}
          rowHeight={70}
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={formSubmit}>
          <div className="form-content">
            {/* <h4 className="primary-color primary-bg-color-4">Project Details</h4> */}
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Username"
                  name="username"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label={
                    <Space>
                      Password
                      {enableFields && (
                        <EditOutlined
                          onClick={() => setEnableFields(!enableFields)}
                        />
                      )}
                    </Space>
                  }
                  name="password"
                >
                  <Input.Password disabled={enableFields} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Name"
                  name="name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Role & Permission"
                  name="permission_id"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    options={permissionOptions?.map(
                      (obj: { permission_name: string; id: string }) => ({
                        label: obj.permission_name,
                        value: String(obj.id),
                      })
                    )}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Email"
                  name="email"
                  rules={fieldRules("email")}
                >
                  <InputWrapper type="email" />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Phone"
                  name="phone"
                  rules={fieldRules()}
                >
                  <InputWrapper maxLength={10} />
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
                      (item: {
                        short_code: string;
                        project_name: string;
                        id: string;
                      }) => ({
                        label: item.project_name,
                        value: String(item.id),
                        title: item.short_code,
                      })
                    )}
                    onChange={(_, obj: any) => setShortCode(obj?.title)}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    id,
                    form,
                    name: "signature",
                    label: "Signature",
                    // required: true,
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
      customTitle={`${addEditTitle(id)} Center User`}
      goBackUrl="/center-user"
      MainComp={MainLayout}
    />
  );
};

export default ModifyCenterUser;
