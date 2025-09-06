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
} from "@components/Wrapper";
import { HOME_PAGE_ROUTE } from "@constants/AppConstant";
import { addEditTitle, fieldRules } from "@utils/commonFunctions";
import { Col, Form, Input, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";

interface DataType {
  email: string;
  name: string;
  role_id: string;
  username: string;
  phone: string;
}
const BACK_URL = HOME_PAGE_ROUTE;

const ModifyAdminUser = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-user");
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { data: permissionList, fetchData: fetchPer } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  const [enableFields, setEnableFields] = useState(false)

  // fetch all permission list
  useEffect(() => {
    fetchPer("/api/view-permission");
  }, [])

  useEffect(() => {
    if (id) {
      setEnableFields(true);
      fetchData("/api/user-details", { id });
    } else {
      setLoading(false)
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const formSubmit = async (fieldsValues: DataType) => {
    const payload = {
      ...fieldsValues,
      ...(id ? {id} : {})
    };
    const API_ENDPOINT = id
      ? "/api/admin-user-update"
      : "/api/admin-user-create";
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  // permission option based on the admin role and admin id is equal to 1
  const permissionOptions = permissionList?.filter((item: { role_id: string; }) => item.role_id === "1")

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
                      Password{" "}
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
                <FormItemWrapper label="Name" name="name" rules={fieldRules("text")}>
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Roles & Permission"
                  name="permission_id"
                  rules={fieldRules("text")}
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
                  <InputNumberWrapper maxLength={10} />
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
      customTitle={`${addEditTitle(id as string)} Admin User`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyAdminUser;
