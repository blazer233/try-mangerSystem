import axios_ from '../http'
const isDev = process.env.NODE_ENV === "production" ? false : true;
function Axios(options) {
    var requestObj = {
        url: options.url,
        method: options.method ? options.method : "get",
        data: options.data ? options.data : ''
    };
    return requestObj;
}

//self
export function self() {
    var temp = Object.assign({
        url: isDev ? `/users/pre` : `/users/pre`,
    }, {});
    return axios_(Axios(temp));
}

//人员查找
export function findUser(userName) {
    var temp = Object.assign({
        url: isDev ? `/users/all?userName=${userName}` : `/users/all?userName=${userName}`,
    }, {});
    return axios_(Axios(temp));
}

//人员管理
export function controlUser(url, obj) {
    var temp = Object.assign({
        url: isDev ? `/users${url}` : `/users${url}`,
        method: 'post',
        data: obj
    }, {});
    return axios_(Axios(temp));
}

//请假添加
export function controlWeek(url, obj) {
    var temp = Object.assign({
        url: isDev ? `/Week/${url}` : `/Week/${url}`,
        method: 'post',
        data: obj
    }, {});
    return axios_(Axios(temp));
}
//请假查询
export function getWeek(id = '', url) {
    let temp = Object.assign({
        url: isDev ? `/Week/${url}?id=${id}` : `/Week/${url}?id=${id}`
    }, {});
    return axios_(Axios(temp));
}
//项目查询
export function getProfiles(obj) {
    var temp = Object.assign({
        url: isDev ? "/profiles" : "/profiles",
        method: 'post',
        data: obj
    }, {});
    return axios_(Axios(temp));
}
//项目删除
export function deleteProfiles(id) {
    var temp = Object.assign({
        url: isDev ? `/profiles/delete/${id}` : `/profiles/delete/${id}`,
        method: 'delete'
    }, {});
    return axios_(Axios(temp));
}
//项目增改
export function controlProfiles(url, obj) {
    var temp = Object.assign({
        url: isDev ? `/profiles/${url}` : `/profiles/${url}`,
        method: 'post',
        data: obj
    }, {});
    return axios_(Axios(temp));
}
//部门查询
export function getDepartment() {
    var temp = Object.assign({
        url: isDev ? `/department/all` : "/department/all",
    }, {});
    return axios_(Axios(temp));
}
//部门增改
export function ctrlDepartment(url, obj) {
    var temp = Object.assign({
        url: isDev ? `/department/${url}` : `/department/${url}`,
        data: obj,
        method: 'post'
    }, {});
    return axios_(Axios(temp));
}
