import Dashboard from "views/Dashboard.jsx";
import Notifications from "views/Notifications.jsx";
import Icons from "views/Icons.jsx";
import Typography from "views/Typography.jsx";
import TableList from "views/Tables.jsx";
import Maps from "views/Map.jsx";
import UserPage from "views/User.jsx";
import UpgradeToPro from "views/Upgrade.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "หน้าหลัก",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "รายการคำขอ",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/tables",
    name: "รายการทั้งหมด",
    icon: "nc-icon nc-tile-56",
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
    name: "รายงานสรุปผล",
    icon: "nc-icon nc-caps-small",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/user-page",
    name: "จัดการสิทธิ์เข้าใช้ระบบ",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/admin"
  },
  {
    pro: true,
    path: "/upgrade",
    name: "ออกจากระบบ",
    icon: "nc-icon nc-user-run",
    component: UpgradeToPro,
    layout: "/admin"
  }
];
export default routes;
