import axios from '../http'
const isDev = process.env.NODE_ENV === "production" ? false : true;

function Axios(options) {
    var requestObj = {
        url: options.url,
        method: options.method ? options.method : "get",
        data: options.data ? options.data : ''
    };
    return requestObj;
}

//人员管理
export function controlUser(url,obj) {
    var temp = Object.assign({
        url: isDev ? `/api/users/${url}` : "线上地址",
        method: 'post',
        data: obj
    }, {});
    return axios(Axios(temp));
}

//请假添加
export function controlWeek(url, obj) {
    var temp = Object.assign({
        url: isDev ? `/api/Week/${url}` : "线上地址",
        method: 'post',
        data: obj
    }, {});
    return axios(Axios(temp));
}
//请假查询
export function getWeek(id = '') {
    let temp = Object.assign({
        url: isDev ? `/api/Week/${id}` : "线上地址"
    }, {});
    return axios(Axios(temp));
}
//项目查询
export function getProfiles() {
    var temp = Object.assign({
        url: isDev ? "/api/profiles" : "线上地址"
    }, {});
    return axios(Axios(temp));
}
//项目删除
export function deleteProfiles(id) {
    var temp = Object.assign({
        url: isDev ? `/api/profiles/delete/${id}` : "线上地址",
        method: 'delete'
    }, {});
    return axios(Axios(temp));
}
//项目增改
export function controlProfiles(url, obj) {
    var temp = Object.assign({
        url: isDev ? `/api/profiles/${url}` : "线上地址",
        method: 'post',
        data: obj
    }, {});
    return axios(Axios(temp));
}