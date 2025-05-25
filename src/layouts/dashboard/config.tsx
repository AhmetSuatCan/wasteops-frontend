import { RiDashboardLine, RiMapLine } from 'react-icons/ri';
import { BsTruck, BsPeople, BsCalendarCheck, BsPersonLinesFill } from 'react-icons/bs';
import { MdOutlineInventory, MdDirectionsCar } from 'react-icons/md';
import { IconType } from 'react-icons';

interface SideNavItem {
    title: string;
    path: string;
    icon: IconType;
    children?: SideNavItem[];
}

export const sideNavItems: SideNavItem[] = [
    {
        title: "Anasayfa",
        path: "/anasayfa",
        icon: RiDashboardLine
    },
    {
        title: "Operasyonlar",
        path: "/operasyonlar",
        icon: BsCalendarCheck,
        children: [
            {
                title: "Vardiyalar",
                path: "/operasyonlar/vardiyalar",
                icon: BsCalendarCheck
            },
            {
                title: "Ekipler",
                path: "/operasyonlar/ekipleri",
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
                path: "/insan-kaynaklari/katilim-kodlari",
                icon: BsPersonLinesFill
            },
            {
                title: "Çalışanlar",
                path: "/insan-kaynaklari/calisanlar",
                icon: BsPeople
            }
        ]
    },
    {
        title: "Filo",
        path: "/filo",
        icon: MdDirectionsCar
    },
    {
        title: "Harita",
        path: "/harita",
        icon: RiMapLine
    }
]; 