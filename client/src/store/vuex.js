let Vue

function install(_Vue) {
    Vue = _Vue
    _Vue.mixin({
        beforeCreate() {
            // 在vue原型上注册$store
            if (this.$options && this.$options.store) {
                Vue.util.defineReactive(this, "$store", this.$options.store)
            } else {
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    })
}

class Store {
    constructor(options) {
        Vue.util.defineReactive(this, "state", options.state)
        this.getters = {}
        this.mutations = options.mutations || {}
        this.actions = options.actions || {}
        Object.keys(options.getters).forEach(key => {
            Object.defineProperty(this.getters, key, {
                get: () => {
                    return options.getters[key](this.state)
                }
            })
        })
    }

    // 实现commit方法
    commit(type, pyload) {
        this.mutations[type](this.state, pyload)
    }

    // 实现dispatch方法
    dispatch(type, pyload) {
        this.actions[type]({
                state: this.state,
                commit: this.commit.bind(this)
            },
            pyload
        )
    }
}

export default {
    Store,
    install
}
/**
 * 这样导出 相当于
 * const Vuex={Store,install}
 * export default  Vuex
 *
 *之所以这样导出 是因为使用的时候是 new Vuex.Store()
 */
