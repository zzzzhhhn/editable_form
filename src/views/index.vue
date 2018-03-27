<style lang="less">
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
            height: 50px;
            line-height: 50px;
            width: 100%;
            text-align: left;
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            border: 1px dashed #ccc;

            .item {
                height: 100%;
                border: 1px dashed #ccc;

                &.three {
                    width: 33%;
                }

                &.two {
                    width: 50%;
                }

                &.active {
                    border: 1px dashed red;
                }
            }

            &.empty {
                border: 1px dashed red;
            }
        }
    }
    .right-item-children {
        display: flex;flex-direction: row; margin-bottom: 10px
    }
    .edit-title {
        text-align: left;
        font-weight: bold;
        padding: 10px;
    }
    .tree-children {
        width: 30%;
    }
</style>
<template>
    <div style="text-align: center">
        <RadioGroup v-model="tab">
            <Radio label="flow">
                <span>审批流</span>
            </Radio>
            <Radio label="form">
                <span>表单</span>
            </Radio>
        </RadioGroup>
        <div v-if="tab==='flow'">
            <div class="index" :style="{width: width + 'px'}">
                <div class="creator">发起人</div>
                <svg width="100%" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <line v-for="item in lines" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" style="stroke:rgb(99,99,99);stroke-width:2"/>
                </svg>
            </div>
            <div class="flows" :style="{width: (width + count * 100) + 'px'}">
                <div class="flows-item" :style="{width: (width + count * 100) / count + 'px'}" v-for="(item, index) in flows" :key="index">
                    <span v-if="item.length > 0">
                        <span v-for="(val, i) in item" :key="i">
                            <div class="creator">{{val.name}}</div>
                            <div v-if="(i !== item.length - 1) && !val.children.length">↓</div>
                            <div :style="{width: val.width + 'px'}">
                                <svg width="100%" height="50px" v-if="!!val.lines.length" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                                    <line v-for="line in val.lines" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" style="stroke:rgb(99,99,99);stroke-width:2"/>
                                </svg>
                                <div class="flows-item" :style="{width: (val.width + val.lines.length * 100) / val.lines.length + 'px'}" v-for="(c, ci) in val.children" :key="ci">
                                     <span v-if="c.length > 0">
                                        <span v-for="(c_val, c_i) in c" :key="i">
                                            <div class="creator">{{val.name}}</div>
                                            <div v-if="(i !== item.length - 1) && !val.children.length">↓</div>
                                            <Button @click="onAddNodeFlow(index, i)">增加条件</Button>
                                            <Button @click="onDeleteNodeFlow(index, i)">减少条件</Button>
                                        </span>
                                    </span>
                                    <div v-else>暂无审批人数据</div>
                                </div>
                            </div>
                            <Button @click="onAddNodeFlow(index, i)">增加条件</Button>
                            <Button @click="onDeleteNodeFlow(index, i)">减少条件</Button>
                        </span>
                    </span>
                    <div v-else>暂无审批人数据</div>
                    <Button @click="onAddNode(index)">增加节点</Button>
                    <Button @click="onDeleteNode(index)">减少节点</Button>
                </div>
                <div style="clear: left"></div>

            </div>
            <div style="width: 100%;text-align: center;margin-top: 100px">
                <Button @click="onAddFlow">增加条件</Button>
                <Button @click="onDeleteFlow">减少条件</Button>
            </div>

        </div>
        <div v-else>
            <div class="left">
                <div class="left-title">
                    <RadioGroup v-model="left_tab">
                        <Radio label="table">
                            <span>布局控件</span>
                        </Radio>
                        <Radio label="form">
                            <span>字段控件</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <div class="left-content">
                    <div draggable="true"
                         v-if="left_tab === 'form'"
                         v-for="item in left_forms"
                         @dragstart="onDragStart($event, item.type + ':' + item.name + ':' + 0)"
                    >{{item.name}}</div>
                    <div draggable="true"
                         v-if="left_tab === 'table'"
                         v-for="item in left_tables"
                         @dragstart="onDragStart($event, item.type + ':' + item.name + ':' + 0)"
                    >{{item.name}}</div>
                </div>

            </div>
            <div class="right"  @dragover="onDragOver"  @dragenter="onDragEnterContainer" @dragleave="onDragLeaveContainer" @drop.self="onDropContainer">
                <div class="right-item"
                     :type="item.type"
                     :class="{empty: !item.type}"
                     v-for="(item, index) in right_forms"
                     draggable="true"
                     @dragstart.self="onDragStart($event, item.type + ':' + item.name + ':' + item.index, item.token)"
                     @drop.self="onDrop($event, index)"
                     @dragenter="onDragEnter($event, index)"
                     @dragleave="onDragLeave($event, index, item.type)"
                     @dragend.self="onDragEnd"
                     @click.self="onEdit(item.type, index, '')"
                >
                    {{item.name}}<span style="color: #ccc">{{item.placeholder}}</span>
                    <div class="item"
                         :class="{two: item.children.length === 2, three: item.children.length === 3}"
                         v-for="(val ,i) in item.children"
                         draggable="true"
                         @dragstart.self="onDragStart($event, val.type + ':' + val.name + ':' + val.index, val.token)"
                         @drop="onDropChildren($event, index, i)"
                         @dragenter="onDragEnterChildren"
                         @dragleave="onDragLeaveChildren"
                         @click="onEdit(val.type, index, i)"
                    >{{val.name}}<span style="color: #ccc">{{val.placeholder}}</span></div>
                </div>
            </div>
            <div class="edit">
                <div class="edit-title">标题</div>
                <Input v-model="currentOptions.name"></Input>
                <div class="edit-title" v-if="currentType !== 'checkbox' && currentType !== 'radio'">提示</div>
                <Input v-model="currentOptions.placeholder" v-if="currentType !== 'checkbox' && currentType !== 'radio'"></Input>
                <div class="edit-title" v-if="currentType === 'checkbox' || currentType === 'radio'">选项</div>
                <div v-for="(item, index) in list"  v-if="currentType === 'checkbox' || currentType === 'radio'">
                    <Input v-model="item.label"></Input>
                    <Icon type="plus-circled" size="30" @click.native="onAdd"></Icon>
                    <Icon type="minus-circled" size="30" @click.native="onDel(index)"></Icon>
                </div>
                <div class="edit-title" v-if="currentType === 'datepicker'">格式</div>
                <RadioGroup v-model="currentOptions.date_formate"  v-if="currentType === 'datepicker'">
                    <Radio label="datetime">年-月-日 时:分</Radio>
                    <Radio label="date">年-月-日</Radio>
                    <Radio label="month">年-月</Radio>
                </RadioGroup>
            </div>
            <Button @click="onPreview">预览</Button>
        </div>
        <input id="biuuu_button" type="button" value="打印"></input>
        <div id="myPrintArea">.....文本打印部分.....</div> <div class="quote_title">引用</div><div class="quote_div"></div>
        <Modal
                v-model="showPreview"
                title="预览"
                width="700"
        >
            <div class="right-item" v-for="(item, index) in right_forms">
                <div v-if="!item.children && !!item.type">
                    <span style="font-weight: bold">{{item.name}}:</span>
                    <Input v-if="item.type === 'input'"  :placeholder="item.placeholder" ></Input>

                    <Input v-if="item.type === 'textarea'" type="textarea"   :placeholder="item.placeholder"></Input>

                    <RadioGroup  v-if="item.type === 'radio'">
                        <Radio v-for="val in item.list" :label="val.label"></Radio>
                    </RadioGroup>

                    <CheckboxGroup  v-if="item.type === 'checkbox'">
                        <Checkbox v-for="val in item.list" :label="val.label"></Checkbox>
                    </CheckboxGroup>

                    <DatePicker v-if="item.type === 'datepicker'" :placeholder="item.placeholder" :type="item.date_formate" placeholder="Select date" ></DatePicker>
                </div>
                <div v-else-if="!!item.type" class="right-item-children">
                    <div v-for="children in item.children" class="tree-children">
                        <span style="font-weight: bold">{{children.name}}:</span>
                        <Input v-if="children.type === 'input'"  :placeholder="children.placeholder"></Input>

                        <Input v-if="children.type === 'textarea'" type="textarea"  :placeholder="children.placeholder"></Input>

                        <RadioGroup  v-if="children.type === 'radio'">
                            <Radio v-for="val in children.list" :label="val.label"></Radio>
                        </RadioGroup>

                        <CheckboxGroup  v-if="children.type === 'checkbox'">
                            <Checkbox v-for="val in children.list" :label="val.label"></Checkbox>
                        </CheckboxGroup>

                        <DatePicker v-if="children.type === 'datepicker'" :placeholder="children.placeholder" :type="children.date_formate" placeholder="Select date" ></DatePicker>
                    </div>
                </div>
            </div>
        </Modal>
    </div>



</template>
<script>
    export default {
        data() {
            return {
                width: 200,
                count:2,
                lines:[
                    {x1:50, y1:0, x2: 0, y2: 100},
                    {x1:150, y1:0, x2: 200, y2: 100},
                ],
                flows: [[],[]],
                tab: 'form',
                left_forms: [
                    {name: '单行文本输入框', type: 'input'},
                    {name: '多行文本框', type: 'textarea'},
                    {name: '单选', type: 'radio'},
                    {name: '复选', type: 'checkbox'},
                    {name: '日期选择', type: 'datepicker'},
                    {name: '描述性文字', type: 'datepicker'},
                    {name: '分割线', type: 'datepicker'},
                    {name: '下拉菜单', type: 'datepicker'},
                    {name: '金额', type: 'datepicker'},
                    {name: '数字', type: 'datepicker'},
                    {name: '运算控件', type: 'datepicker'},
                    {name: '日期', type: 'datepicker'},
                    {name: '附件', type: 'datepicker'},
                    {name: '关联表单', type: 'datepicker'},
                    {name: '表格', type: 'datepicker'}
                ],
                left_tables: [
                    {name: '一行两列', type: 'two'},
                    {name: '一行三列', type: 'three'}
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
                left_tab: 'form'
            }
        },
        mounted() {
            $("#biuuu_button").click(function () {console.log('print')
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
                this.flows[index].push({name: '张三' + Math.ceil(Math.random() * 10), children: [], lines: []});
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
                if(type === 'three' || type === 'two') {
                    return null;
                }
                if(!!this.right_forms[index] && !!this.right_forms[index].type) {
                    if (e.y > this.targetY && ((this.right_forms.length > index + 1 && !!this.right_forms[index + 1].type) || this.right_forms.length === index + 1)) {
                        this.right_forms.splice(index + 1, 0, {type: '', name: '', index: ''});
                    } else if(e.y < this.targetY && ((index > 0 && !!this.right_forms[index - 1].type) || index === 0)) {
                        if (index > 0) {
                            this.right_forms.splice(index, 0, {type: '', name: '', index: ''});
                        } else {
                            this.right_forms.unshift({type: '', name: '', index: ''});
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
            onDrop(e, index) {console.log('drop')
                if(e.preventDefault) {
                    e.preventDefault();
                }
                this.inside = false;
                const text = e.dataTransfer.getData('text/plain');

                const type = text.split(':')[0];
                const name = text.split(':')[1];
                let count = text.split(':')[2];
                //拖拽表单元素
                if(type !== 'three' && type !== 'two') {
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
                        name: name + count,
                        index: count,
                        token: Math.random() * 999 + 1,
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
                                        name: '',
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
                        name: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    for (let i = 0; i < 3; i++) {
                        this.right_forms[index].children.push({type: '', name: '', index: ''});
                    }
                    $(e.target).attr('draggable', false);
                }else if(type === 'two'){
                    this.$set(this.right_forms, index, {
                        type: 'two',
                        name: '',
                        index: '',
                        token: '',
                        children: []
                    });
                    for (let i = 0; i < 2; i++) {
                        this.right_forms[index].children.push({type: '', name: '', index: ''});
                    }
                    $(e.target).attr('draggable', false);
                }
                this.right_forms = this.right_forms.filter(item => {
                    return item.type !== '';
                });
                $(e.target).removeClass('active');
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
            onDropChildren(e, index, i) {console.log('drag-children')
                if(e.preventDefault) {
                    e.preventDefault();
                }
                this.inside = false;
                const text = e.dataTransfer.getData('text/plain');

                const type = text.split(':')[0];
                const name = text.split(':')[1];
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
                    name: name + count,
                    index: count,
                    token: Math.random() * 999 + 1,
                    list: type === 'radio' || type === 'checkbox' ? [{label: ''},{label: ''},{label: ''}] : ''
                });
                this.right_forms = this.right_forms.filter(item => {
                    return !item.token || item.token != this.token;
                });
                this.right_forms.forEach((item, index) => {
                   if(item.type === 'three' || item.type === 'two') {
                       item.children.forEach((val, i) => {
                           if(val.token === this.token) {
                               this.right_forms[index].children[i] = {
                                   type: '',
                                   name: '',
                                   index: '',
                                   token: ''
                               }
                           }
                       })
                   }
                });
                this.right_forms = this.right_forms.filter(item => {
                    return item.type !== '';
                })
            },
            onDragEnterContainer(e) {
                if(!this.left || this.inside) {
                    return null;
                }
                this.inside = true;
                if(!this.right_forms.length || !!this.right_forms[this.right_forms.length - 1].type) {
                    this.right_forms.push({type: '', name: '', index: ''})
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
            onEdit(type, index, i) {
                this.showEdit = true;
                this.currentType = type;
                this.currentIndex = index;
                this.currentChildrenIndex = i;
                this.currentOptions = i !== '' ? this.right_forms[index].children[i] : this.right_forms[index];
                if(type === 'radio' || type === 'checkbox') {
                    if(this.currentChildrenIndex !== '') {
                        this.list = this.right_forms[this.currentIndex].children[this.currentChildrenIndex].list;
                    }else {
                        this.list = this.right_forms[this.currentIndex].list;
                    }
                }
            },
            onAdd() {
                this.list.push({label: ''});
            },
            /**
             *
             * @param index
             */
            onDel(index) {
                this.list.splice(index, 1);
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
//            list(val) {
//                if(this.currentChildrenIndex !== '') {
//                    this.right_forms[this.currentIndex].children[this.currentChildrenIndex].list = val;
//                }else
//            }
        }
    };
</script>