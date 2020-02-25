import Dashboard from "views/Dashboard.jsx";
import Notifications from "views/Notifications.jsx";
import Icons from "views/Icons.jsx";
import Typography from "views/Typography.jsx";
import TableList from "views/Tables.jsx";
import Maps from "views/Map.jsx";
import UserPage from "views/User.jsx";
import Logout from "views/Logout.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "ภาพรวมโครงการ",
    icon: "nc-icon nc-chart-bar-32",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "คำขอที่ยังไม่ดำเนินการ",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/tables",
    name: "รายการทั้งหมด",
    icon: "nc-icon nc-bullet-list-67",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "แผนที่",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "จัดทำเอกสาร",
    icon: "nc-icon nc-single-copy-04",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/user-page",
    name: "จัดการสิทธิ์เข้าใช้ระบบ",
    icon: "nc-icon nc-badge",
    component: UserPage,
    layout: "/admin"
  },
  /*
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin"
  },
  */
  {
    pro: true,
    path: "/Logout",
    name: "ออกจากระบบ",
    icon: "nc-icon nc-user-run",
    component: Logout,
    layout: "/admin"
  }
];
export default routes;
