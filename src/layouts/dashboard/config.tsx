import { RiDashboardLine, RiMapLine, RiBuildingLine } from 'react-icons/ri';
import { BsTruck, BsPeople, BsCalendarCheck, BsPersonLinesFill } from 'react-icons/bs';
import { MdOutlineInventory, MdDirectionsCar } from 'react-icons/md';
import { IconType } from 'react-icons';

interface SideNavItem {
    title: string;
    path: string;
    icon: IconType;
    children?: SideNavItem[];
}

export const adminSideNavItems: SideNavItem[] = [
    {
        title: "Anasayfa",
        path: "/dashboard",
        icon: RiDashboardLine
    },

    {
        title: "Operasyonlar",
        path: "dashboard/operasyonlar",
        icon: BsCalendarCheck,
        children: [
            {
                title: "Vardiyalar",
                path: "/dashboard/operasyonlar/vardiyalar",
                icon: BsCalendarCheck
            },
            {
                title: "Ekipler",
                path: "/dashboard/operasyonlar/ekipler",
                icon: BsPeople
            }
        ]
    },
    {
        title: "İnsan Kaynakları",
        path: "/insan-kaynaklari",
        icon: BsPersonLinesFill,
        children: [
            {
                title: "Katılım Kodları",
                path: "/dashboard/insan-kaynaklari/kodlar",
                icon: BsPersonLinesFill
            },
            {
                title: "Çalışanlar",
                path: "/dashboard/insan-kaynaklari/calisanlar",
                icon: BsPeople
            }
        ]
    },
    {
        title: "Tesisler",
        path: "/dashboard/tesisler",
        icon: RiBuildingLine
    },
    {
        title: "Filo",
        path: "/dashboard/filo",
        icon: MdDirectionsCar
    },
    {
        title: "Harita",
        path: "/dashboard/harita",
        icon: RiMapLine
    }
]; 