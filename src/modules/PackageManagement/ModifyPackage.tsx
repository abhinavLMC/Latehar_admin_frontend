import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  CheckBoxWrapper,
  FormItemWrapper,
  InputWrapper,
  SelectWrapper,
} from "@components/Wrapper";
import { PACKAGE_MANAGEMENT_ROUTE } from "@constants/AppConstant";
import { DUMMY_TEST_LIST } from "@modules/TestMaster/dummy-tests-list";
import { FormFields } from "@utils/allTypes";
import { addEditTitle, fieldRules } from "@utils/commonFunctions";
import { Checkbox, Col, Form, Row, Space } from "antd";
import React, { useEffect } from "react";
import useGetQuery from "src/hook/getQuery";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";

const BACK_URL = PACKAGE_MANAGEMENT_ROUTE;

const ModifyPackage = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-package");
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();


  useEffect(() => {
    if (id) {
      fetchData("/api/package-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const formSubmit = async (fieldsValues: FormFields) => {
    const payload = {
      ...fieldsValues,
      ...(id ? { id } : {short_code: fieldsValues?.package_type}),
    };
    const API_ENDPOINT = id ? "/api/package-update" : "/api/add-package";
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
                  label="Package Name"
                  name="package_name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              {/* {id && <Col md={12} span={24}>
                <FormItemWrapper
                  label="Package ID"
                  name="package_id"
                  rules={fieldRules("text")}
                >
                  <InputWrapper disabled={Boolean(id)} />
                </FormItemWrapper>
              </Col>
              } */}
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Plan Type"
                  name="package_type"
                  rules={fieldRules()}
                  initialValue={'BS'}
                >
                  <SelectWrapper options={[{label: 'Basic', value: 'BS'}, {label: 'Advance', value: 'AD'}]} />
                </FormItemWrapper>
              </Col>
              <Col span={24}>
                <FormItemWrapper
                  label=""
                  name="package_list"
                  rules={fieldRules()}
                >
                  <Checkbox.Group>
                    <Row>
                      {DUMMY_TEST_LIST.map((obj) => (
                        <Col md={6} span={12} className="mb-3">
                          <CheckBoxWrapper disabled={obj?.disable} value={obj.test_slug}>
                            {obj.name}
                          </CheckBoxWrapper>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-start gap-3 mt-3">
            <SubmitButton loading={buttonLoading} />
            <CancelButton backUrl={BACK_URL} />
          </div>
        </Form>
      )}
    </CardWrapper>
  );

  return (
    <DynamicPageLayout
      customTitle={`${addEditTitle(id as string)} Package`}
      goBackUrl="/package-management"
      MainComp={MainLayout}
    />
  );
};

export default ModifyPackage;
