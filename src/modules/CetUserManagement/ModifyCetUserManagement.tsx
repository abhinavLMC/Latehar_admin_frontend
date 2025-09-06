import { EditOutlined } from "@ant-design/icons";
import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputWrapper,
  SelectWrapper,
} from "@components/Wrapper";
import { CET_USER_ROUTE } from "@constants/AppConstant";
import { FormFields } from "@utils/allTypes";
import { addEditTitle, fieldRules, filterByStatus } from "@utils/commonFunctions";
import { Col, Form, Input, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";

const BACK_URL = CET_USER_ROUTE;

const ModifyCetUserManagement = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-cet-user");

  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { loading: cetOptionLoading, data: cetOptions, fetchData: getCetOptions } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();
  
  const [enableFields, setEnableFields] = useState(false);
  
  useEffect(() => {
    getCetOptions("/api/cet-list");
  }, []);

  useEffect(() => {
    if (id) {
      setEnableFields(true);
      fetchData("/api/cet-user-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        ...data?.user
      };
      form.setFieldsValue(finalData);
    }
  }, [data]);


  const formSubmit = async (fieldsValues: FormFields) => {
    const payload = {
      ...fieldsValues,
      permission_id: "33",
      ...(id ? { id } : {}),
    };
    const API_ENDPOINT = id ? "/api/cet-user-update" : "/api/cet-user-create";
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  const MainLayout = (
    <CardWrapper>
      {loading && cetOptionLoading ? (
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
                  label="Select CET"
                  name="cet_id"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    disabled={Boolean(id)}
                    options={filterByStatus(cetOptions)?.map(
                      (item: { name: string; id: string }) => ({
                        label: item.name,
                        value: item.id,
                      })
                    )}
                  />
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
      customTitle={`${addEditTitle(id)} CET User`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyCetUserManagement;
