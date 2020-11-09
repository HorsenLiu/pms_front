import Vue from 'vue';
import Router from 'vue-router';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from '../views/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '任务管理系统首页', icon: 'dashboard' }
      }
    ]
  },

  // 项目管理
  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: 'Project',
    meta: { title: '项目管理', icon: 'clipboard' },
    children: [
      {
        path: 'list',
        name: 'ProjectList',
        component: () => import('@/views/project/list'),
        meta: { title: '项目列表' }
      },
      {
        path: 'create',
        name: 'ProjectCreate',
        component: () => import('@/views/project/form'),
        meta: { title: '添加项目' }
      },
      {
        path: 'edit/:id',
        name: 'ProjectEdit',
        component: () => import('@/views/project/form'),
        meta: { title: '编辑任务', noCache: true },
        hidden: true
      }
    ]
  },
  // 任务管理
  {
    path: '/task',
    component: Layout,
    redirect: '/task/list',
    name: 'Task',
    meta: { title: '任务管理', icon: 'list' },
    children: [
      {
        path: 'list',
        name: 'TaskList',
        component: () => import('@/views/task/list'),
        meta: { title: '任务列表' }
      },
      {
        path: 'create',
        name: 'TaskCreate',
        component: () => import('@/views/task/form'),
        meta: { title: '添加任务' }
      },
      {
        path: 'edit/:id',
        name: 'TaskEdit',
        component: () => import('@/views/task/form'),
        meta: { title: '编辑任务', noCache: true },
        hidden: true
      }
    ]
  },
  // 员工管理
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/list',
    name: 'Staff',
    meta: { title: '员工管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'StaffList',
        component: () => import('@/views/staff/list'),
        meta: { title: '员工列表' }
      },
      {
        path: 'create',
        name: 'StaffCreate',
        component: () => import('@/views/staff/form'),
        meta: { title: '添加员工' }
      },
      {
        path: 'edit/:id',
        name: 'StaffEdit',
        component: () => import('@/views/staff/form'),
        meta: { title: '编辑员工', noCache: true },
        hidden: true
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
