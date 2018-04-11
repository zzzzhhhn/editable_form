<template>
    <div class="w100 item-container" v-if="['table', 'detail', 'employee_change', 'salary_adjust', 'two', 'three'].indexOf(form_item.type) === -1">
        <div class="item-title" style="font-weight: bold" v-if="['describe', 'line', 'table', 'detail'].indexOf(form_item.type) === -1">{{form_item.title !== '' ? form_item.title + ':' : '&nbsp;'}}</div>

        <div class="item-content">
            <Input v-if="['input', 'money', 'number', 'math', 'form', 'salary_adjust_result'].indexOf(form_item.type) !== -1" :placeholder="form_item.placeholder" ></Input>

            <Input v-if="['textarea', 'describe', 'employee_change_reason'].indexOf(form_item.type) !== -1" type="textarea" :placeholder="form_item.placeholder"></Input>

            <hr class="w100" style="border:2px  solid black" v-if="form_item.type === 'line'"/>

            <RadioGroup  v-if="form_item.type === 'radio'">
                <Radio v-for="val in form_item.list" :key="val.value" :label="val.label"></Radio>
            </RadioGroup>

            <CheckboxGroup v-if="form_item.type === 'checkbox'">
                <Checkbox v-for="val in form_item.list" :key="val.value" :label="val.value">{{val.label}}</Checkbox>
            </CheckboxGroup>

            <Select v-if="['select', 'employee_change_type', 'employee_change_result', 'salary_adjust_reason', 'salary_adjust_item'].indexOf(form_item.type) !== -1">
                <Option v-for="val in form_item.list" :key="val.value" :value="val.value">{{val.label}}</Option>
            </Select>

            <DatePicker v-if="['datepicker', 'employee_change_effect', 'salary_adjust_effect'].indexOf(form_item.type) !== -1" :placeholder="form_item.placeholder" :type="form_item.date_formate" placeholder="Select date" ></DatePicker>

            <Upload
                    v-if="form_item.type === 'file'"
                    multiple
                    action="//jsonplaceholder.typicode.com/posts/">
                <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
        </div>

    </div>
</template>

<script>
    export default {
        components: {},
        props: {
            form_item: Object,
            type: String
        },
        data() {
            return {}
        },
        created() {

        },
        mounted() {

        },
        methods: {},
        computed: {},
        watch: {},
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

        .item-title {
            flex: none;
            width: 200px;
        }
        .item-content {
            flex: auto;
        }
    }
</style>