import axios from '@/libs/api.request';
import config from '@/config';

// 请求web Terminnal接口
export const webterminnal = (data) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/webterminnal/',
		method: 'post',
		data
	});
};

// 请求web Terminnal log接口
export const webterminnalLog = () => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/webterminnal/loginfo/',
		method: 'post',
	});
};

//批量添加主机
export const multiAddserver = (data) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/multi_add/',
		method: 'post',
		data
	});
};

// 获取AWS Events信息
export const getAwsEventslist = (key, value) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/aws_events/',
		method: 'get',
		params: {
			key,
			value
		}
	});
};

// 操作Aws Events
export const operationAwsEvents = (data, meth) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/aws_events/',
		method: meth,
		data
	});
};

//同步资产信息到Tag树
export const syncServerToTagTree = () => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/sync_tagtree/',
		method: 'get'
	});
};

//获取ErrorLog信息提示
export const getErrorLog = (key, value) => {
	return axios.request({
		url: '/cmdb2//v1/cmdb/error_log/',
		method: 'get',
		params: {
			key,
			value
		}
	});
};

//获取CMDB里面Tag Tree
export const getTagtree = (key, value) => {
	return axios.request({
		url: '/cmdb2//v1/cmdb/tree/',
		method: 'get',
		params: {
			key,
			value
		}
	});
};

//资产更新, meth post
export const assetServerUpdate = (data, meth) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/asset_update/',
		method: meth,
		data
	});
};

// // 推送主机密钥, meth post
// export const operationServerRsyncKey = (data, meth) => {
//   return axios.request({
//     url: '/cmdb2/v1/cmdb/server/rsync_key/',
//     method: meth,
//     data
//   })
// }

// 获取所有主机
export const getServerList = (page, limit, key, value) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/',
		method: 'get',
		params: {
			key,
			value,
			page,
			limit
		}
	});
};

// 获取主机详情
export const getServerDetailList = (key, value) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server_detail/',
		method: 'get',
		params: {
			// page,
			// limit,
			key,
			value
			// start_date: date[0],
			// end_date: date.length > 1 ? date[1] : ''
		}
	});
};

// 操作主机

export const operationServer = (data, meth) => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/server/',
		method: meth,
		data
	});
};

// 获取所有管理用户
export const getAdmUser = () => {
	return axios.request({
		url: '/cmdb2/v1/cmdb/admin_user/',
		method: 'get'
	});
};

// 添加或修改主机
export const addProject = (data, url, action) => {
	return axios.request({
		url: `/cmdb/v1/cmdb/server${url}`,
		method: action,
		data
	});
};

// 批量添加主机
export const multiAdd = (data) => {
	return axios.request({
		url: '/cmdb/v1/cmdb/server_multiadd/',
		method: 'post',
		data
	});
};

// 删除主机
export const delServer = (id) => {
	return axios.request({
		url: `/cmdb/v1/cmdb/server/${id}`,
		method: 'delete'
	});
};

// 批量删除主机
export const delMultiServer = (data) => {
	return axios.request({
		url: '/cmdb/v1/cmdb/server_multidel/',
		method: 'post',
		data
	});
};

// 更新资产
export const rsyncHostData = (data) => {
	return axios.request({
		url: '/cmdb/v1/cmdb/server_update/',
		method: 'post',
		data
	});
};

// 推送公钥
export const rsyncPublicKeyData = (data) => {
	return axios.request({
		url: '/cmdb/v1/cmdb/server_publickey/',
		method: 'post',
		data
	});
};

// WEB Socket
// export const webSocketUrl = 'ws://cmdb.opendevops.cn:8002/v1/cmdb/ws/terminal' 内网
// export const webSocketUrl = 'ws://demo.opendevops.cn/api/cmdb/v1/cmdb/ws/terminal' // 外网
const theDomain = process.env.NODE_ENV === 'development' ? 'demo.opendevops.cn' : config.domainName.pro;
// const theDomain = process.env.NODE_ENV === 'development' ? config.domainName.dev : config.domainName.pro
const wsuri = '/cmdb/v1/cmdb/ws/terminal';
const ws = config.isHttps ? 'wss' : 'ws';
export const webSocketUrl = ws + '://' + theDomain + '/api' + wsuri;
