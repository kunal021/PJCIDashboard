import {
  AppstoreOutlined,
  BookOutlined,
  DashboardOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import "tailwindcss/tailwind.css"; // Make sure to import Tailwind CSS
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../redux/sidebar/sidebarSlice"; // Adjust the import path
import UpdateServerStatus from "./setting/UpdateServerStatus";
import { Server } from "lucide-react";

const items = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    link: "/",
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: "Category",
    link: "/category",
  },
  {
    key: "sub1",
    label: "Courses",
    icon: <BookOutlined />,
    children: [
      {
        key: "4",
        label: "Course",
        link: "/get-course",
      },
      {
        key: "5",
        label: "Full Course",
        link: "/get-full-course",
      },
    ],
  },
  {
    key: "sub2",
    label: "Test",
    icon: <FormOutlined />,
    children: [
      {
        key: "7",
        label: "Test",
        link: "/get-test",
      },
    ],
  },
  {
    key: "sub3",
    label: "User",
    icon: <UserOutlined />,
    children: [
      {
        key: "9",
        label: "All Users",
        link: "/get-users",
      },
    ],
  },
  {
    key: "sub4",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      {
        key: "11",
        label: "About Us",
        link: "/about-us",
      },
      {
        key: "12",
        label: "Terms & Conditions",
        link: "/terms-and-conditions",
      },
      {
        key: "13",
        label: "Privacy Policy",
        link: "/privacy-policy",
      },
    ],
  },
  {
    key: "sub5",
    label: "Server Status",
    icon: <Server className="h-4 w-4" />,
    children: [
      {
        key: "14",
        label: <UpdateServerStatus />,
      },
    ],
  },
];

const SideBar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const location = useLocation();
  const currentPath = location.pathname;

  const getSelectedKeys = () => {
    const selectedItem = items.find((item) =>
      item.link
        ? item.link === currentPath
        : item.children.find((child) => child.link === currentPath)
    );
    if (selectedItem) {
      // console.log(selectedItem);
      return selectedItem.key.includes("sub")
        ? [
            selectedItem.children.find((child) => child.link === currentPath)
              .key,
          ]
        : [selectedItem.key];
    }
    return [];
  };

  const getOpenKeys = () => {
    const item = items.filter((item) => item.key.includes("sub"));
    const selectedItem = item.find((item) =>
      item.children.find((child) => child.link === currentPath)
    );
    if (selectedItem && selectedItem.children) {
      return [selectedItem.key]; // Open the parent submenu if it has children
    }
    return [];
  };

  const toggleSidebar = () => {
    dispatch(toggleCollapsed());
  };

  const renderMenuItem = (item) => {
    if (item.children) {
      return (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key}>
              <Link to={child.link}>{child.label}</Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>
      );
    }
  };

  // bg-[#001529]

  return (
    <>
      <div className="fixed top-0 left-0 h-screen bg-[#001529] border-r overflow-auto flex flex-col items-center">
        <img
          src="/logo.jpg"
          alt="logo"
          className={`${
            !collapsed ? "block" : "hidden"
          } h-20 w-36 rounded-md mt-5`}
        />
        <Menu
          defaultSelectedKeys={getSelectedKeys}
          defaultOpenKeys={getOpenKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          className={`${!collapsed && "w-64"} pt-5 mb-5`}
        >
          {items.map((item) => renderMenuItem(item))}
        </Menu>
      </div>
      <div className="fixed top-4 right-4">
        <Button type="primary" onClick={toggleSidebar}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    </>
  );
};

export default SideBar;
