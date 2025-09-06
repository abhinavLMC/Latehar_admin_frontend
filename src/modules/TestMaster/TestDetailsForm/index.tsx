import React, { useEffect, useState } from 'react'
import {
  Temperature,
  SPO2,
  BasicHearing,
  RandomBloodSugar,
  Pulse,
  PFT,
  Haemoglobin,
  Cretenine,
  Cholesterol,
  BMI,
  BloodPressure,
  Alchol,
  HIV,
  EyeTest,
  ECG,
  BloodGroup,
  Romberg,
  VisionTest
} from "./AllTest";
import DynamicPageLayout from '@components/DynamicPageLayout';
import { useRouter } from 'next/router';
import NotFoundPage from '@components/Common/NotFoundPage';
import { DUMMY_TEST_LIST } from '../dummy-tests-list';
import { TEST_MASTER_ROUTE } from '@constants/AppConstant';

const BACK_URL = TEST_MASTER_ROUTE;

const TestDetailsForm = () => {
    const router = useRouter();

    const [slugName, setSlugName] = useState<string>('');

    useEffect(() => {
      if (router.query) {
        setSlugName(router.query.slug as string);
      }
    }, [router.query])


    const ALL_TEST: { [key: string]: JSX.Element } = {
      temperature: <Temperature />,
      spo2: <SPO2 />,
      "random-blood-sugar": <RandomBloodSugar />,
      pulse: <Pulse />,
      pft: <PFT />,
      "hearing": <BasicHearing />,
      haemoglobin: <Haemoglobin />,
      cretenine: <Cretenine />,
      cholesterol: <Cholesterol />,
      bmi: <BMI />,
      "blood-pressure": <BloodPressure />,
      alchol: <Alchol />,
      hiv: <HIV />,
      eye: <EyeTest />,
      vision: <VisionTest />,
      ecg: <ECG />,
      "blood-group": <BloodGroup />,
      romberg: <Romberg />,
    };

  const renderComponent = slugName ? (
    <div className="test-master-form">{ALL_TEST[slugName]}</div>
  ) : (
    <NotFoundPage message="This page could not be found." />
  );

  const findTitle = DUMMY_TEST_LIST?.find((item) => item.test_slug === slugName)?.name
  return (
    <DynamicPageLayout
      customTitle={`${findTitle}`}
      MainComp={renderComponent}
      goBackUrl={BACK_URL}
    />
  );
}

export default TestDetailsForm