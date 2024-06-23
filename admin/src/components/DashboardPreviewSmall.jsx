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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../redux/sidebar/sidebarSlice"; // Adjust the import path

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
    key: "10",
    icon: <SettingOutlined />,
    label: "Settings",
    link: "/settings",
  },
];

const SideBar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.sidebar.collapsed);

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

  return (
    <>
      <div className="fixed top-0 left-0 h-screen bg-[#001529] overflow-auto flex flex-col items-center">
        <img
          src="/logo.jpg"
          alt="logo"
          className={`${
            !collapsed ? "block" : "hidden"
          } h-20 w-36 rounded-md mt-5`}
        />
        <Menu
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          className={`${!collapsed && "w-64"} pt-5`}
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
