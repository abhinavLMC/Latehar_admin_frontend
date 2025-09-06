import { CancelButton, SubmitButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  ButtonWrapper,
  CardWrapper,
  FormItemWrapper,
  InputNumberWrapper,
  InputWrapper,
  SelectWrapper,
  UploadWrapper,
} from "@components/Wrapper";
import { CENTER_WISE_PACKAGE_ROUTE } from "@constants/AppConstant";
import { FormFields } from "@utils/allTypes";
import {
  addEditTitle,
  fieldRules,
  filterByStatus,
} from "@utils/commonFunctions";
import { Col, Form, Input, Row } from "antd";
import { upperCase } from "lodash";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";

const BACK_URL = CENTER_WISE_PACKAGE_ROUTE;

const ModifyCenterWisePackageComp = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-cwp");
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  const { fetchData: fetchPackage, data: packageList } = useGetRequestHandler();
  const { fetchData: fetchCenter, data: centerList } = useGetRequestHandler();

  const [shortCode, setShortCode] = useState<string>("");

  useEffect(() => {
    fetchPackage("/api/package-list", {});
    fetchCenter("/api/center-manage-view");
  }, []);

  useEffect(() => {
    if (id) {
      fetchData("/api/center-package-details", { id });
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
      ...(id ? { id } : {short_code: shortCode.toUpperCase()}),
    };
    const API_ENDPOINT = id
      ? "/api/center-package-update"
      : "/api/center-package-add";
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
            {/* <h4 className="primary-color primary-bg-color-4">Basic Details</h4> */}
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Package Price"
                  name="package_price"
                  rules={fieldRules("number")}
                >
                  <InputNumberWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Package Frequency"
                  name="package_frequency"
                  // rules={fieldRules("text")}
                >
                  <InputWrapper addonAfter={"Days"} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Select Package"
                  name="package_id"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    options={filterByStatus(packageList)?.map(
                      (obj: { package_name: string; id: string }) => ({
                        label: obj.package_name,
                        value: String(obj.id),
                      })
                    )}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Select Center "
                  name="center_id"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    options={filterByStatus(centerList)?.map(
                      (obj: {
                        short_code: string;
                        project_name: string;
                        id: string;
                      }) => ({
                        label: obj.project_name,
                        value: String(obj.id),
                        title: obj?.short_code,
                      })
                    )}
                    onChange={(_, obj: any) => setShortCode(`${obj?.title}P`)}
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
      customTitle={`${addEditTitle(id as string)} Center Wise Package`}
      goBackUrl="/center-wise-package"
      MainComp={MainLayout}
    />
  );
};

export default ModifyCenterWisePackageComp;
