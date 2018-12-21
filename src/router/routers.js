import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export const routerMap = [
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      title: '首页',
      icon: 'md-home',
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      icon: 'ios-menu',
      title: '订单列表'
    },
    component: Main,
    children: [
      {
        path: 'taskOrderList',
        name: 'taskOrderList',
        meta: {
          icon: 'md-reorder',
          title: '任务订单'
        },
        component: () => import('@/view/task-order/task-order-list.vue')
      },
      {
        path: 'publishApp',
        name: 'publishApp',
        meta: {
          icon: 'md-add',
          title: '发布应用'
        },
        component: () => import('@/view/task-order/publish-app.vue')
      },
      {
        path: 'mysqlAudit',
        name: 'mysqlAudit',
        meta: {
          icon: 'ios-help-circle',
          title: 'SQL审核'
        },
        component: () => import('@/view/task-order/publish-app.vue')
      },
      {
        path: 'mysqlOptimize',
        name: 'mysqlOptimize',
        meta: {
          icon: 'md-alarm',
          title: 'SQL优化'
        },
        component: () => import('@/view/task-order/publish-app.vue')
      },
      {
        path: 'resourceApplication',
        name: 'resourceApplication',
        meta: {
          icon: 'md-alarm',
          title: '资源申请'
        },
        component: () => import('@/view/task-order/publish-app.vue')
      },
      {
        path: 'customTasks',
        name: 'customTasks',
        meta: {
          icon: 'md-alarm',
          title: '自定义任务'
        },
        component: () => import('@/view/task-order/publish-app.vue')
      }
    ]
  },
  {
    path: '/i18n',
    name: 'i18n',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'i18n_page',
        name: 'i18n_page',
        meta: {
          icon: 'md-planet',
          title: '国际化'
        },
        component: () => import('@/view/i18n/i18n-page.vue')
      }
    ]
  },
  //
  {
    path: '/k8s',
    name: 'k8s',
    meta: {
      icon: 'ios-boat-outline',
      title: 'K8S发布'
    },
    component: Main,
    children: [
      {
        path: 'project/',
        name: 'project',
        meta: {
          icon: 'ios-star',
          title: '项目列表'
        },
        component: () => import('@/view/k8s/project/List.vue')
      },
      {
        path: 'app/',
        name: 'app',
        meta: {
          icon: 'ios-plane',
          title: '应用列表'
        },
        component: () => import('@/view/k8s/app/List.vue')
      },
      {
        path: 'publish/:id',
        name: 'project_publish',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/k8s/project/Publish.vue')
      },
      {
        path: '/',
        name: 'publish_list',
        meta: {
          icon: 'ios-stats',
          title: '发布列表'
        },
        component: () => import('@/view/k8s/publish/List.vue')
      }
    ]
  },
  {
    path: '/terminal',
    name: 'WebSSH',
    meta: {
      title: 'WebSSH',
      hideInMenu: true
    },
    component: () => import('@/view/cmdb/webssh/WebSSH.vue')
  },
  {
    path: '/record',
    name: 'SshRecord',
    meta: {
      title: '操作回放',
      hideInMenu: true
    },
    component: () => import('@/view/cmdb/webssh/Record.vue')
  },
  {
    path: '/cmdb',
    name: 'cmdb',
    meta: {
      icon: 'ios-cube',
      title: '资产管理'
    },
    component: Main,
    children: [
      {
        path: 'server',
        name: 'server_list',
        meta: {
          icon: 'ios-build',
          title: '主机管理'
        },
        component: () => import('@/view/cmdb/server/List.vue')
      },
      {
        path: 'server_log',
        name: 'server_log',
        meta: {
          icon: 'md-build',
          title: '日志审计'
        },
        component: () => import('@/view/cmdb/server_log/List.vue')
      },
      {
        path: 'server_auth',
        name: 'server_auth',
        meta: {
          icon: 'ios-brush',
          title: '授权规则'
        },
        component: () => import('@/view/cmdb/server_auth/List.vue')
      },
      {
        path: 'server_group',
        name: 'server_group',
        meta: {
          icon: 'ios-browsers',
          title: '主机组'
        },
        component: () => import('@/view/cmdb/server_group/List.vue')
      },
      {
        path: 'tag',
        name: 'tag',
        meta: {
          icon: 'ios-pricetag',
          title: '标签管理'
        },
        component: () => import('@/view/cmdb/tag/List.vue')
      },
      {
        path: 'adm_user',
        name: 'adm_user',
        meta: {
          icon: 'ios-ribbon',
          title: '管理用户'
        },
        component: () => import('@/view/cmdb/adm_user/List.vue')
      }
    ]
  },
  //
  {
    path: '/operation_center',
    name: 'operation_center',
    meta: {
      icon: 'md-boat',
      title: '作业配置'
    },
    component: Main,
    children: [
      {
        path: 'publishConfig',
        name: 'publishConfig',
        meta: {
          icon: 'md-funnel',
          title: '发布配置'
        },
        component: () => import('@/view/tasks-config-center/publish-config.vue')
      },
      {
        path: 'codeRepository',
        name: 'codeRepository',
        meta: {
          icon: 'logo-github',
          title: '代码仓库'
        },
        component: () => import('@/view/tasks-config-center/code-repository.vue')
      },
      {
        path: 'dockerRegistry',
        name: 'dockerRegistry',
        meta: {
          icon: 'ios-boat',
          title: '镜像仓库'
        },
        component: () => import('@/view/tasks-config-center/docker-registry.vue')
      },
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'md-funnel',
          title: '二级-1'
        },
        component: () => import('@/view/multilevel/level-2-1.vue')
      }
    ]
  },
  {
    path: '/task_layout',
    name: 'task_layout',
    meta: {
      icon: 'md-planet',
      // showAlways: true,
      title: '模板配置'
    },
    component: Main,
    children: [
      {
        path: 'commandlist',
        name: 'commandlist',
        meta: {
          icon: 'ios-list-box',
          title: '命令管理'
        },
        component: () => import('@/view/scheduler/command-list.vue')
      },
      {
        path: 'templist',
        name: 'templist',
        meta: {
          icon: 'ios-cafe',
          title: '模板管理'
        },
        component: () => import('@/view/scheduler/task-template.vue')
      },
      {
        path: 'argslist',
        name: 'argslist',
        meta: {
          icon: 'ios-medical-outline',
          title: '参数管理'
        },
        component: () => import('@/view/scheduler/args-list.vue')
      },
      {
        path: 'taskuser',
        name: 'taskuser',
        meta: {
          icon: 'ios-happy',
          title: '执行用户'
        },
        component: () => import('@/view/scheduler/task-user.vue')
      }
    ]
  },
  {
    path: '/cron',
    name: 'cron',
    meta: {
      icon: 'ios-alarm',
      title: '定时任务'
    },
    component: Main,
    children: [
      {
        path: 'cronjobs',
        name: 'cronjobs',
        meta: {
          icon: 'md-alarm',
          title: '定时列表'
        },
        component: () => import('@/view/cron/cron-jobs.vue')
      },
      {
        path: 'cronlogs',
        name: 'cronlogs',
        meta: {
          icon: 'ios-list-box-outline',
          title: '任务日志'
        },
        component: () => import('@/view/cron/cron-logs.vue')
      }
    ]
  },
  {
    path: '/usermanage',
    name: 'usermanage',
    meta: {
      icon: 'md-contacts',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'ios-people',
          title: '用户列表'
        },
        component: () => import('@/view/user-manage/user.vue')
      },
      {
        path: 'functions',
        name: 'functions',
        meta: {
          icon: 'ios-lock',
          title: '权限列表'
        },
        component: () => import('@/view/user-manage/functions.vue')
      },
      {
        path: 'menus',
        name: 'menus',
        meta: {
          icon: 'ios-menu',
          title: '菜单组件'
        },
        component: () => import('@/view/user-manage/routescomponents.vue')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'ios-person',
          title: '角色管理'
        },
        component: () => import('@/view/user-manage/role.vue')
      }
    ]
  },
  {
    path: '/systemmanage',
    name: 'systemmanage',
    meta: {
      icon: 'md-settings',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'system',
        name: 'system',
        meta: {
          icon: 'ios-settings',
          title: '系统配置'
        },
        component: () => import('@/view/system-manage/system.vue')
      },
      {
        path: 'systemlog',
        name: 'systemlog',
        meta: {
          icon: 'ios-paper',
          title: '系统日志'
        },
        component: () => import('@/view/system-manage/systemlog.vue')
      }
    ]
  }
]

export const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      icon: 'md-home',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/doc',
    name: 'doc',
    meta: {
      title: '官方文档',
      href: 'http://docs.opendevops.cn/zh/latest/',
      icon: 'ios-book'
    }
  },
  {
    path: '/join',
    name: 'join',
    component: Main,
    children: [
      {
        path: 'join_page',
        name: 'join_page',
        meta: {
          icon: '_qq',
          title: 'QQ交流群'
        },
        component: () => import('@/view/join-page.vue')
      }
    ]
  },
  {
    path: '/403',
    name: 'error_403',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/403.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    meta: {
      icon: 'md-home',
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
