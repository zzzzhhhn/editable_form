<style scoped lang="less">
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

    .left, .right {
        width: 500px;
        height: 800px;
        margin-left: 300px;
        float: left;
        border: 1px solid #ccc;
    }

    .left {
        div {
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            float: left;
            background: #eee;
            border: 1px solid #ccc;
        }
    }
    .right {
        .right-item {
            height: 50px;
            line-height: 50px;
            width: 100%;
            text-align: left;
        }
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
                <div draggable="true"
                     v-for="item in left_forms"
                     @dragstart="onDragStart($event, item.type + ':' + item.name)"
                >{{item.name}}</div>
            </div>
            <div class="right"  @dragover="onDragOver"  @dragenter="onDragEnterContainer">
                <div class="right-item"
                     :type="item.type"
                     v-for="(item, index) in right_forms"
                     draggable="true"
                     @dragstart="onDragRightStart"
                     @drop="onDrop($event, index, item.type)"
                     @dragenter="onDragEnter($event, index)"
                     @dragleave="onDragLeave($event, index)"
                     @dragend="onDragEnd">
                    {{item.name + '' + item.index}}
                </div>
            </div>
            <Button @click="onPreview">预览</Button>
        </div>

        <Modal
                v-model="showPreview"
                title="Common Modal dialog box title"
        >
            <div class="right-item" v-for="(item, index) in right_forms">
                <Input v-if="item.type === 'input'" placeholder="Enter something..." style="width: 200px"></Input>

                <Input v-if="item.type === 'textarea'" type="textarea" style="width: 200px" placeholder="Enter something..."></Input>

                <RadioGroup  v-if="item.type === 'radio'">
                    <Radio label="金斑蝶" disabled></Radio>
                    <Radio label="爪哇犀牛"></Radio>
                    <Radio label="印度黑羚"></Radio>
                </RadioGroup>

                <CheckboxGroup  v-if="item.type === 'checkbox'">
                    <Checkbox label="香蕉" disabled></Checkbox>
                    <Checkbox label="苹果" disabled></Checkbox>
                    <Checkbox label="西瓜"></Checkbox>
                </CheckboxGroup>

                <DatePicker v-if="item.type === 'datepicker'" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
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
                    {name: '单行输入框', type: 'input'},
                    {name: '多行输入框', type: 'textarea'},
                    {name: '单选框', type: 'radio'},
                    {name: '多选框', type: 'checkbox'},
                    {name: '日期选择', type: 'datepicker'},
                ],
//                names: {input: '单行输入框', textarea: '多行输入框', radio: '单选框', checkbox: '', datepicker: ''},
                dragTarget: '',
                right_forms: [{type: '', name: '', index: ''}],
                showPreview: false,
                targetY: 0,
            }
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
            onDragStart(e, id) {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', id);
            },
            onDragRightStart(e) {
                this.dragTarget = e.target;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target);
                e.dataTransfer.setData('text/plain', 'right');
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
                    }
                }else {
                    if(!!this.right_forms[index + 1] && !this.right_forms[index + 1].type) {
                        this.right_forms.splice(index + 1, 1);
                    }
                }
                e.target.style.border = '1px dashed red';
            },
            onDragEnterContainer(e) {
                if(!!this.right_forms[this.right_forms.length - 1].type) {
                    this.right_forms.push({type: '', name: '', index: ''})
                }
            }
            /**
             * 拖拽离开目标
             * @param e
             * @param index
             */
            ,onDragLeave(e, index) {
                e.target.style.border = 'none';
                if(!!this.right_forms[index] && !!this.right_forms[index].type) {
                    if (e.y > this.targetY && ((this.right_forms.length > index + 1 && !!this.right_forms[index + 1].type) || this.right_forms.length === index + 1)) {
                        this.right_forms.splice(index + 1, 0, {type: '', name: '', index: ''});
                    } else if(e.y < this.targetY && ((index > 0 && !!this.right_forms[index - 1].type) || index === 0)) {
                        if (index > 0) {
                            this.right_forms.splice(index - 1, 0, {type: '', name: '', index: ''});
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
            onDrop(e, index) { console.log(1)
                if(e.preventDefault) {
                    e.preventDefault();
                }

                const text = e.dataTransfer.getData('text/plain');

                if(text === 'right') {
                    const target = e.dataTransfer.getData('text/html');console.log(this.target)
                    e.target.before(this.dragTarget);
                }else {
                    const type = text.split(':')[0];
                    const name = text.split(':')[1];
                    let count = 1;
                    this.right_forms.forEach((item, i) => {
                        if (item.type === type) {
                            count++;
                        }
                    });
                    this.$set(this.right_forms, index, {type: type, name: name, index: count});
                }
                e.target.style.border = '1px dashed #ccc';
                this.right_forms = this.right_forms.filter(item => {
                    return item.name !== '';
                })
            },
            onDragEnd(e) {

            },
            onPreview() {
                this.showPreview = true;
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
            }
        }
    };
</script>