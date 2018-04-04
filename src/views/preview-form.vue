<template>
    <div class="right-item">
        <div v-if="!form_item.children && !!form_item.type">
            <span style="font-weight: bold">{{form_item.title}}:</span>

            <Input v-if="form_item.type === 'input' || form_item.type === 'money' || form_item.type === 'number' || form_item.type === 'form'" :placeholder="form_item.placeholder" ></Input>

            <Input v-if="form_item.type === 'textarea'" type="textarea" :placeholder="form_item.placeholder"></Input>

            <Input v-if="form_item.type === 'describe'" type="textarea"></Input>

            <hr v-if="form_item.type === 'line'"/>

            <RadioGroup  v-if="form_item.type === 'radio'">
                <Radio v-for="val in form_item.list" :key="val.value" :label="val.label"></Radio>
            </RadioGroup>

            <CheckboxGroup v-if="form_item.type === 'checkbox'">
                <Checkbox v-for="val in form_item.list" :key="val.value" :label="val.label"></Checkbox>
            </CheckboxGroup>

            <Select v-if="form_item.type === 'select'" style="width:50px">
                <Option v-for="val in form_item.list" :key="val.value" :value="val.value">{{val.label}}</Option>
            </Select>

            <DatePicker v-if="form_item.type === 'datepicker'" :placeholder="form_item.placeholder" :type="form_item.date_formate" placeholder="Select date" ></DatePicker>

            <Upload
                    v-if="form_item.type === 'file'"
                    multiple
                    action="//jsonplaceholder.typicode.com/posts/">
                <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>

        </div>
        <div v-else-if="!!form_item.children && !!form_item.type" class="right-item-children">
            <preview-form v-for="(item, index) in form_item.children"  :key="index" :form_item="item"></preview-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'preview-form',
        components: {},
        props: {
            form_item: Object,
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

<style scoped lang="less">

</style>