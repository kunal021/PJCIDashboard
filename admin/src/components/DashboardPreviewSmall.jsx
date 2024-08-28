import { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  BookOutlined,
  DashboardOutlined,
  // FileImageOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import "tailwindcss/tailwind.css"; // Make sure to import Tailwind CSS
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../redux/sidebar/sidebarSlice"; // Adjust the import path
import UpdateServerStatus from "./setting/UpdateServerStatus";
import { MoveLeft, MoveRight, Server } from "lucide-react";
import Logout from "./setting/Logout";

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
    label: "Video",
    icon: <VideoCameraOutlined />,
    children: [
      {
        key: "9",
        label: "All Videos",
        link: "/get-videos",
      },
      {
        key: "10",
        label: "Add Video",
        link: "/add-video",
      },
      {
        key: "11",
        label: "Free Video",
        link: "/free-video",
      },
    ],
  },
  {
    key: "sub5",
    label: "User",
    icon: <UserOutlined />,
    children: [
      {
        key: "17",
        label: "All Users",
        link: "/get-users",
      },
    ],
  },
  {
    key: "sub6",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      {
        key: "13",
        label: "App Slider",
        link: "/get-slider",
      },
      {
        key: "15",
        label: "Make User Purchase",
        link: "/user-purchase",
      },
      {
        key: "19",
        label: "About Us",
        link: "/about-us",
      },
      {
        key: "20",
        label: "Terms & Conditions",
        link: "/terms-and-conditions",
      },
      {
        key: "21",
        label: "Privacy Policy",
        link: "/privacy-policy",
      },
    ],
  },
  {
    key: "sub7",
    label: "Server Status",
    icon: <Server className="h-4 w-4" />,
    children: [
      {
        key: "23",
        label: <UpdateServerStatus />,
      },
    ],
  },
  {
    key: "sub8",
    label: "Logout",
    icon: <LogoutOutlined className="h-4 w-4" />,
    children: [
      {
        key: "25",
        label: <Logout />,
      },
    ],
  },
];

const SideBar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const location = useLocation();
  const currentPath = location.pathname;

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const selectedItem = items.find((item) =>
      item.link
        ? item.link === currentPath
        : item.children.find((child) => child.link === currentPath)
    );
    if (selectedItem) {
      setSelectedKeys(
        selectedItem.key.includes("sub")
          ? [
              selectedItem.children.find((child) => child.link === currentPath)
                .key,
            ]
          : [selectedItem.key]
      );
      setOpenKeys(selectedItem.key.includes("sub") ? [selectedItem.key] : []);
    } else {
      setSelectedKeys([]);
      setOpenKeys([]);
    }
  }, [currentPath]);

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

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen bg-[#001529] border-r overflow-auto flex flex-col items-center">
        <img
          src="/logo.png"
          alt="logo"
          className={`${
            !collapsed ? "block" : "hidden"
          } h-20 w-36 rounded-md mt-5`}
        />
        <Menu
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          className={`${!collapsed && "w-64"} pt-5 mb-5`}
          onOpenChange={handleOpenChange}
        >
          {items.map((item) => renderMenuItem(item))}
        </Menu>
      </div>
      <div
        className={`fixed top-4 ${collapsed && "left-24"} ${
          !collapsed && "left-[17rem]"
        }`}
      >
        <Button type="primary" onClick={toggleSidebar}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <div className={`fixed top-4 space-x-2 right-4`}>
        <button
          onClick={() => {
            window.history.back();
          }}
          className="bg-blue-500 text-white font-bold py-1 px-2.5 rounded-md align-middle transition-all duration-300"
        >
          <MoveLeft className="w-5" />
        </button>
        <button
          onClick={() => {
            window.history.forward();
          }}
          className="bg-blue-500 text-white font-bold py-1 px-2.5 rounded-md align-middle transition-all duration-300"
        >
          <MoveRight className="w-5" />
        </button>
      </div>
    </>
  );
};

export default SideBar;
