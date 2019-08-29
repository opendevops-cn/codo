import axios from '@/libs/api.request'

export const getGittree = () => {
    return axios.request({
        url: '/task/other/v1/git/tree/',
        method: 'get'
    })
}

export const getGittree2 = () => {
    return axios.request({
        url: '/task/other/v1/git/tree2/',
        method: 'get'
    })
}

export const getGitrepo = (git_url, group_name, searchVal) => {
    return axios.request({
        url: '/task/other/v1/git/repo/',
        method: 'get',
        params: {
            git_url,
            group_name,
            'search_val': searchVal
        }
    })
}

export const optGitrepo = (data, meth) => {
    return axios.request({
        url: '/task/other/v1/git/repo/',
        method: meth,
        data
    })
}

export const getGituser = (git_url, group_name) => {
    return axios.request({
        url: '/task/other/v1/git/user/',
        method: 'get',
        params: {
            git_url,
            group_name,
        }
    })
}

export const optGithooks = (data, meth) => {
    return axios.request({
        url: '/task/other/v1/git/hooks/',
        method: meth,
        data
    })
}

export const getGitHooklog = (search_val, git_url, relative_path, hook_name) => {
    return axios.request({
        url: '/task/other/v1/git/logs/',
        method: 'get',
        params: {
            search_val,
            git_url,
            relative_path,
            hook_name
        }
    })
}

export const optGitHooklog = (data) => {
    return axios.request({
        url: '/task/other/v1/git/logs/',
        method: 'delete',
        data
    })
}

export const getGitConflist = () => {
    return axios.request({
        url: '/task/other/v1/git/conf/',
        method: 'get'
    })
}

export const optGitconf = (data, meth) => {
    return axios.request({
        url: '/task/other/v1/git/conf/',
        method: meth,
        data
    })
}

export const Gitsync = () => {
    return axios.request({
        url: '/task/other/v1/git/sync/',
        method: 'post'
    })
}

export const getGitRepotags = (git_url, project_id) => {
    return axios.request({
        url: '/task/other/v1/git/tags/',
        method: 'get',
        params: {
            git_url,
            project_id,
        }
    })
}