<style lang="less">
    .wj-clear {
        clear: left;
    }
    .icon-form-close {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 9;
    }
    .index {
        width: 200px;
        margin: auto;
        text-align: center;
    }

    .creator {
        width: 100px;
        height: 50px;
        line-height: 50px;
        background: #eee;
        border: 1px solid #ccc;
        margin: 10px auto;
    }
    .flows {
        height: auto;
        background: lavender;
        margin: auto;

        .flows-item {
            float: left;
            text-align: center;
        }
    }

    .left, .right, .edit {
        width: 500px;
        height: 800px;
        float: left;
        border: 1px solid #ccc;
    }
    .edit {
        text-align: left;
    }
    .font-bold {
        font-weight: bold;
    }

    .left {
        .left-content {
            div {
                width: 100%;
                height: 50px;
                line-height: 50px;
                text-align: center;
                float: left;
                background: #eee;
                border: 1px solid #ccc;
            }
        }
    }
    .right {
        width: 800px;
        .right-item {
            min-height: 50px;
            line-height: 50px;
            width: 100%;
            text-align: left;
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            border: 1px dashed #ccc;
            position: relative;

            .right-item-menu {
                position: absolute;
                right: 0;
                bottom: 0;
                z-index: 1;
            }
            .right-children-container {
                width: 100%;

                .item {
                    height: 100%;
                    border: 1px dashed #ccc;
                    position: relative;

                    &.table {
                        border: 1px solid #000;
                    }

                    &.one {
                        width: 100%;
                    }

                    &.three {
                        width: calc(100% / 3);
                    }

                    &.two {
                        width: 50%;
                    }

                    &.four {
                        width: 25%;
                    }

                    &.five {
                        width: 20%;
                    }

                    &.six {
                        width: calc(100% / 6);
                    }

                    &.active {
                        border: 1px dashed red;
                    }
                }
            }


            &.empty {
                border: 1px dashed red;
            }
        }
    }
    .right-item-children {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px
    }
    .edit-title {
        text-align: left;
        font-weight: bold;
        padding: 10px;
    }
    .tree-children {
        width: 30%;
    }
    #myPrintArea {
        display: none;
    }
    @media print {
        #myPrintArea {
            display: block;
        }
    }
    .pull-left {
        float: left;
    }
</style>
<template>
    <div style="text-align: center">
        <div class="left">
            <div class="left-title">
                <RadioGroup v-model="left_tab">
                    <Radio label="form">
                        <span>字段控件</span>
                    </Radio>
                    <Radio label="table">
                        <span>布局控件</span>
                    </Radio>
                    <Radio label="data">
                        <span>数据控件</span>
                    </Radio>
                </RadioGroup>
            </div>
            <div class="left-content">
                <div draggable="true"
                     v-if="left_tab === 'form'"
                     v-for="item in left_forms"
                     :key="item.type"
                     @dragstart="onDragStart($event, item.type + ':' + item.title)"
                >{{item.title}}</div>
                <div draggable="true"
                     v-if="left_tab === 'table'"
                     v-for="item in left_tables"
                     :key="item.type"
                     @dragstart="onDragStart($event, item.type + ':' + item.title)"
                >{{item.title}}</div>
                <div draggable="true"
                     v-if="left_tab === 'data'"
                     v-for="item in left_datas"
                     :key="item.type"
                     @dragstart="onDragStart($event, item.type + ':' + item.title)"
                >{{item.title}}</div>
            </div>

        </div>
        <div class="right"  @dragover="onDragOver"  @dragenter="onDragEnterContainer" @dragleave="onDragLeaveContainer" @drop.self="onDropContainer">
            <div class=  "right-item"
                 :type="item.type"
                 :class="{empty: !item.type}"
                 v-for="(item, index) in right_forms"
                 :key="index"
                 :draggable="item.draggable && !!item.type"
                 @dragstart.self="onDragStart($event, item.type + ':' + item.title, item.token, index)"
                 @drop="onDrop($event, index)"
                 @dragenter="onDragEnter($event, index)"
                 @dragleave="onDragLeave($event, index, item.type)"
                 @dragend.self="onDragEnd"
                 @click="onEdit(item.type, index, '', '')"
            >
                <Icon type="close-circled" v-if="['detail', 'table'].indexOf(item.type) === -1" @click.native="onDeleteForm(index)" class="icon-form-close"></Icon>
                <form-item :form_item="item" ></form-item>
                <ButtonGroup class="right-item-menu" size="small" v-if="['detail', 'table'].indexOf(item.type) !== -1">
                    <Button>{{item.type === 'detail' ? '编辑明细表' : '编辑表格'}}</Button>
                    <Button @click.native="onAddCol(item.type, index)">添加列</Button>
                    <Button v-if="item.type === 'table'" @click.native="onAddRow(index)">添加行</Button>
                    <Button @click.native="onDeleteForm(index)">删除表格</Button>
                </ButtonGroup>

                <div class="right-children-container" v-if="['table', 'employee_change', 'salary_adjust'].indexOf(item.type) ===  -1 && !!item.children">
                    <div class="item pull-left"
                         :class="{one: item.children.length === 1,two: item.children.length === 2, three: item.children.length === 3, four: item.children.length === 4,
                         five: item.children.length === 5, six: item.children.length === 6, table: item.type === 'table' || item.type === 'detail'}"
                         v-for="(val ,i) in item.children"
                         :key="i"
                         :draggable="!!val.type"
                         @dragstart.self="onDragStart($event, val.type + ':' + val.title, val.token)"
                         @drop="onDropChildren($event, index, i)"
                         @dragenter="onDragEnterChildren"
                         @dragleave="onDragLeaveChildren"
                         @click="onEdit(val.type, index, '', i, $event)"
                    >
                        <Icon type="close-circled" @click.native="onDeleteChildrenForm(index, i)" class="icon-form-close"></Icon>
                        <form-item :form_item="val"></form-item>
                    </div>
                    <div class="wj-clear"></div>
                </div>
                <table  class="right-children-container" v-else-if="[ 'table', 'employee_change', 'salary_adjust'].indexOf(item.type) !== -1">
                    <tr v-for="(row, rowIndex) in item.children" :key="rowIndex">
                         <td class="item"
                              :class="{one: row.length === 1,two: row.length === 2, three: row.length === 3, four: row.length === 4,
                         five: row.length === 5, six: row.length === 6, table: item.type === 'table' || item.type === 'detail'}"
                              v-for="(val ,i) in row"
                              :key="i"
                             :draggable="val.draggable && !!val.type"
                              @dragstart.self="onDragStart($event, val.type + ':' + val.title, val.token)"
                              @drop="onDropTableChildren($event, index, rowIndex, i)"
                              @dragenter="onDragEnterChildren"
                              @dragleave="onDragLeaveChildren"
                              @click="onEdit(val.type, index,rowIndex, i, $event)"
                         >
                             <form-item :form_item="val"></form-item>
                        </td>
                        <div class="wj-clear"></div>
                    </tr>
                </table>

            </div>
        </div>
        <div class="edit">
            <span v-if="!currentType || currentType === 'two' || currentType === 'three'">请选中字段控件或数据控件</span>
            <span v-else-if="currentType !== 'line'">
                <span v-if="currentType !== 'describe'">
                    <!--1-->
                    <div class="edit-title">标题</div>
                    <Input v-model="currentOptions.title"></Input>
                    <!--2-->
                    <div class="edit-title">描述</div>
                    <Input v-model="currentOptions.describe"></Input>
                    <!--3-->
                    <div class="edit-title">标题布局</div>
                    <RadioGroup v-model="currentOptions.title_style">
                        <Radio label="row">横排</Radio>
                        <Radio label="col">竖排</Radio>
                    </RadioGroup>
                    <!--4-->
                    <span v-if="currentType !== 'math' && currentType !== 'table'">
                        <div class="edit-title">必填项设置</div>
                        <Checkbox v-model="currentOptions.required">这是必填项</Checkbox>
                    </span>
                    <!--5-->
                     <span
                             v-if="currentType === 'radio' ||
                             currentType === 'checkbox' ||
                             currentType === 'select' ||
                             currentType === 'employee_change_type' ||
                             currentType === 'employee_change_result' ||
                               currentType === 'salary_adjust_reason' ||
                                 currentType === 'salary_adjust_item'">
                        <div class="edit-title">选项设置</div>
                        <div v-for="(item, index) in currentOptions.list"  :key="item.value">
                            <Input v-model="item.label"></Input>
                            <Icon type="plus-circled" size="30" @click.native="onAdd"></Icon>
                            <Icon type="minus-circled" size="30" @click.native="onDel(index)"></Icon>
                        </div>
                     </span>
                    <!--6-->
                     <span v-if="currentType !== 'describe'">
                        <div class="edit-title">设置</div>
                        <Checkbox v-model="currentOptions.hide_title">隐藏标题</Checkbox>
                        <Checkbox v-model="currentOptions.show_order" v-if="currentType === 'detail'">显示序号</Checkbox>
                     </span>
                    <!--7-->
                     <span v-if="currentType === 'number'">
                        <div class="edit-title">数值类型</div>
                        <RadioGroup v-model="currentOptions.num_format">
                            <Radio label="number">数值</Radio>
                            <Radio label="percent">百分比</Radio>
                        </RadioGroup>
                     </span>
                    <!--8-->
                    <span v-if="currentType === 'datepicker' || currentType === 'employee_change_effect' || currentType === 'salary_adjust_effect'">
                        <div class="edit-title">格式</div>
                        <RadioGroup v-model="currentOptions.date_formate">
                            <Radio label="datetime">年-月-日 时:分</Radio>
                            <Radio label="date">年-月-日</Radio>
                            <Radio label="month">年-月</Radio>
                        </RadioGroup>
                    </span>
                    <!--9-->
                    <span v-if="currentType === 'math'">
                        <div class="edit-title">计算面板</div>
                        <div><span>字段</span></div>
                        <div><span>常量</span><Input></Input><Button>确认</Button></div>
                        <div><span>运算符</span><Button>+</Button><Button>-</Button><Button>*</Button><Button>/</Button><Button>(</Button><Button>)</Button></div>
                        <div><span>计算式</span><Button>撤销</Button><Button>清空</Button></div>
                        <div></div>
                        <div><Button>取消</Button><Button>确认</Button></div>
                    </span>

                    <!--11-->
                    <span v-if="['input', 'textarea', 'radio', 'checkbox', 'select', 'money', 'number', 'datetime', 'employee_change_reason', 'employee_change_type', 'employee_change_result', 'employee_change_effect',
                    'salary_adjust_reason', 'salary_adjust_item', 'salary_adjust_result', 'salary_adjust_effect'].indexOf(currentType) !== -1">
                        <div class="edit-title">默认提示</div>
                        <Input v-model="currentOptions.placeholder"></Input>
                    </span>
                    <!--12-->
                    <span v-if="currentType === 'detail'">
                        <div class="edit-title">合计字段</div>
                    </span>
                    <!--13-->
                    <span v-if="currentType === 'employee_change'">
                        <div class="edit-title">切换组件类型</div>
                        <RadioGroup v-model="currentOptions.employee_change_type"  >
                            <Radio label="select">下拉菜单</Radio>
                            <Radio label="fixed">固定值</Radio>
                        </RadioGroup>
                        <div v-if="currentOptions.employee_change_type === 'fixed'">
                            <Select style="width:200px" v-model="currentOptions.employee_change_value">
                                <Option v-for="val in employeeChangeType" :value="val.value"  :key="val.value">{{val.label}}</Option>
                            </Select>
                            <Checkbox v-model="currentOptions.employee_change_show">显示</Checkbox>
                        </div>
                    </span>
                </span>
                <span v-else>
                    <!--10-->
                    <div class="edit-title">格式</div>
                    <span class="font-bold">B</span>
                    <Select v-model="currentOptions.color" style="width:50px">
                        <Option value="black">黑</Option>
                        <Option value="red">红</Option>
                    </Select>
                    <Select v-model="currentOptions.font_size" style="width:50px">
                        <Option value="5">5</Option>
                        <Option value="4">4</Option>
                        <Option value="3">3</Option>
                    </Select>
                </span>
            </span>
        </div>


        <input id="biuuu_button" type="button" value="打印"></input>
        <div id="myPrintArea">
            <div style="width: 500px; height: 800px; border: 1px solid red">.....文本打印部分1.....</div>
            <div style="page-break-after: always;"></div>
            <div class="quote_title"  style="width: 500px; height: 800px; border: 1px solid red">引用</div><div class="quote_div"></div>
        </div>

        <Checkbox v-model="showPreview">预览</Checkbox>

        <Modal v-model="showPreview" title="预览" width="700">
            <preview-form v-if="showPreview" @getData="getData" @delete="onDeleteDetail" @add="onAddDetail" v-for="(item, index) in right_forms" :key="index" :form_item="item"></preview-form>
        </Modal>
    </div>



</template>
<script>
    import previewForm from './preview-form.vue';
    import formItem from './form-item.vue';
    export default {
        components: {
            previewForm, formItem
        },
        data() {
            return {showPreview: false,
                left_forms: [
                    {title: '单行文本输入框', type: 'input'},
                    {title: '多行文本框', type: 'textarea'},
                    {title: '描述性文字', type: 'describe', placeholder: '描述性文字'},
                    {title: '分割线', type: 'line'},
                    {title: '单选', type: 'radio'},
                    {title: '复选', type: 'checkbox'},
                    {title: '下拉菜单', type: 'select'},
                    {title: '金额', type: 'money'},
                    {title: '数字', type: 'number'},
                    {title: '运算控件', type: 'math'},
                    {title: '日期', type: 'datepicker'},
                    {title: '附件', type: 'file'},
                    {title: '关联表单', type: 'form'},
                    {title: '表格', type: 'table'},
                    {title: '明细表', type: 'detail'}
                ],
                left_tables: [
                    {title: '一行两列', type: 'two'},
                    {title: '一行三列', type: 'three'}
                ],
                left_datas: [
                    {title: '人员异动', type: 'employee_change'},
                    {title: '薪资调整', type: 'salary_adjust'}
                ],
                dragTarget: '',
                right_forms: [],
                targetY: 0,
                token: 0,
                currentType: '',
                currentIndex: '',
                startIndex: '',             //被拖拽元素Index
                currentChildrenIndex: '',
                currentOptions: {},
                showEdit: false,
                list: [],
                date_formate: '',
                left : true,
                inside: false,
                left_tab: 'form',
                employeeChangeType: [
                    {value: 'hired', label: '转正'},
                    {value: 'change', label: '调动'},
                    {value: 'leave', label: '离职'},
                    {value: 'promote', label: '晋升'}
                ],
                data_example: {
                    type: '控件类型',
                    title: '标题',
                    describe: '描述',
                    title_style: '标题布局',                //row 横向 col 纵向
                    required: '是否必填',
                    list: '选项',              //select radio checkbox 使用
                    hide_title: '隐藏标题',
                    show_order: '显示序号',
                    num_format: '数据类型',             //number 数值 percent 百分比
                    date_formate: '时间格式',               //datetime年月日 时分 date年月日 month年月
                    matn_var: '运算插件变量',
                    math_const: '常量',
                    math_formula: '运算式',
                    placeholder: '提示',
                    sum_var: '合计项',
                    employee_change_type: '人员变动类型',     //select下拉菜单选择 fixed 固定值
                    employee_change_value: '固定项值',          //hire 转正 leave离职 change 调动 promote 晋升
                    employee_change_show: '是否显示',
                    color: '字体颜色',              //red红black黑
                    font_size: '字体大小',              // 5 4 3

                },
                testData: {}
            }
        },
        mounted() {
            $("#biuuu_button").click(function () {
                $("#myPrintArea").printArea();
            });
        },
        methods: {
            /*
            * 拖拽开始
            */
            onDragStart(e, id, token, index) {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', id);
                if(token) {
                    this.token = token;
                    this.left = false;
                    this.startIndex = index;
                }else {
                    this.left = true;
                }
            },
            onDragOver(e) {
                if(e.preventDefault) {
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'copyMove';
                this.targetY = e.y;
                return false;
            },
            onDragEnter(e, index) {
                if (e.y >= this.targetY) {
                    if(!!this.right_forms[index - 1] && !this.right_forms[index - 1].type) {
                        this.right_forms.splice(index - 1, 1);
                        if(!this.right_forms[index -1].children) {
                            this.right_forms.splice(index, 0, {type: '', title: '', index: ''});
                        }
                    }
                }else {
                    if(!!this.right_forms[index + 1] && !this.right_forms[index + 1].type) {
                        this.right_forms.splice(index + 1, 1);
                        if(!this.right_forms[index].children) {
                            this.right_forms.splice(index, 0, {type: '', title: '', index: ''});
                        }
                    }
                }
            },
            /**
             * 拖拽离开目标
             * @param e
             * @param index
             */
            onDragLeave(e, index, type) {
                if(this.startIndex === index) {
                    return null;
                }
                const check_type = ['three', 'two', 'table', 'detail'].indexOf(type) !== -1;        //判断目标是否为表格类控件
                const check_table_down = (check_type && e.y > e.target.offsetTop + 25) || !check_type;       //判断是否从底部离开时，表格类插件要额外判断光标是否处于目标控件div下半部分
                const check_table_up = (check_type && e.y < e.target.offsetTop + 25) || !check_type;       //判断是否从顶部离开时，表格类插件要额外判断光标是否处于目标控件div上半部分
                //判断目标控件是否已被拖拽入内容
                if(!!this.right_forms[index] && !!this.right_forms[index].type) {
                    if ((e.y > this.targetY && ((this.right_forms.length > index + 1 && !!this.right_forms[index + 1].type) || this.right_forms.length === index + 1)) && check_table_down) {
                        this.right_forms.splice(index + 1, 0, {type: '', title: '', index: ''});
                    } else if(e.y < this.targetY && ((index > 0 && !!this.right_forms[index - 1].type) || index === 0) && check_table_up) {
                        if (index > 0) {
                            this.right_forms.splice(index, 0, {type: '', title: '', index: ''});
                        } else {
                            this.right_forms.unshift({type: '', title: '', index: ''});
                        }
                    }
                }
            },
            /**
             * 拖拽放置
             * @param e
             * @param index
             * @param i
             */
            onDrop(e, index) {
                if(e.preventDefault) {
                    e.preventDefault();
                }
                this.inside = false;
                const text = e.dataTransfer.getData('text/plain');
                const type = text.split(':')[0];
                const title = text.split(':')[1];
                //拖拽表单元素
                if(['three', 'two', 'table', 'detail', 'employee_change', 'salary_adjust'].indexOf(type) === -1) {
                    this.$set(this.right_forms, index, {
                        type: type,
                        title: title,
                        placeholder: type === 'describe' ? '描述性文字' : '',
                        token: new Date().getTime(),
                        list: this.makeList(type),
                        draggable: true
                    });
                }
                //拖拽布局容器
                else if(type === 'three'){
                    this.$set(this.right_forms, index, {
                        type: 'three',
                        title: '',
                        index: '',
                        token: '',
                        draggable: false,
                        children: []
                    });
                    for (let i = 0; i < 3; i++) {
                        this.right_forms[index].children.push({type: '', title: '', index: '', draggable: true});
                    }
                }
                else if(type === 'two' || type === 'detail'){
                    this.$set(this.right_forms, index, {
                        type: type,
                        title: '',
                        index: '',
                        token: '',
                        draggable: false,
                        children: []
                    });
                    for (let i = 0; i < 2; i++) {
                        this.right_forms[index].children.push({type: '', title: '', index: '', draggable: true});
                    }
                }
                else if(type === 'table') {
                    this.$set(this.right_forms, index, {
                        type: 'table',
                        title: '',
                        index: '',
                        token: '',
                        draggable: false,
                        children: []
                    });
                    for (let i = 0; i < 2; i++) {
                        this.right_forms[index].children.push([{type: '', title: '', index: '', draggable: true},{type: '', title: '', index: '', draggable: true}]);
                    }
                }
                else if(type === 'employee_change') {
                    this.$set(this.right_forms, index, {
                        type: 'employee_change',
                        title: '',
                        index: '',
                        token: new Date().getTime(),
                        draggable: true,
                        children: []
                    });
                    this.right_forms[index].children.push(
                        [{
                            type: 'employee_change_type',
                            title: '异动类型',
                            index: '',
                            token: new Date().getTime() + 1,
                            list: this.employeeChangeType,
                            draggable: false
                        }],
                        [{
                            type: 'employee_change_result',
                            title: '异动结果',
                            index: '',
                            token: new Date().getTime() + 2,
                            list: [],
                            draggable: false
                        }],
                        [{
                            type: 'employee_change_effect',
                            title: '生效日期',
                            index: '',
                            token: new Date().getTime() + 3,
                            list: [],
                            draggable: false
                        }],
                        [{
                            type: 'employee_change_reason',
                            title: '原因说明',
                            index: '',
                            token: new Date().getTime() + 4,
                            list: [],
                            draggable: false
                        }]
                    );
                }
                else if(type === 'salary_adjust') {
                    this.$set(this.right_forms, index, {
                        type: 'salary_adjust',
                        title: '',
                        index: '',
                        token: new Date().getTime(),
                        draggable: true,
                        children: []
                    });
                    this.right_forms[index].children.push(
                        [{
                            type: 'salary_adjust_reason',
                            title: '调整原因',
                            index: '',
                            token: new Date().getTime() + 1,
                            list: this.employeeChangeType,
                            draggable: false
                        }],
                        [{
                            type: 'salary_adjust_item',
                            title: '调整项目',
                            index: '',
                            token: new Date().getTime() + 2,
                            list: [],
                            draggable: false
                        }],
                        [{
                            type: 'salary_adjust_result',
                            title: '调整结果',
                            index: '',
                            token: new Date().getTime() + 3,
                            list: [],
                            draggable: false
                        }],
                        [{
                            type: 'salary_adjust_effect',
                            title: '生效日期',
                            index: '',
                            token: new Date().getTime() + 4,
                            list: [],
                            draggable: false
                        }]
                    );
                }
                this.clearDrop();
                $(e.target).removeClass('active');
                this.onEdit(type, index, '', '');
            },
            onDragEnd(e) {

            },
            onDragEnterChildren(e) {
                $(e.target).addClass('active');
            },
            onDragLeaveChildren(e) {
                $(e.target).removeClass('active');
            },
            /**
             *
             * @param e
             * @param index
             * @param i
             */
            onDropChildren(e, index, i) {
                if(e.preventDefault) {
                    e.preventDefault();
                }
                this.inside = false;
                const text = e.dataTransfer.getData('text/plain');

                const type = text.split(':')[0];
                const title = text.split(':')[1];

                if(this.right_forms[index].type === 'detail') {
                    if(['three', 'two', 'table', 'detail', 'employee_change', 'salary_adjust', 'describe', 'line'].indexOf(type) !== -1) {
                        return null;
                    }
                }else {
                    if(['three', 'two', 'table', 'detail', 'employee_change', 'salary_adjust'].indexOf(type) !== -1) {
                        return null;
                    }
                }


                this.$set(this.right_forms[index].children, i, {
                    type: type,
                    title: title,
                    placeholder: type === 'describe' ? '描述性文字' : '',
                    token: new Date().getTime(),
                    list: this.makeList(type),
                    draggable: true
                });
                this.clearDrop();
                $(e.target).removeClass('active');
                this.onEdit(type, index, '', i);
            },
            onDragEnterContainer(e) {
                if(!this.left || this.inside) {
                    return null;
                }
                this.inside = true;
                if(!this.right_forms.length || !!this.right_forms[this.right_forms.length - 1].type) {
                    this.right_forms.push({type: '', title: '', index: ''})
                }
            },
            onDragLeaveContainer(e) {
                if(!this.left || this.inside) {
                    return null;
                }
                this.right_forms = this.right_forms.filter(item => {
                    return item.type !== '';
                })
            },
            onDropContainer(e) {
                if(!this.left) {
                    return null;
                }
                this.onDrop(e, this.right_forms.length - 1)
            },
            /**
             *
             * @param type
             * @param index
             * @param rowIndex
             * @param i
             * @param e
             */
            onEdit(type, index,rowIndex, i, e) {
                //如果提供了事件对象，则这是一个非IE浏览器
                if ( e && e.stopPropagation ) {
                    //因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                }else {
                //否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
                }
                this.showEdit = true;
                this.currentType = type;
                this.currentIndex = index;
                this.currentChildrenIndex = i;
                if(!this.right_forms[index] || !this.right_forms[index].children && i !== '') {
                    index--;
                }
                this.currentOptions = rowIndex !== '' ? this.right_forms[index].children[rowIndex][i] : i !== '' ? this.right_forms[index].children[i] : this.right_forms[index];
                if(type === 'radio' || type === 'checkbox' || type === 'select') {
                    if(rowIndex !== '') {
                        this.currentOptions.list = this.right_forms[this.currentIndex].children[rowIndex][i].list;
                    } else {
                        if (this.currentChildrenIndex !== '') {
                            this.currentOptions.list = this.right_forms[this.currentIndex].children[this.currentChildrenIndex].list;
                        } else {
                            this.currentOptions.list = this.right_forms[this.currentIndex].list;
                        }
                    }
                }
            },
            /**
             * 添加选项
             */
            onAdd() {
                this.currentOptions.list.push({label: '选项' + (this.currentOptions.list.length + 1), value: new Date().getTime()});
            },
            /**
             *  选项设置删除选项
             * @param index
             */
            onDel(index) {
                if(this.currentOptions.list.length > 2) {
                    this.currentOptions.list.splice(index, 1);
                }
            },
            /**
             * 添加列
             * @param index
             */
            onAddCol(type, index) {
                if(type === 'detail') {
                    if (this.right_forms[index].children.length < 6) {
                        this.right_forms[index].children.push({
                            type: '',
                            title: '',
                            index: '',
                            token: ''
                        })
                    }
                }else {
                    this.right_forms[index].children.map(item => {
                        if(item.length < 6) {
                            item.push({
                                type: '',
                                title: '',
                                index: '',
                                token: ''
                            })
                        }
                    })
                }
            },
            /**
             * 增加行
             */
            onAddRow(index) {
                const len = this.right_forms[index].children[0].length;
                let arr = new Array(len);
                arr.fill({
                    type: '',
                    title: '',
                    index: '',
                    token: ''
                })
                this.right_forms[index].children.push(arr);

            },
            /**
             * 删除表单
             * @param index
             */
            onDeleteForm(index) {
                this.right_forms.splice(index, 1);
                if(this.right_forms.length <= 0) {
                    this.currentOptions = {};console.log(this.currentOptions)
                }
            },
            onDeleteChildrenForm(index, i) {
                if(this.right_forms[index].children.length > 1) {
                    this.right_forms[index].children.splice(i, 1);
                }
            },
            /**
             * 表格
             * @param e
             * @param index
             * @param rowIndex
             * @param i
             */
            onDropTableChildren(e, index, rowIndex ,i) {
                if(e.preventDefault) {
                    e.preventDefault();
                }
                this.inside = false;
                const text = e.dataTransfer.getData('text/plain');

                const type = text.split(':')[0];
                const title = text.split(':')[1];

                if(['three', 'two', 'table', 'detail', 'employee_change', 'salary_adjust'].indexOf(type) !== -1) {
                    return null;
                }

                this.$set(this.right_forms[index].children[rowIndex], i, {
                    type: type,
                    title: title,
                    placeholder: type === 'describe' ? '描述性文字' : '',
                    token: new Date().getTime(),
                    list: this.makeList(type),
                    draggable: true
                });

                this.clearDrop();
                $(e.target).removeClass('active');
                this.onEdit(type, index,rowIndex, i);
            },
            /**
             * 拖拽后清除原被拖拽元素
             */
            clearDrop() {
                this.right_forms = this.right_forms.filter(item => {
                    return !item.token || item.token != this.token;
                });
                this.right_forms.forEach((item, index) => {
                    if(item.type === 'three' || item.type === 'two' || item.type === 'detail') {
                        item.children.forEach((val, i) => {
                            if(val.token === this.token) {
                                this.right_forms[index].children[i] = {
                                    type: '',
                                    title: '',
                                    index: '',
                                    token: ''
                                }
                            }
                        })
                    }else if(item.type === 'table') {
                        item.children.forEach((row, rIndex) => {
                            row.forEach((val, i) => {
                                if(val.token === this.token) {
                                    this.right_forms[index].children[rIndex][i] = {
                                        type: '',
                                        title: '',
                                        index: '',
                                        token: ''
                                    }
                                }
                            });
                        });
                    }
                });
                this.right_forms = this.right_forms.filter(item => {
                    return item.type !== '';
                })
            },
            /**
             *
             * @param type
             * @returns {*}
             */
            makeList(type) {
                return ['radio', 'checkbox', 'select'].indexOf(type) !==  -1  ? [{label: '选项1', value: new Date().getTime() + 1},{label: '选项2', value: new Date().getTime() + 2},{label: '选项3', value: new Date().getTime() + 3}] : '';
            },
            /**
             * 获取单据值
             * @param val1
             * @param val2
             * @param val3
             */
            getData(val1, val2, val3) {console.log(val3)
                if(!!val3 || val3 === 0) {
                    if(!this.testData[val1]) {
                        this.testData[val1] = [null, null, null];
                    }
                    this.testData[val1][val3] = val2;
                }else {
                    this.testData[val1] = val2;
                }
            },
            /**
             * 删除明细表行
             * @param n
             * @param token
             */
            onDeleteDetail(n,  tokens) {
                this.onAddDetail(tokens);
                tokens.forEach(item => {
                    this.testData[item].splice(n, 1);
                });

            },
            onAddDetail(tokens) {
                tokens.forEach(item => {
                    if(!this.testData[item]) {
                        this.testData[item] = [null, null, null];
                    }
                });
            }
        },
        watch: {
            count(val) {
                this.width = 100 * val;
                const center = (val - 1) / 2;
                const arr = [];
                for (let i = 0; i < val; i++) {
                    const obj = {y1: 0, y2: 100};
                    if(i < center) {
                        obj.x1 = (i + 1) * this.width/(val + 1);
                        obj.x2 = i * this.width/(val + 1);
                    }else if(i === center) {
                        obj.x1 = this.width / 2;
                        obj.x2 = this.width / 2;
                    }else {
                        obj.x1 = (i + 1) * this.width/(val + 1);
                        obj.x2 = (i + 2) * this.width/(val + 1);
                    }
                    arr.push(obj);
                }
                this.lines = arr;
            },
        }
    };
</script>