interface SideNavItem {
    title: string;
    path: string;
    icon?: string;
    children?: SideNavItem[];
}

export const sideNavItems: SideNavItem[] = [
    {
        title: "Home",
        path: "/",
    },
    {
        title: "Operations",
        path: "/operations",
    }
]; 