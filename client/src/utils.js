/**
 * @desc 函数防抖
 * @param fn 目标函数
 * @param wait 延迟执行毫秒数
 */
export const debounce = function (fn, wait) {
    let _ = ''
    return function (...arg) {
        clearTimeout(_)
        _ = setTimeout(() => {
            fn.apply(this, arg)
        }, wait)
    }
}
/**
 * 函数节流
 * @desc 函数节流
 * @param fn 目标函数
 * @param wait 延迟执行毫秒数
 */
export const throttle = function (fn, wait) {
    let lastTime = +new Date(),
        _ = ''
    return function (...arg) {
        let last = +new Date() - lastTime
        if (last > s) {
            _ = setTimeout(() => {
                fn.apply(this, arg);
                _ = ''
            }, s)
            lastTime = +new Date()
        }
    }
}
/**
 * 金额加点
 * @param {number} num
 */
export function toThousandFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 对象拷贝
 * @param {target} Object 原对象
 */
export const clone = function (target, map = new WeakMap()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        for (const key in target) {
            cloneTarget[key] = clone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
/**
 * 数组分块
 * @param {Array} arr 原数组
 * @param {Number} size 分块数量
 */
export const chunk = (arr, size) => {
    return Array.from({
        length: Math.ceil(arr.length / size)
    }, (item, index) => {
        return arr.slice(index * size, index * size + size);
    });
};
/**
 * 值检查
 * @param {value} 所有类型
 */
export const isEmpty = function (value) {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
}

export const DateFormat = function (time) {
    return new Date(parseInt(time) + 8 * 3600 * 1000).toJSON().substr(0, 19).replace('T', ' ')
}
//"2020-07-07 10:08:19"
