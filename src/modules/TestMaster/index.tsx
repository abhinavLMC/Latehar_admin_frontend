import DynamicPageLayout from "@components/DynamicPageLayout";
import NextImage from "@components/NextImage";
import { CardWrapper } from "@components/Wrapper";
import { Col, Row } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { DUMMY_TEST_LIST } from "./dummy-tests-list";
import { TEST_MASTER_ROUTE } from "@constants/AppConstant";



const TestMaster = () => {
  const [testList, setTestList] = useState(DUMMY_TEST_LIST);

  const mainComponent = (
    <div className="test-master-component">
      <Row gutter={16} justify="center">
        {DUMMY_TEST_LIST.map((item) => (
          <Col md={6} span={12}>
            <Link
              href={`${TEST_MASTER_ROUTE}/${item.test_slug}`}
              style={{ height: "100%" }}
            >
              <CardWrapper className="my-2 test-master-card" key={item._id}>
                <div className="mb-2">
                  <NextImage
                    src={item.icon}
                    alt={item.name}
                    height={50}
                    width={50}
                  />
                </div>
                <h3>{item.name}</h3>
              </CardWrapper>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <DynamicPageLayout
      // hideTitle={true}
      customTitle="All Available Tests"
      MainComp={mainComponent}
      // goBackUrl="/test-master"
    />
  );
};

export default TestMaster;
