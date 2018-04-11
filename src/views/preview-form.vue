<template>
    <div class="right-item">
        <div v-if="!form_item.children && !!form_item.type">
            <form-item  :form_item="form_item"></form-item>
        </div>
        <div v-else-if="['table', 'employee_change', 'salary_adjust'].indexOf(form_item.type) ===  -1 && !!form_item.children" class="right-item-children">
            <form-item v-for="(item, index) in form_item.children"  :key="index" :form_item="item"></form-item>
        </div>
        <div v-else-if="[ 'table', 'employee_change', 'salary_adjust'].indexOf(form_item.type) !== -1" v-for="(row, rowIndex) in form_item.children" :key="rowIndex">
            <form-item  v-for="(item, index) in row"  :key="index" :form_item="item"></form-item>
        </div>
    </div>
</template>

<script>
    import formItem from './form-item.vue';
    export default {
        name: 'preview-form',
        components: {
            formItem
        },
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