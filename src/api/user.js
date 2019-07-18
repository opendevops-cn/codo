import axios from '@/libs/api.request'

export const login = (data) => {
    return axios.request({
        url: '/accounts/login/',
        data,
        method: 'post'
    })
}

export const logout = (token) => {
    return axios.request({
        url: 'logout',
        method: 'post'
    })
}

export const authorization = () => {
    return axios.request({
        url: '/accounts/authorization/',
        method: 'get'
    })
}

export const password = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/password/',
        method: 'patch',
        data
    })
}

export const register = (data) => {
    return axios.request({
        url: '/accounts/register/',
        method: 'post',
        data
    })
}

export const getuserlist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/user/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const getUsertree = () => {
    return axios.request({
        url: '/mg/v2/accounts/user/tree/',
        method: 'get'
    })
}

export const newuser = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/user/',
        method: 'post',
        data
    })
}

export const deluser = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/user/',
        method: 'delete',
        data
    })
}

export const updateuser = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/user/',
        method: 'put',
        data
    })
}

export const patchuser = (data) => {
        return axios.request({
            url: '/mg/v2/accounts/user/',
            method: 'patch',
            data
        })
    }
    // reset
export const resetMFA = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/reset_mfa/',
        method: 'put',
        data
    })
}

export const resetPassword = (data) => {
        return axios.request({
            url: '/mg/v2/accounts/reset_pw/',
            method: 'put',
            data
        })
    }
    // token
export const getToken = (data) => {
        return axios.request({
            url: '/mg/v2/accounts/token/',
            method: 'put',
            data
        })
    }
    // role
export const getrolelist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/role/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const operationRole = (data, meth) => {
    return axios.request({
        url: '/mg/v2/accounts/role/',
        method: meth,
        data
    })
}

export const getUserByRole = (roleId) => {
    return axios.request({
        url: '/mg/v2/accounts/role_user/',
        method: 'get',
        params: {
            role_id: roleId
        }
    })
}

export const operationRoleUser = (data, meth) => {
    return axios.request({
        url: '/mg/v2/accounts/role_user/',
        method: meth,
        data
    })
}

// 获取用户后端权限列表
export const getFuncslist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/func/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const getFuncsByRole = (roleId) => {
    return axios.request({
        url: '/mg/v2/accounts/role_func/',
        method: 'get',
        params: {
            role_id: roleId
        }
    })
}

export const operationFunc = (data, meth) => {
    return axios.request({
        url: '/mg/v2/accounts/func/',
        method: meth,
        data
    })
}

export const operationRoleFunc = (data, meth) => {
        return axios.request({
            url: '/mg/v2/accounts/role_func/',
            method: meth,
            data
        })
    }
    // 获取用户前端菜单
export const getMenuslist = (key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/menus/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}

export const getMenusByRole = (roleId) => {
    return axios.request({
        url: '/mg/v2/accounts/role_menu/',
        method: 'get',
        params: {
            role_id: roleId
        }
    })
}

export const operationMenu = (data, meth) => {
    return axios.request({
        url: '/mg/v2/accounts/menus/',
        method: meth,
        data
    })
}

export const operationRoleMenu = (data, meth) => {
        return axios.request({
            url: '/mg/v2/accounts/role_menu/',
            method: meth,
            data
        })
    }
    // 组件
export const getComponentslist = (key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/components/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}

export const getComponentByRole = (roleId) => {
    return axios.request({
        url: '/mg/v2/accounts/role_comp/',
        method: 'get',
        params: {
            role_id: roleId
        }
    })
}

export const operationComponent = (data, meth) => {
    return axios.request({
        url: '/mg/v2/accounts/components/',
        method: meth,
        data
    })
}

export const operationRoleComponent = (data, meth) => {
    return axios.request({
        url: '/mg/v2/accounts/role_comp/',
        method: meth,
        data
    })
}