import {
  ChevronDown,
  ChevronUp,
  FilePenLine,
  Folder,
  Gauge,
  LayoutDashboard,
  Video,
  File,
  Book,
  Newspaper,
  User,
  CreditCard,
  Settings,
  Server,
  LogOut,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import Logout from "../setting/Logout";
import UpdateServerStatus from "../setting/UpdateServerStatus";
import { Separator } from "../ui/separator";
import { useAuth } from "@/hooks/use-auth";

const permissionMapping = {
  dashboard: "Dashboard",
  category: "Category",
  courses: "Courses",
  test_series: "Test",
  videos: "Video",
  documents: "Docs",
  books: "Books",
  news: "News",
  users: "User",
  payments: "Payments",
  gallery: "Gallery",
  app_slider: "App Slider",
  send_notification: "Send Notification",
  aboutus: "About Us",
  tandc: "Terms & Conditions",
  privacy_policy: "Privacy Policy",
  server_status: "Server Status",
};

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
      items: [],
    },
    {
      title: "Category",
      url: "/category",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "Courses",
      url: "#",
      icon: Folder,
      items: [
        {
          title: "Course",
          url: "/course",
        },
      ],
    },
    {
      title: "Test",
      url: "#",
      icon: FilePenLine,
      items: [
        {
          title: "Test Series",
          url: "/testseries",
        },
        {
          title: "Test",
          url: "/test",
        },
      ],
    },
    {
      title: "Video",
      url: "#",
      icon: Video,
      items: [
        {
          title: "All Videos",
          url: "/videos",
        },
        {
          title: "Free Video",
          url: "/videos/free",
        },
      ],
    },
    {
      title: "Docs",
      url: "#",
      icon: File,
      items: [
        {
          title: "Materials",
          url: "/doc/materials",
        },
        {
          title: "Free Materials",
          url: "/doc/free-materials",
        },
        {
          title: "Notes",
          url: "/doc/notes",
        },
      ],
    },
    {
      title: "Books",
      url: "#",
      icon: Book,
      items: [
        {
          title: "Books",
          url: "/books",
        },
        {
          title: "Demo Books",
          url: "/books/demo",
        },
        {
          title: "Orders",
          url: "/books/orders",
        },
      ],
    },
    {
      title: "News",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "News",
          url: "/news",
        },
      ],
    },
    {
      title: "User",
      url: "#",
      icon: User,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Payments",
          url: "/payments",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Gallery",
          url: "/setting/images",
        },
        {
          title: "App Slider",
          url: "/setting/slider",
        },
        {
          title: "Send Notification",
          url: "/setting/notification",
        },
        {
          title: "About Us",
          url: "/setting/about-us",
        },
        {
          title: "Terms & Conditions",
          url: "/setting/terms-and-conditions",
        },
        {
          title: "Privacy Policy",
          url: "/setting/privacy-policy",
        },
      ],
    },
    {
      title: "Server Status",
      url: "#",
      icon: Server,
      items: [
        {
          title: <UpdateServerStatus />,
          url: "#",
        },
      ],
    },
    {
      title: "Logout",
      url: "#",
      icon: LogOut,
      items: [
        {
          title: <Logout />,
          url: "#",
        },
      ],
    },
  ],
};

const filteredNavMain = (newData, accessPermission, permissionMapping) => {
  return newData.filter((item) => {
    // Always show Logout and Server Status
    if (item.title === "Logout" || item.title === "Server Status") {
      return true;
    }

    const itemKey = Object.entries(permissionMapping).find(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value === item.title
    )?.[0];

    if (item.title === "Settings") {
      // Check if any child items have permissions
      const hasPermittedChildren = item.items?.some((subItem) => {
        const subItemKey = Object.entries(permissionMapping).find(
          // eslint-disable-next-line no-unused-vars
          ([_, value]) => value === subItem.title
        )?.[0];
        return subItemKey && accessPermission.includes(subItemKey);
      });

      if (hasPermittedChildren) {
        // Filter the items array to only include permitted items
        item.items = item.items.filter((subItem) => {
          const subItemKey = Object.entries(permissionMapping).find(
            // eslint-disable-next-line no-unused-vars
            ([_, value]) => value === subItem.title
          )?.[0];
          return subItemKey && accessPermission.includes(subItemKey);
        });
        return true;
      }
      return false;
    }

    if (!itemKey) {
      return false;
    }

    const hasPermission = accessPermission.includes(itemKey);

    if (item.items && item.items.length > 0) {
      const filteredItems = item.items.filter(() => {
        return hasPermission;
      });

      item.items = filteredItems;

      return hasPermission && filteredItems.length > 0;
    }

    return hasPermission;
  });
};

export function AppSidebar({ ...props }) {
  const { authToken } = useAuth();
  const location = useLocation();
  const isActive = (url) => {
    return location.pathname === url;
  };

  const hasActiveChild = (items) => {
    return items.some((item) => isActive(item.url));
  };

  const getFilteredNavData = () => {
    try {
      if (!data?.navMain || !Array.isArray(data.navMain)) {
        console.log("Navigation data is invalid or missing", data.navMain);
        return [];
      }

      // Check if authToken is null or undefined
      if (
        !authToken ||
        !authToken.accesses ||
        !Array.isArray(authToken.accesses)
      ) {
        console.log(
          "Access permissions are invalid or missing",
          authToken?.accesses
        );
        return [];
      }

      return filteredNavMain(
        data.navMain,
        authToken.accesses,
        permissionMapping
      );
    } catch (error) {
      console.error("Error filtering navigation:", error);
      return [];
    }
  };

  const filteredNavData = getFilteredNavData();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <img
              src="/logo.png"
              alt="logo"
              className="h-20 w-full rounded-md mt-5"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="bg-blue-500" />
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarMenu>
            {filteredNavData.map((item) => (
              <Collapsible
                key={item.title}
                defaultOpen={hasActiveChild(item.items)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    {item.items?.length ? (
                      <SidebarMenuButton className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
                        {item.icon && <item.icon className="mr-2" />}
                        {item.title}
                        <ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <ChevronUp className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    ) : (
                      <Link to={item.url} className="w-full">
                        <SidebarMenuButton
                          className={`text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent ${
                            isActive(item.url)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : ""
                          }`}
                        >
                          {item.icon && <item.icon className="mr-2" />}
                          {item.title}
                        </SidebarMenuButton>
                      </Link>
                    )}
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(subItem.url)}
                              className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                            >
                              <Link to={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
