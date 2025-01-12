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

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const isActive = (url) => {
    return location.pathname === url;
  };

  const hasActiveChild = (items) => {
    return items.some((item) => isActive(item.url));
  };

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
            {data.navMain.map((item) => (
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
