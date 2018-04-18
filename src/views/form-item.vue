<template>
    <div class="w100 item-container" :class="{'title-col': form_item.title_style === 'col'}" v-if="['table', 'detail', 'employee_change', 'salary_adjust', 'two', 'three'].indexOf(form_item.type) === -1">
        <div class="item-title"  :class="{'title-col': form_item.title_style === 'col'}" style="font-weight: bold" v-if="['describe', 'line', 'table', 'detail'].indexOf(form_item.type) === -1 && !form_item.hide_title && !hide_title">{{form_item.title !== '' ? form_item.title + ':' : '&nbsp;'}}</div>
        <div>{{form_item.describe}}</div>
        <div class="item-content">
            <span  v-if="['input', 'money', 'number', 'math', 'form', 'salary_adjust_result'].indexOf(form_item.type) !== -1"><Input :placeholder="form_item.placeholder" v-model="item_data"></Input><span v-if="form_item.num_format==='percent'">%</span></span>

            <Input v-if="['textarea', 'employee_change_reason'].indexOf(form_item.type) !== -1" type="textarea" :placeholder="form_item.placeholder"  v-model="item_data"></Input>

            <div class="form-describe"
                 :class="{
                     'color-red': form_item.color === 'red',
                     'font-13': form_item.font_size === '13',
                     'font-16': form_item.font_size === '16',
                     'font-20': form_item.font_size === '20',
                     'font-bold': form_item.bold
                 }"
                 v-if="form_item.type === 'describe'">{{form_item.descriptive_text}}</div>

            <hr class="w100" style="border:2px  solid black" v-if="form_item.type === 'line'"/>

            <RadioGroup  v-if="form_item.type === 'radio'"  v-model="item_data">
                <Radio v-for="val in form_item.list" :key="val.value" :label="val.label"></Radio>
            </RadioGroup>

            <CheckboxGroup v-if="form_item.type === 'checkbox'"  v-model="item_data">
                <Checkbox v-for="val in form_item.list" :key="val.value" :label="val.value">{{val.label}}</Checkbox>
            </CheckboxGroup>

            <Select v-if="['select', 'employee_change_result', 'salary_adjust_reason', 'salary_adjust_item'].indexOf(form_item.type) !== -1"  v-model="item_data">
                <Option v-for="val in form_item.list" :key="val.value" :value="val.value">{{val.label}}</Option>
            </Select>

            <span v-if="form_item.type === 'employee_change_type' && form_item.employee_change_show">
                 <Select v-if="form_item.employee_change_type === 'select'"  v-model="item_data">
                     <Option v-for="val in form_item.list" :key="val.value" :value="val.value">{{val.label}}</Option>
                 </Select>
                <Input readonly :value="form_item.employee_change_value" v-else></Input>
            </span>

            <DatePicker
                v-if="['datepicker', 'employee_change_effect', 'salary_adjust_effect'].indexOf(form_item.type) !== -1"
                :placeholder="form_item.placeholder"
                :type="form_item.date_formate"
                @on-change="onChangeDate"
            ></DatePicker>

            <div  v-if="form_item.type === 'file'">
                <Upload
                    :before-upload="handleUpload"
                    action="//jsonplaceholder.typicode.com/posts/">
                    <Button type="ghost" icon="ios-cloud-upload-outline">Select the file to upload</Button>
                </Upload>
            </div>

        </div>

    </div>
</template>

<script>
    export default {
        components: {},
        props: {
            form_item: Object,
            hide_title: {
                type: Boolean,
                default: false
            },
            count: Number,      //detail 行数
            index: {
                type: Number,
                default: null
            }     //当前数据在right_forms中 的 index
        },
        data() {
            return {
                file: null,
                item_data: null,
                a: true
            }
        },
        created() {
            if(this.a) {
                this.a = false;
                this.form_item.token = this.form_item.token + Math.ceil(Math.random()*999);
            }
        },
        mounted() {

        },
        methods: {
            handleUpload(file) {
                this.item_data = file;
            },
            onChangeDate(val) {
                this.item_data = val;
            },
            setData(val) {
                this.item_data = val;
            }
        },
        watch: {
            item_data(val) {
                this.$emit('getData', this.form_item.type, this.form_item.token, val, this.count, this.index);
            }
        },
        destroyed() {

        }
    }
</script>

<style lang="less">
    .w100 {
        width: 100%;
    }
    .item-container {
        display: flex;

        &.title-col {
            flex-direction: column;
        }

        .item-title {
            flex: none;
            width: 65px;
            &.title-col {
                width: 100%;
            }
        }
        .item-content {
            flex: auto;
        }

        .form-describe {
            min-height: 50px;
            border-radius: 10px;
            border: 1px solid #ccc;
        }
    }
</style>