<style lang="less">
    .wj-clear {
        clear: left;
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
        margin-left: 100px;
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
                    float: left;

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
                     @dragstart="onDragStart($event, item.type + ':' + item.title + ':' + 0)"
                >{{item.title}}</div>
                <div draggable="true"
                     v-if="left_tab === 'table'"
                     v-for="item in left_tables"
                     :key="item.type"
                     @dragstart="onDragStart($event, item.type + ':' + item.title + ':' + 0)"
                >{{item.title}}</div>
                <div draggable="true"
                     v-if="left_tab === 'data'"
                     v-for="item in left_datas"
                     :key="item.type"
                     @dragstart="onDragStart($event, item.type + ':' + item.title + ':' + 0)"
                >{{item.title}}</div>
            </div>

        </div>
        <div class="right"  @dragover="onDragOver"  @dragenter="onDragEnterContainer" @dragleave="onDragLeaveContainer" @drop.self="onDropContainer">
            <div class=  "right-item"
                 :type="item.type"
                 :class="{empty: !item.type}"
                 v-for="(item, index) in right_forms"
                 :key="index"
                 draggable="true"
                 @dragstart.self="onDragStart($event, item.type + ':' + item.title + ':' + item.index, item.token)"
                 @drop.self="onDrop($event, index)"
                 @dragenter="onDragEnter($event, index)"
                 @dragleave.self="onDragLeave($event, index, item.type)"
                 @dragend.self="onDragEnd"
                 @click.self="onEdit(item.type, index, '', '')"
            >
                <Icon type="close-circled" v-if="!item.children" @click.native="onDeleteForm(index)" style="position: absolute;right: 0;top: 0;"></Icon>
                {{item.title}}<span style="color: #ccc">{{item.placeholder}}</span>

                <ButtonGroup class="right-item-menu" size="small" v-if="item.type === 'detail' || item.type === 'table'">
                    <Button>{{item.type === 'detail' ? '编辑明细表' : '编辑表格'}}</Button>
                    <Button @click.native="onAddCol(item.type, index)">添加列</Button>
                    <Button v-if="item.type === 'table'" @click.native="onAddRow(index)">添加行</Button>
                    <Button @click.native="onDeleteForm(index)">删除表格</Button>
                </ButtonGroup>

                <div class="right-children-container" v-if="item.type !== 'table' && item.type !== 'employee_change' && item.type !== 'salary_adjust' && !!item.children">
                    <div class="item"
                         :class="{one: item.children.length === 1,two: item.children.length === 2, three: item.children.length === 3, four: item.children.length === 4,
                         five: item.children.length === 5, six: item.children.length === 6, table: item.type === 'table' || item.type === 'detail'}"
                         v-for="(val ,i) in item.children"
                         :key="i"
                         draggable="true"
                         @dragstart.self="onDragStart($event, val.type + ':' + val.title + ':' + val.index, val.token)"
                         @drop="onDropChildren($event, index, i)"
                         @dragenter="onDragEnterChildren"
                         @dragleave="onDragLeaveChildren"
                         @click.self="onEdit(val.type, index, '', i)"
                    >
                        <Icon type="close-circled" @click.native="onDeleteChildrenForm(index, i)" style="position: absolute;right: 0; top: 0px;"></Icon>
                        {{val.title}}{{item.type}}<span style="color: #ccc">{{val.placeholder}}</span>
                    </div>
                    <div class="wj-clear"></div>
                </div>
                <div  class="right-children-container" v-else-if="(item.type === 'table' || item.type === 'employee_change' || item.type === 'salary_adjust') && !!item.children">
                    <div v-for="(row, rowIndex) in item.children" :key="rowIndex">
                         <div class="item"
                              :class="{one: row.length === 1,two: row.length === 2, three: row.length === 3, four: row.length === 4,
                         five: row.length === 5, six: row.length === 6, table: item.type === 'table' || item.type === 'detail'}"
                              v-for="(val ,i) in row"
                              :key="i"
                              draggable="true"
                              @dragstart.self="onDragStart($event, val.type + ':' + val.title + ':' + val.index, val.token)"
                              @drop="onDropTableChildren($event, index, rowIndex, i)"
                              @dragenter="onDragEnterChildren"
                              @dragleave="onDragLeaveChildren"
                              @click.self="onEdit(val.type, index,rowIndex, i)"
                         >
                        {{val.title}}{{item.type}}<span style="color: #ccc">{{val.placeholder}}</span>
                        </div>
                        <div class="wj-clear"></div>
                    </div>
                    <Icon type="close-circled" @click.native="onDeleteChildrenForm(index, i)" style="position: absolute;right: 0; top: 0px" v-if="item.type !== 'detail' && item.type !== 'table'"></Icon>

                </div>

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
                        <div v-for="(item, index) in list"  :key="item.value">
                            <Input v-model="item.label"></Input>
                            <Icon type="plus-circled" size="30" @click.native="onAdd"></Icon>
                            <Icon type="minus-circled" size="30" @click.native="onDel(index)"></Icon>
                        </div>
                     </span>
                    <!--6-->
                     <span v-if="currentType !== 'describe'">
                        <div class="edit-title">设置</div>
                        <Checkbox v-model="currentOptions.hide_title">隐藏标题</Checkbox>
                        <Checkbox v-model="currentOptions.show_order">显示序号</Checkbox>
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
        <Button @click="onPreview">预览</Button>

        <input id="biuuu_button" type="button" value="打印"></input>
        <div id="myPrintArea">
            <div style="width: 500px; height: 800px; border: 1px solid red">.....文本打印部分1.....</div>
            <div style="page-break-after: always;"></div>
            <div class="quote_title"  style="width: 500px; height: 800px; border: 1px solid red">引用</div><div class="quote_div"></div>
        </div>

        <Modal v-model="showPreview" title="预览" width="700">
            <!--<preview-form v-for="(item, index) in right_forms"  :key="index" :form_item="item"></preview-form>-->
        </Modal>
    </div>



</template>
<script>
    import previewForm from './preview-form.vue';
    export default {
        components: {
            previewForm
        },
        data() {
            return {
                width: 200,
                count:2,
                lines:[
                    {x1:50, y1:0, x2: 0, y2: 100},
                    {x1:150, y1:0, x2: 200, y2: 100},
                ],
                flows: [[],[]],
                left_forms: [
                    {title: '单行文本输入框', type: 'input'},
                    {title: '多行文本框', type: 'textarea'},
                    {title: '描述性文字', type: 'describe'},
                    {title: '分割线', type: 'line'},
                    {title: '单选', type: 'radio'},
                    {title: '复选', type: 'checkbox'},
                    {title: '下拉菜单', type: 'select'},
                    {title: '金额', type: 'money'},
                    {title: '数字', type: 'number'},
                    {title: '运算控件', type: 'math'},
                    {title: '日期', type: 'datepicker'},
                    {title: '附件', type: 'file '},
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
                showPreview: false,
                targetY: 0,
                token: 0,
                currentType: '',
                currentIndex: '',
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

                }
            }
        },
        mounted() {
            $("#biuuu_button").click(function () {
                $("#myPrintArea").printArea();
            });
        },
        methods: {
            /**
             * 增加条件
             */
            onAddFlow() {
                this.count++;
                this.flows.push([]);
            },
            /**
             * 减少条件
             */
            onDeleteFlow() {
                if(this.count > 2) {
                    this.count--;
                    this.flows.pop();
                }
            },
            /**
             * 增加节点
             */
            onAddNode(index) {
                this.flows[index].push({title: '张三' + Math.ceil(Math.random() * 10), children: [], lines: []});
            },
            /**
             * 减少节点
             * @param index
             */
            onDeleteNode(index) {
                this.flows[index].pop();
            },
            /**
             * 节点分叉
             */
            onAddNodeFlow(index, i) {
                if(!this.flows[index][i].lines.length) {
                    this.flows[index][i].lines = [
                        {x1:50, y1:0, x2: 0, y2: 100},
                        {x1:150, y1:0, x2: 200, y2: 100},
                    ];
                    this.flows[index][i].children = [[],[]];
                }else {
                    const count = this.flows[index][i].lines.length + 1;
                    this.flows[index][i].width = 50 * count;
                    const width = this.flows[index][i].width;
                    const center = (count - 1) / 2;
                    const arr = [];
                    for (let i = 0; i < count; i++) {
                        const obj = {y1: 0, y2: 50};
                        if(i < center) {
                            obj.x1 = (i + 1) * width/(count + 1);
                            obj.x2 = i * width/(count + 1);
                        }else if(i === center) {
                            obj.x1 = width / 2;
                            obj.x2 = width / 2;
                        }else {
                            obj.x1 = (i + 1) * width/(count + 1);
                            obj.x2 = (i + 2) * width/(count + 1);
                        }
                        arr.push(obj);
                    }
                    this.flows[index][i].lines = arr;
                    this.flows[index][i].children.push([]);

                }
            },
            /**
             * 节点减少分叉
             */
            onDeleteNodeFlow(index, i) {

            },
            onDragStart(e, id, token) {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', id);
                if(token) {
                    this.token = token;
                    this.left = false;
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
                if (e.y >= this.targetY) {console.log('enter up ' + index)
                    if(!!this.right_forms[index - 1] && !this.right_forms[index - 1].type) {
                        this.right_forms.splice(index - 1, 1);
                    }
                }else {console.log('enter down ' + index)
                    if(!!this.right_forms[index + 1] && !this.right_forms[index + 1].type) {
                        this.right_forms.splice(index + 1, 1);
                    }
                }
            },
            /**
             * 拖拽离开目标
             * @param e
             * @param index
             */
            onDragLeave(e, index, type) {
                if(type === 'three' || type === 'two' || type === 'table' || type === 'detail') {
                    return null;
                }
                if(!!this.right_forms[index] && !!this.right_forms[index].type) {
                    if (e.y > this.targetY && ((this.right_forms.length > index + 1 && !!this.right_forms[index + 1].type) || this.right_forms.length === index + 1)) {
                        this.right_forms.splice(index + 1, 0, {type: '', title: '', index: ''});
                    } else if(e.y < this.targetY && ((index > 0 && !!this.right_forms[index - 1].type) || index === 0)) {
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
                let count = text.split(':')[2];
                //拖拽表单元素
                if(type !== 'three' && type !== 'two' && type !== 'table' && type !== 'detail' && type != 'employee_change' && type != 'salary_adjust') {
                    if (count === '0') {
                        count = 1;
                        this.right_forms.forEach((item, i) => {
                            if (item.type === type) {
                                count++;
                            }
                        });
                    }

                    this.$set(this.right_forms, index, {
                        type: type,
                        title: this.left ? title + count : title,
                        index: count,
                        token: Date.parse(new Date()),
                        list: type === 'radio' || type === 'checkbox' ? [{label: ''},{label: ''},{label: ''}] : ''
                    });
                    this.right_forms = this.right_forms.filter(item => {
                        return !item.token || item.token != this.token;
                    });
                    this.right_forms.forEach((item, index) => {
                        if(item.type === 'three') {
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
                        }
                    });
                }
                //拖拽布局容器
                else if(type === 'three'){
                    this.$set(this.right_forms, index, {
                        type: 'three',
                        title: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    for (let i = 0; i < 3; i++) {
                        this.right_forms[index].children.push({type: '', title: '', index: ''});
                    }
                    $(e.target).attr('draggable', false);
                }
                else if(type === 'two' || type === 'detail'){
                    this.$set(this.right_forms, index, {
                        type: type,
                        title: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    for (let i = 0; i < 2; i++) {
                        this.right_forms[index].children.push({type: '', title: '', index: ''});
                    }
                    $(e.target).attr('draggable', false);
                }
                else if(type === 'table') {
                    this.$set(this.right_forms, index, {
                        type: 'table',
                        title: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    for (let i = 0; i < 2; i++) {
                        this.right_forms[index].children.push([{type: '', title: '', index: ''},{type: '', title: '', index: ''}]);
                    }
                    $(e.target).attr('draggable', false);
                }
                else if(type === 'employee_change') {
                    this.$set(this.right_forms, index, {
                        type: 'employee_change',
                        title: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    this.right_forms[index].children.push(
                        [{
                            type: 'employee_change_type',
                            title: '异动类型',
                            index: '',
                            token: Date.parse(new Date()),
                            list: this.employeeChangeType
                        }],
                        [{
                            type: 'employee_change_result',
                            title: '异动结果',
                            index: '',
                            token: Date.parse(new Date()),
                            list: []
                        }],
                        [{
                            type: 'employee_change_effect',
                            title: '生效日期',
                            index: '',
                            token: Date.parse(new Date()),
                            list: []
                        }],
                        [{
                            type: 'employee_change_reason',
                            title: '原因说明',
                            index: '',
                            token: Date.parse(new Date()),
                            list: []
                        }]
                    );

                    $(e.target).attr('draggable', false);
                }
                else if(type === 'salary_adjust') {
                    this.$set(this.right_forms, index, {
                        type: 'salary_adjust',
                        title: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    this.right_forms[index].children.push(
                        [{
                            type: 'salary_adjust_reason',
                            title: '调整原因',
                            index: '',
                            token: Date.parse(new Date()),
                            list: this.employeeChangeType
                        }],
                        [{
                            type: 'salary_adjust_item',
                            title: '调整项目',
                            index: '',
                            token: Date.parse(new Date()),
                            list: []
                        }],
                        [{
                            type: 'salary_adjust_result',
                            title: '调整结果',
                            index: '',
                            token: Date.parse(new Date()),
                            list: []
                        }],
                        [{
                            type: 'salary_adjust_effect',
                            title: '生效日期',
                            index: '',
                            token: Date.parse(new Date()),
                            list: []
                        }]
                    );

                    $(e.target).attr('draggable', false);
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
                let count = text.split(':')[2];
                if (count === '0') {
                    count = 1;
                    this.right_forms[index].children.forEach((item, i) => {
                        if (item.type === type) {
                            count++;
                        }
                    });

                }

                this.$set(this.right_forms[index].children, i, {
                    type: type,
                    title: title + count,
                    index: count,
                    token: Date.parse(new Date()),
                    list: type === 'radio' || type === 'checkbox' ? [{label: '', value: Date.parse(new Date())},{label: '', value: Date.parse(new Date())},{label: '', value: Date.parse(new Date())}] : ''
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
            onDropContainer(e) {console.log('drop con')
                if(!this.left) {
                    return null;
                }
                this.onDrop(e, this.right_forms.length - 1)
            },
            onPreview() {
                this.showPreview = true;
            },
            /**
             *
             * @param type
             * @param index
             * @param i
             */
            onEdit(type, index,rowIndex, i) {console.log('onEdit',type, index,rowIndex, i)
                this.showEdit = true;
                this.currentType = type;
                this.currentIndex = index;
                this.currentChildrenIndex = i;
                this.currentOptions = rowIndex ? this.right_forms[index].children[rowIndex][i] : i !== '' ? this.right_forms[index].children[i] : this.right_forms[index];
                if(type === 'radio' || type === 'checkbox' || type === 'select') {
                    if(rowIndex !== '') {
                        this.list = this.right_forms[this.currentIndex].children[rowIndex][i].list;
                    } else {
                        if (this.currentChildrenIndex !== '') {
                            this.list = this.right_forms[this.currentIndex].children[this.currentChildrenIndex].list;
                        } else {
                            this.list = this.right_forms[this.currentIndex].list;
                        }
                    }
                }
            },
            /**
             * 添加选项
             */
            onAdd() {
                this.list.push({label: '', value: Date.parse(new Date())});
            },
            /**
             *  选项设置删除选项
             * @param index
             */
            onDel(index) {
                this.list.splice(index, 1);
            },
            /**
             * 添加列
             * @param index
             */
            onAddCol(type, index) {console.log('onAddCol')
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
                let count = text.split(':')[2];
                if (count === '0') {
                    count = 1;
                    this.right_forms[index].children.forEach(row => {
                        row.forEach((item, i) => {
                            if (item.type === type) {
                                count++;
                            }
                        });

                    });

                }

                this.$set(this.right_forms[index].children[rowIndex], i, {
                    type: type,
                    title: title + count,
                    index: count,
                    token: Date.parse(new Date()),
                    list: type === 'radio' || type === 'checkbox' ? [{label: ''},{label: ''},{label: ''}] : ''
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