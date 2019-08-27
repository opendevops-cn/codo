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

export const routerMap = [{
        path: '/order',
        name: 'order',
        meta: {
            icon: 'ios-menu',
            title: '订单列表'
        },
        component: Main,
        children: [{
                path: 'taskOrderList',
                name: 'taskOrderList',
                meta: {
                    icon: 'ios-options',
                    title: '任务订单'
                },
                component: () =>
                    import ('@/view/task-order/task-order-list.vue')
            },
            {
                path: 'historyTaskList',
                name: 'historyTaskList',
                meta: {
                    icon: 'ios-options',
                    title: '历史任务'
                },
                component: () =>
                    import ('@/view/task-order/history-task-list.vue')
            },
        ]
    },
    {
        path: '/taskCenter',
        name: 'taskCenter',
        meta: {
            icon: 'ios-cafe',
            title: '创建订单'
        },
        component: Main,
        children: [{
                path: 'publishApp',
                name: 'publishApp',
                meta: {
                    icon: 'ios-cafe-outline',
                    title: '发布应用'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/publish-app.vue')
            },
            {
                path: 'mysqlAudit',
                name: 'mysqlAudit',
                meta: {
                    icon: 'ios-help-circle',
                    title: 'SQL审核'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/mysql-audit.vue')
            },
            {
                path: 'mysqlOptimize',
                name: 'mysqlOptimize',
                meta: {
                    icon: 'ios-cafe',
                    title: 'SQL优化'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/mysql-optimize.vue')
            },
            {
                path: 'customTasks',
                name: 'customTasks',
                meta: {
                    icon: 'md-beer',
                    title: '自定义任务'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/task-custom.vue')
            },
            {
                path: 'customTasksProxy',
                name: 'customTasksProxy',
                meta: {
                    icon: 'md-beer',
                    title: '自定义任务-代理'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/task-custom-proxy.vue')
            },
            {
                path: 'postTasks',
                name: 'postTasks',
                meta: {
                    icon: 'md-beer',
                    title: '自定义任务-JSON'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/task-post.vue')
            }
        ]
    },
    {
        path: '/assetPurchase',
        name: 'assetPurchase',
        meta: {
            icon: 'logo-usd',
            title: '资源申购'
        },
        component: Main,
        children: [{
                path: 'assetPurchaseAWS',
                name: 'assetPurchaseAWS',
                meta: {
                    icon: 'md-cafe',
                    title: '资源申购-AWS'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/asset-purchase-aws.vue')
            },
            {
                path: 'assetPurchaseALY',
                name: 'assetPurchaseALY',
                meta: {
                    icon: 'md-cafe',
                    title: '资源申购-阿里云'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/asset-purchase-aly.vue')
            },
            {
                path: 'assetPurchaseQcloud',
                name: 'assetPurchaseQcloud',
                meta: {
                    icon: 'md-cafe',
                    title: '资源申购-腾讯云'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/asset-purchase-qcloud.vue')
            },
            {
                path: 'assetPurchaseConfig',
                name: 'assetPurchaseConfig',
                meta: {
                    icon: 'md-cafe',
                    title: '资源申请配置'
                },
                component: () =>
                    import ('@/view/tasks-center/task-submit/asset-purchase-conf.vue')
            },
        ]
    },
    // 项目发布
    // {
    //     path: '/publish_project',
    //     name: 'publish_project',
    //     meta: {
    //         icon: 'ios-boat-outline',
    //         title: '项目发布'
    //     },
    //     component: Main,
    //     children: [{
    //             path: 'publish_list',
    //             name: 'publish_list',
    //             meta: {
    //                 icon: 'ios-stats',
    //                 title: '发布列表'
    //             },
    //             component: () =>
    //                 import ('@/view/publish-store/publish-list.vue')
    //         },
    //         {
    //             path: 'project_detail/:project_id',
    //             name: 'project_detail',
    //             meta: {
    //                 hideInMenu: true,
    //                 notCache: true,
    //                 icon: 'ios-plane',
    //                 title: '项目详情'
    //             },
    //             props: true,
    //             component: () =>
    //                 import ('@/view/publish-store/publish/detail.vue')
    //         },
    //         {
    //             path: 'create_project',
    //             name: 'create_project',
    //             meta: {
    //                 icon: 'ios-plane',
    //                 title: '创建项目'
    //             },
    //             component: () =>
    //                 import ('@/view/publish-store/project-create.vue')
    //         },
    //         {
    //             path: 'project_conf',
    //             name: 'project_conf',
    //             meta: {
    //                 icon: 'ios-settings',
    //                 title: '项目配置'
    //             },
    //             component: () =>
    //                 import ('@/view/publish-store/project-conf.vue')
    //         }
    //     ]
    // },
    {
        path: '/cmdb',
        name: 'cmdb',
        meta: {
            icon: 'ios-cube',
            title: '资产管理'
        },
        component: Main,
        children: [{
                path: 'asset_server',
                name: 'asset_server',
                meta: {
                    icon: 'ios-cube',
                    title: '主机管理'
                },
                component: () =>
                    import ('@/view/cmdb2/server_mg.vue')
            },
            {
                path: 'asset_db',
                name: 'asset_db',
                meta: {
                    icon: 'ios-cube',
                    title: 'DB管理'
                },
                component: () =>
                    import ('@/view/cmdb2/db_mg.vue')
            },
            {
                path: 'log_audit',
                name: 'log_audit',
                meta: {
                    icon: 'md-build',
                    title: '日志审计'
                },
                component: () =>
                    import ('@/view/cmdb2/log_audit.vue')
            },
            {
                path: 'tag_mg',
                name: 'tag_mg',
                meta: {
                    icon: 'ios-pricetag',
                    title: '标签管理'
                },
                component: () =>
                    import ('@/view/cmdb2/tag_mg.vue')
            },
            {
                path: 'admin_user',
                name: 'admin_user',
                meta: {
                    icon: 'ios-ribbon',
                    title: '管理用户'
                },
                component: () =>
                    import ('@/view/cmdb2/admin_user.vue')
            },
            // {
            //     path: 'system_user',
            //     name: 'system_user',
            //     meta: {
            //         icon: 'ios-ribbon',
            //         title: '系统用户'
            //     },
            //     component: () =>
            //         import ('@/view/cmdb2/system_user.vue')
            // },
            {
                path: 'asset_config',
                name: 'asset_config',
                meta: {
                    icon: 'ios-hammer',
                    title: '资产配置'
                },
                component: () =>
                    import ('@/view/cmdb2/asset_config.vue')
            }
        ]
    },
    {
        path: '/web_ssh',
        name: 'web_ssh',
        meta: {
            icon: 'ios-stats',
            title: 'Web终端',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/cmdb2/webssh/web-ssh.vue')
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
        children: [{
                path: 'publishConfig',
                name: 'publishConfig',
                meta: {
                    icon: 'md-funnel',
                    title: '应用配置'
                },
                component: () =>
                    import ('@/view/tasks-center/publish-config.vue')
            },
            {
                path: 'codeRepository',
                name: 'codeRepository',
                meta: {
                    icon: 'logo-github',
                    title: '代码仓库'
                },
                component: () =>
                    import ('@/view/tasks-center/git-repo/code-repository.vue')
            },
            {
                path: 'dockerRegistry',
                name: 'dockerRegistry',
                meta: {
                    icon: 'ios-boat',
                    title: '镜像仓库'
                },
                component: () =>
                    import ('@/view/tasks-center/docker-registry.vue')
            },
            {
                path: 'tagTree',
                name: 'tagTree',
                meta: {
                    icon: 'ios-git-merge',
                    title: '标签树'
                },
                component: () =>
                    import ('@/view/tasks-center/assets/tag-tree.vue')
            },
            {
                path: 'proxyInfo',
                name: 'proxyInfo',
                meta: {
                    icon: 'ios-git-network',
                    title: '代理配置'
                },
                component: () =>
                    import ('@/view/tasks-center/assets/proxy-info.vue')
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
        children: [{
                path: 'commandlist',
                name: 'commandlist',
                meta: {
                    icon: 'ios-list-box',
                    title: '命令管理'
                },
                component: () =>
                    import ('@/view/scheduler/command-list.vue')
            },
            {
                path: 'templist',
                name: 'templist',
                meta: {
                    icon: 'ios-cafe',
                    title: '模板管理'
                },
                component: () =>
                    import ('@/view/scheduler/task-template.vue')
            },
            {
                path: 'argslist',
                name: 'argslist',
                meta: {
                    icon: 'ios-medical-outline',
                    title: '参数管理'
                },
                component: () =>
                    import ('@/view/scheduler/args-list.vue')
            },
            {
                path: 'taskuser',
                name: 'taskuser',
                meta: {
                    icon: 'ios-happy',
                    title: '执行用户'
                },
                component: () =>
                    import ('@/view/scheduler/task-user.vue')
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
        children: [{
                path: 'cronjobs',
                name: 'cronjobs',
                meta: {
                    icon: 'md-alarm',
                    title: '定时列表'
                },
                component: () =>
                    import ('@/view/cron/cron-jobs.vue')
            },
            {
                path: 'cronlogs',
                name: 'cronlogs',
                meta: {
                    icon: 'ios-list-box-outline',
                    title: '任务日志'
                },
                component: () =>
                    import ('@/view/cron/cron-logs.vue')
            }
        ]
    },
    {
        path: '/confd',
        name: 'confd',
        meta: {
            icon: 'ios-hammer',
            title: '配置中心'
        },
        component: Main,
        children: [{
                path: 'confd_project',
                name: 'confd_project',
                meta: {
                    icon: 'ios-hammer',
                    title: '配置中心'
                },
                component: () =>
                    import ('@/view/confd/project/List2.vue')
            },
            {
                path: 'confd_config/',
                name: 'confd_config',
                meta: {
                    hideInMenu: true,
                    icon: 'md-settings',
                    title: '配置管理'
                },
                component: () =>
                    import ('@/view/confd/config/List.vue')
            }
        ]
    },
    {
        path: '/domain',
        name: 'domain',
        meta: {
            icon: 'ios-cloudy',
            title: '域名管理'
        },
        component: Main,
        children: [{
                path: 'domain_name_manage',
                name: 'domain_name_manage',
                meta: {
                    icon: 'ios-cloudy',
                    title: '域名解析'
                },
                component: () =>
                    import ('@/view/domain-name/domain-name-manage.vue')
            },
            {
                path: 'domain_name_monitor',
                name: 'domain_name_monitor',
                meta: {
                    icon: 'ios-cloudy',
                    title: '域名监控'
                },
                component: () =>
                    import ('@/view/domain-name/domain-name-monitor.vue')
            }
        ]
    },
    {
        path: '/devopstools',
        name: 'devopstools',
        meta: {
            icon: 'ios-construct',
            title: '运维工具'
        },
        component: Main,
        children: [{
                path: 'paid_reminder',
                name: 'paid_reminder',
                meta: {
                    icon: 'ios-stopwatch',
                    title: '提醒管理'
                },
                component: () =>
                    import ('@/view/devops-tools/paid-reminder.vue')
            },
            {
                path: 'project_manager',
                name: 'project_manager',
                meta: {
                    icon: 'md-document',
                    title: '项目管理'
                },
                component: () =>
                    import ('@/view/devops-tools/project-manager.vue')
            },
            {
                path: 'event_manager',
                name: 'event_manager',
                meta: {
                    icon: 'ios-paper',
                    title: '事件管理'
                },
                component: () =>
                    import ('@/view/devops-tools/event-manager.vue')
            },
            {
                path: 'fault_manager',
                name: 'fault_manager',
                meta: {
                    icon: 'ios-paper',
                    title: '故障管理'
                },
                component: () =>
                    import ('@/view/devops-tools/fault-manager.vue')
            },
            {
                path: 'password_mycrypy',
                name: 'password_mycrypy',
                meta: {
                    icon: 'md-key',
                    title: '加密解密'
                },
                component: () =>
                    import ('@/view/devops-tools/password-mycrypy.vue')
            }
        ]
    },
    {
        path: '/monitoringalarm',
        name: 'monitoringalarm',
        meta: {
            icon: 'ios-notifications',
            title: '监控告警'
        },
        component: Main,
        children: [{
                path: 'zabbix_manager',
                name: 'zabbix_manager',
                meta: {
                    icon: 'logo-reddit',
                    title: 'ZABBIX管理'
                },
                component: () =>
                    import ('@/view/devops-tools/zabbix-mg.vue')
            },
            {
                path: 'prometheus_alert',
                name: 'prometheus_alert',
                meta: {
                    icon: 'ios-alert',
                    title: 'prometheus告警'
                },
                component: () =>
                    import ('@/view/devops-tools/prometheus-alert.vue')
            },
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
        children: [{
                path: 'user',
                name: 'user',
                meta: {
                    icon: 'ios-people',
                    title: '用户列表'
                },
                component: () =>
                    import ('@/view/user-manage/user.vue')
            },
            {
                path: 'functions',
                name: 'functions',
                meta: {
                    icon: 'ios-lock',
                    title: '权限列表'
                },
                component: () =>
                    import ('@/view/user-manage/functions.vue')
            },
            {
                path: 'menus',
                name: 'menus',
                meta: {
                    icon: 'ios-menu',
                    title: '菜单组件'
                },
                component: () =>
                    import ('@/view/user-manage/routescomponents.vue')
            },
            {
                path: 'role',
                name: 'role',
                meta: {
                    icon: 'ios-person',
                    title: '角色管理'
                },
                component: () =>
                    import ('@/view/user-manage/role.vue')
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
        children: [{
                path: 'system',
                name: 'system',
                meta: {
                    icon: 'ios-settings',
                    title: '系统配置'
                },
                component: () =>
                    import ('@/view/system-manage/system.vue')
            },
            {
                path: 'systemlog',
                name: 'systemlog',
                meta: {
                    icon: 'ios-paper',
                    title: '系统日志'
                },
                component: () =>
                    import ('@/view/system-manage/systemlog.vue')
            }
        ]
    }
]

export const routes = [{
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            icon: 'md-home',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/login/login.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [{
            path: '/home',
            name: 'home',
            meta: {
                hideInMenu: true,
                title: '首页',
                notCache: true,
                icon: 'md-home'
            },
            component: () =>
                import ('@/view/single-page/home')
        }]
    },
    {
        path: '/i18n',
        name: 'i18n',
        meta: {
            hideInMenu: true
        },
        component: Main,
        children: [{
            path: 'i18n_page',
            name: 'i18n_page',
            meta: {
                icon: 'md-planet',
                title: '国际化'
            },
            component: () =>
                import ('@/view/i18n/i18n-page.vue')
        }]
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
        children: [{
            path: 'join_page',
            name: 'join_page',
            meta: {
                icon: '_qq',
                title: 'QQ交流群'
            },
            component: () =>
                import ('@/view/join-page.vue')
        }]
    },
    {
        path: '/403',
        name: 'error_403',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/403.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/500.vue')
    },
    {
        path: '*',
        meta: {
            icon: 'md-home',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/404.vue')
    }
]