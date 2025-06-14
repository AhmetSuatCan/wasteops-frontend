import { RiDashboardLine, RiBuildingLine } from 'react-icons/ri';
import { BsCalendarCheck, BsPeople } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface SideNavItem {
    title: string;
    path: string;
    icon: IconType;
    children?: SideNavItem[];
}

export const employeeSideNavItems: SideNavItem[] = [
    {
        title: "Anasayfa",
        path: "/dashboard",
        icon: RiDashboardLine
    },
    {
        title: "Vardiyalarım",
        path: "/dashboard/my-shifts",
        icon: BsCalendarCheck
    },
    {
        title: "Ekibim",
        path: "/dashboard/my-team",
        icon: BsPeople
    },
    {
        title: "Organizasyonum",
        path: "/dashboard/my-organization",
        icon: RiBuildingLine
    }
]; 