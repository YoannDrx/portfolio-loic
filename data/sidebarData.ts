import type { SidebarItem } from '@/types';

export const sidebarData: SidebarItem[] = [
  {
    id: 1,
    icon: '/img/svg/home-run.svg',
    menuName: 'Home',
    routePath: '/home',
  },
  {
    id: 2,
    icon: '/img/svg/avatar.svg',
    menuName: 'About',
    routePath: '/about',
  },
  {
    id: 3,
    icon: '/img/svg/setting.svg',
    menuName: 'Service',
    routePath: '/service',
  },
  {
    id: 4,
    icon: '/img/svg/album.png',
    menuName: 'Albums',
    routePath: '/albums',
  },
  {
    id: 5,
    icon: '/img/svg/camera.png',
    menuName: 'Videos',
    routePath: '/videos',
  },
];
