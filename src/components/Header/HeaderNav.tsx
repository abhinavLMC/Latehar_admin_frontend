import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined, SearchOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Badge, Button, Col, Divider, Dropdown, Layout, Row, Space, Typography } from 'antd'
import { capitalize } from 'lodash'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLogoutHandler } from 'src/hook/useAuth'
import useDevice from 'src/hook/useDevice'
import { RootState } from 'src/store'
import NextImage from '../NextImage'
const { Header } = Layout

const {Text} = Typography
interface PropTypes {
  collapsed: boolean;
  setCollapsed: (param: boolean) => void;
  marginWidth: number;
  setOpenDrawer: (param: boolean) => void;
}
const HeaderNav = ({
  collapsed,
  setCollapsed,
  marginWidth,
  setOpenDrawer,
}: PropTypes): JSX.Element => {

  const userInfo = useSelector((state: RootState) => state.userState.userInfo)

  const { isMobileDevice } = useDevice();
  const {logout} = useLogoutHandler()

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const responsiveMenu = [
  {
    key: "analytics",
    label: (
      <Link target="new" href={`/analytics`}>
        <Text>Analytics</Text>
      </Link>
    ),
  },
  {
    key: "assign",
    label: (
      <Link target="new" href={`/assign`}>
        <Text>Assign</Text>
      </Link>
    ),
  },
  {
    key: "request",
    label: (
      <Link target="new" href={`/request`}>
        <Text>Request</Text>
      </Link>
    ),
  },
];
const menuItems: MenuProps["items"] = [
  // {
  //   key: "profile",
  //   label: (
  //     <Link target="new" href={`/profile`}>
  //       <p className="font-weight-normal pl-2">My Account</p>
  //     </Link>
  //   ),
  // },
  // ...(isMobileDevice ? responsiveMenu : []),
  ...(isMobileDevice ? [] : []),
  {
    key: "sign-out",
    onClick: () => logout(),
    label: (
      <Space className="w-100 text-danger justify-content-between">
        Sign Out
        <PoweroffOutlined />
      </Space>
    ),
  },
];

  return (
    <Header
      style={{
        marginLeft: collapsed ? `${marginWidth}px` : `${marginWidth}px`,
      }}
      className="bg-white fix-header"
    >
      <Row align="middle" className="w-100">
        <Col span={12} md={12}>
          <div className="header-left-panel d-flex align-items-center">
            <Button
              className="text-default"
              type="link"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() =>
                isMobileDevice ? showDrawer() : setCollapsed(!collapsed)
              }
            />
            <div className="header-logos d-flex align-items-center ms-3">
              <NextImage
                src="/images/PMKKKY_Logo.png"
                alt="PMKKKY Logo"
                width={240}
                height={100}
                className="me-4"
              />
              <NextImage
                src="/images/Jharkhand-Sarkar-logo.png"
                alt="Jharkhand Government Logo"
                width={100}
                height={100}
                className="me-4"
              />
              <NextImage
                src="/images/NHM.png"
                alt="National Rural Health Mission Logo"
                width={120}
                height={120}
                className="me-4"
              />
            </div>
            {!isMobileDevice && (
              <div className="header-menu-list ms-2">
                {responsiveMenu.map((item) => (
                  <></>
                  // <span key={item.key}>{item.label}</span>
                ))}
              </div>
            )}
          </div>
        </Col>
        <Col span={12} md={12}>
          <div className="header-right-panel d-flex justify-content-end align-items-center">
            {/* <div className="d-flex align-items-center">
              <Dropdown
                menu={{ items: [] }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Badge count={1} size="small">
                  <BellOutlined className="font-19 header-nav-icon ms-2 icon-color cursor-pointer" />
                </Badge>
              </Dropdown>
            </div>
            <Divider type="vertical" className="mx-4 h-36" /> */}
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click", "hover"]}
              placement="bottomRight"
              className="profile-box"
            >
              <div className="d-flex align-items-center cursor-pointer">
                <Space className="profile-nav" align='center'>
                  <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInfo?.username}`}
                    size={32}
                  />
                  {capitalize(userInfo?.username)}
                </Space>
              </div>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderNav