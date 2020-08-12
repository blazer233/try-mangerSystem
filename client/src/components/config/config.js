export const Config = {
    indexTable: {
        table: [{
                prop: "date",
                label: "创建/修改 时间",
                type: 'date'
            },
            {
                prop: "type",
                label: "收支类型",
            },
            {
                prop: "describe",
                label: "收支描述",
            },
            {
                prop: "income",
                label: "收入",
            },
            {
                prop: "expend",
                label: "支出",
            },
            {
                prop: "cash",
                label: "账户现金",
            },
            {
                prop: "remark",
                label: "备注",
            },
            {
                prop: "file",
                label: "档案",
                type: 'file'
            },
            {
                type: "btn_0",
                label: '操作',
            }
        ],
        table_employee: [{
                prop: "date",
                label: "创建时间",
                type: 'date'
            },
            {
                prop: "type",
                label: "收支类型",
            },
            {
                prop: "describe",
                label: "收支描述",
            },
            {
                prop: "income",
                label: "收入",
            },
            {
                prop: "expend",
                label: "支出",
            },
            {
                prop: "cash",
                label: "账户现金",
            },
            {
                prop: "remark",
                label: "备注",
            },
            {
                prop: "file",
                label: "档案",
                type: 'file'
            }
        ],
        search: [{
            label: '投标时间筛选:',
            prop: "date",
            width: 4,
            controlType: "5",
        }]
    },
    dialog: {
        search: [{
            label: '收支类型:',
            prop: "type",
            width: 4,
            controlType: "3",
            options: [{
                label: '提现',
                value: '提现'
            }, {
                label: '提现手续费',
                value: '提现手续费'
            }, {
                label: '充值',
                value: '充值'
            }, {
                label: '优惠券',
                value: '优惠券'
            }, {
                label: '充值礼券',
                value: '充值礼券'
            }, {
                label: '转账',
                value: '转账'
            }],
            required: true
        }, {
            prop: "toFile",
            controlType: "6",
        }, {
            label: '收支描述:',
            prop: "describe",
            width: 4,
            controlType: "",
        }, {
            label: '收入:',
            prop: "income",
            width: 4,
            controlType: "",
        }, {
            label: '支出:',
            prop: "expend",
            width: 4,
            controlType: "",
        }, {
            label: '账户现金:',
            prop: "cash",
            width: 4,
            controlType: "",
            required: true
        }, {
            label: '备注:',
            prop: "remark",
            width: 4,
            controlType: "8",
        }]
    },
    weekTable: {
        table: [{
                label: "请假时间",
                type: 'date_week',
                width: '200rem'
            },
            {
                prop: "region",
                label: "请假类型",
            },
            {
                prop: "delivery",
                label: "是否带薪",
                type: 'delivery'
            },
            {
                prop: "isPass",
                label: "是否批准",
                type: 'isPass'
            },
            {
                prop: "passRes",
                label: "审批建议",
            }
        ],
        search: [{
            label: '直接主管:',
            prop: "find_id",
            width: 4,
            remoteMethodName: "personGet",
            controlType: "4",
            required: true
        }, {
            label: '请假类型:',
            prop: "region",
            width: 4,
            controlType: "3",
            options: [{
                label: '事假',
                value: '事假'
            }, {
                label: '产假',
                value: '产假'
            }, {
                label: '病假',
                value: '病假'
            }, {
                label: '丧假',
                value: '丧假'
            }, ]
        }, {
            label: '请假时间:',
            prop: "date",
            width: 4,
            controlType: "5",
            daterangeClass: 'dateClass'
        }, {
            label: '是否带薪办公:',
            prop: "delivery",
            width: 2,
            controlType: "7",
            radioData: [{
                    name: "是",
                    value: 1
                },
                {
                    name: "否",
                    value: 2
                }
            ],
        }, {
            label: '请假原因:',
            prop: "desc",
            width: 4,
            controlType: "9",
        }]
    },
    controlUser: {
        reg_search: [{
            label: '用户名：',
            prop: "username",
            width: 4,
            controlType: "",
        }, {
            label: '邮箱：',
            prop: "email",
            width: 4,
            controlType: "",
        }, {
            label: '密码：',
            prop: "password",
            width: 4,
            controlType: "10",
        }, {
            label: '确认密码：',
            prop: "password2",
            width: 4,
            controlType: "10",
        }, {
            label: '选择身份：',
            prop: "identity",
            width: 2,
            controlType: "3",
            options: [{
                label: '管理员',
                value: true
            }, {
                label: '员工',
                value: false
            }],
        }],
        log_search: [{
            label: '邮箱：',
            prop: "email_log",
            width: 4,
            controlType: "",
        }, {
            label: '密码：',
            prop: "password_log",
            width: 4,
            controlType: "10",
        }]
    },
    weekTable_employer: {
        table: [{
                label: "请假时间",
                type: 'date_week',
                width: '200rem'
            },
            {
                prop: "region",
                label: "请假类型",
            },
            {
                prop: "delivery",
                label: "是否带薪",
                type: 'delivery'
            },
            {
                prop: "isPass",
                label: "是否批准",
                type: 'isPass'
            },
            {
                prop: "passRes",
                label: "审批建议",
            },
            {
                label: "操作",
                type: 'btn_1'
            }
        ],
        search: [{
            label: '是否批准:',
            prop: "isPass",
            width: 2,
            controlType: "7",
            radioData: [{
                    name: "是",
                    value: 1
                },
                {
                    name: "否",
                    value: 2
                }
            ],
        }, {
            label: '建议:',
            prop: "passRes",
            width: 4,
            controlType: "8",
        }]
    },
    controlType: {
        "0": "input",
        "1": "tree",
        "2": "date",
        "3": "select",
        "4": "inputselect",
        "5": "daterange",
        "6": "file",
        "7": "radio",
        "8": "textare",
        "9": "quill",
        "10": "password",
    },
    rules_: {
        rules_0: {},
        rules_1: {
            type: [{
                required: true,
                message: "收支类型不能为空",
                trigger: "blur"
            }],
            cash: [{
                required: true,
                message: "账户现金不能为空",
                trigger: "blur"
            }]
        },
        rules_2: {
            desc: [{
                required: true,
                message: "请假描述不能为空",
                trigger: "blur"
            }],
            date: [{
                required: true,
                message: "请填写请假时间",
                trigger: "blur"
            }],
            delivery: [{
                required: true,
                message: "请选择是否带薪",
                trigger: "blur"
            }],
            region: [{
                required: true,
                message: "请选择请假类型",
                trigger: "blur"
            }]
        },
        rules_3: {
            isPass: [{
                required: true,
                message: "请审批",
                trigger: "blur"
            }]
        },
        rules_4: {
            email_log: [{
                type: "email",
                required: true,
                message: "邮箱格式不正确",
                trigger: blur
            }],
            password_log: [{
                    required: true,
                    message: "密码不能为空",
                    trigger: "blur"
                },
                {
                    min: 6,
                    max: 15,
                    message: "密码长度在6-15字符之间",
                    trigger: "blur"
                }
            ]
        },
        rules_5: {
            username: [{
                    required: true,
                    message: "用户名不能为空",
                    trigger: "blur"
                },
                {
                    min: 2,
                    max: 15,
                    message: "长度在2-15字符之间",
                    trigger: "blur"
                }
            ],
            email: [{
                required: true,
                type: "email",
                message: "邮箱格式不正确",
                trigger: "blur"
            }],
            password: [{
                    required: true,
                    message: "密码不能为空",
                    trigger: "blur"
                },
                {
                    min: 6,
                    max: 15,
                    message: "密码长度在6-15字符之间",
                    trigger: "blur"
                }
            ],
            password2: [{
                    required: true,
                    message: "密码不能为空",
                    trigger: "blur"
                },
                {
                    min: 6,
                    max: 15,
                    message: "密码长度在6-15字符之间",
                    trigger: "blur"
                },
                {
                    min: 6,
                    max: 15,
                    message: "密码长度在6-15字符之间",
                    trigger: "blur"
                }
            ],
            identity: []
        }
    }
}
