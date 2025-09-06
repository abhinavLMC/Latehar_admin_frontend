import { SubmitButton, CancelButton } from "@components/Common";
import EmptyContent from "@components/Common/Empty/EmptyContent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  CheckBoxWrapper,
  FormItemWrapper,
  InputWrapper,
  SelectWrapper,
} from "@components/Wrapper";
import { ROLE_PERMISSION_ROUTE } from "@constants/AppConstant";
import { Checkbox, Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";

import PERMISSION_PAGE_LIST from "./static/data.json";
import { addEditTitle, fieldRules } from "@utils/commonFunctions";

const BACK_URL = ROLE_PERMISSION_ROUTE;

const ModifyRolePermission = () => {
  const [form] = Form.useForm();
  const roleID = Form.useWatch("role_id", form);

  const { id } = useGetQuery("update-permission");
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { data: roleList, fetchData: fetchRole } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  useEffect(() => {
    fetchRole("/api/role-view");
  }, []);

  useEffect(() => {
    if (id) {
      fetchData("/api/permission-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const formData = Form.useWatch([], form)
  console.log("==", formData);

  // update or new creation
  const formSubmit = async (fieldsValues: any) => {
    const payload = {
      ...fieldsValues,
      role_id: fieldsValues?.role_id,
      ...(id ? { permission_id: id } : {}),
    };

    const API_ENDPOINT = id
      ? "/api/permission-update"
      : "/api/create-permission";
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  const getPageName = (id: string) => {
    return (
      (!!id &&
        PERMISSION_PAGE_LIST?.find((obj) => obj.role_id == id)?.page_list) ||
      []
    );
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
                  label="Permission Name"
                  name="permission_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Role Type"
                  name="role_id"
                  rules={fieldRules("text")}
                >
                  <SelectWrapper
                    disabled={Boolean(id)}
                    options={roleList?.map(
                      (obj: {
                        id: string;
                        role_title: string;
                        slug: string;
                      }) => ({
                        label: obj.role_title,
                        value: String(obj.id),
                        key: obj?.slug,
                      })
                    )}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={24} span={24}>
                <div className="permission-header">
                  <Row>
                    <Col span={15}>
                      <strong>Page Name</strong>
                    </Col>
                    <Col span={3}>
                      <strong>View</strong>
                    </Col>
                    <Col span={3}>
                      <strong>Create</strong>
                    </Col>
                    <Col span={3}>
                      <strong>Edit</strong>
                    </Col>
                  </Row>
                </div>
                <div className="permission-body">
                  {getPageName(roleID).length > 0 ? (
                      getPageName(roleID)?.map((item, index) => (
                        <Row className="permission-row" align="middle">
                          <Col span={15}>
                            <FormItemWrapper
                              initialValue={item.value}
                              name={["Permissionmetadata", index, "page_name"]}
                              className="mb-0"
                              noStyle
                            >
                              <InputWrapper type="hidden" />
                            </FormItemWrapper>
                            {item.label}
                          </Col>
                          <Col span={9}>
                            <FormItemWrapper
                              initialValue={[]}
                              name={[
                                "Permissionmetadata",
                                index,
                                "permission_type",
                              ]}
                              className="mb-0"
                              // valuePropName="checked"
                            >
                              <Checkbox.Group className="w-100">
                                <Row>
                                  <Col span={8}>
                                    <CheckBoxWrapper value="view" />
                                  </Col>
                                  <Col span={8}>
                                    <CheckBoxWrapper value="create" />
                                  </Col>
                                  <Col span={8}>
                                    <CheckBoxWrapper value="edit" />
                                  </Col>
                                </Row>
                              </Checkbox.Group>
                            </FormItemWrapper>
                          </Col>
                        </Row>
                      ))
                  ) : (
                    <EmptyContent
                      className="py-5"
                      onlyMessage="No data found"
                    />
                  )}
                </div>
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
      customTitle={`${addEditTitle(id as string)} Role & Permission`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyRolePermission;
