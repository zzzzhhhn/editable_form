<template>
    <div class="right-item">
        <div v-if="!form_item.children && !!form_item.type">
            <form-item :form_item="form_item" @getData="getRowData"></form-item>
        </div>
        <div v-else-if="['two', 'three'].indexOf(form_item.type) !==  -1" class="right-item-children">
            <form-item v-for="(item, index) in form_item.children"  @getData="getRowData" :key="index" :form_item="item"></form-item>
        </div>
        <div v-else-if="form_item.type === 'detail'">
            <table style="width: 100%; text-align: center">
                <thead>
                    <tr>
                        <th v-for="item in form_item.children" >{{item.title}}</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, n) in detailCount" v-if="item">
                        <td v-for="item in form_item.children"><form-item :form_item="item" @getData="getDetailData" :count="n" :hide_title="true"></form-item></td>
                        <td><Icon type="plus-circled" size="30" @click.native="addCount"></Icon><Icon type="minus-circled" size="30" @click.native="deleteCount(n, item)"></Icon></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="[ 'table', 'employee_change', 'salary_adjust'].indexOf(form_item.type) !== -1" v-for="(row, rowIndex) in form_item.children" :key="rowIndex">
            <form-item  v-for="(item, index) in row"  @getData="getRowData" :key="index" :form_item="item"></form-item>
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
            form_item: Object
        },
        data() {
            return {
                detailCount: [true, true, true],
                rowData: null
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            addCount() {
                this.detailCount.push(new Date().getTime());
                this.$emit('add', this.tokens);
            },
            deleteCount(n, val) {
                let count = 0;
                this.detailCount.forEach(item => {
                    if(item) {
                        count++;
                    }
                });
                if(count) {
                    this.$set(this.detailCount, n, false);
                    this.$emit('delete', n, this.tokens);
                }
                this.$nextTick(() => {
                    this.detailCount = this.detailCount.filter(item => {console.log(item)
                        return item;
                    });
                });

            },
            /**
             * 详情表参数
             * @param val1 键
             * @param val2 值
             */
            getRowData(val1,val2) {
                this.$emit('getData', val1, val2);
            },
            /**
             * 详情表参数
             * @param val1 键
             * @param val2 值
             * @param val3 索引
             */
            getDetailData(val1, val2, val3) {
                this.$emit('getData', val1, val2, val3);
            }
        },
        computed: {
            tokens() {
                let arr = [];
                this.form_item.children.forEach(item => {
                    arr.push(item.token);
                });
                return arr;
            }
        },
        watch: {},
        destroyed() {

        }
    }
</script>

<style scoped lang="less">

</style>