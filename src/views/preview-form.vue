<template>
    <div class="right-item">
        <div v-if="!form_item.children && !!form_item.type">
            <form-item ref="form-item-preview" :form_item="form_item" @getData="getRowData"></form-item>
        </div>
        <div v-else-if="['two', 'three'].indexOf(form_item.type) !==  -1" class="right-item-children">
            <form-item ref="form-item-preview" v-for="(item, index) in form_item.children"  @getData="getRowData" :key="index" :form_item="item"></form-item>
        </div>
        <div v-else-if="form_item.type === 'detail'">
            <table style="width: 100%; text-align: center">
                <thead>
                    <tr>
                        <th v-if="form_item.show_order">序号</th>
                        <th v-for="item in form_item.children" >{{item.title}}</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, n) in detail_children" v-if="detailCount[n]">
                        <td v-if="form_item.show_order">{{n + 1 - delete_count}}</td>
                        <td v-for="chi in item"><form-item ref="form-item-preview" :index="index" :form_item="chi" @getData="getDetailData" :hide_title="true"></form-item></td>
                        <td><Icon type="plus-circled" size="30" @click.native="addCount"></Icon><Icon type="minus-circled" size="30" @click.native="deleteCount(n)"></Icon></td>
                    </tr>
                    <tr>
                        <td v-if="form_item.show_order"></td>
                        <td v-for="item in form_item.children"><span v-if="form_item.totals && form_item.totals.indexOf(item.token) !== -1">合计： {{total_results[item.token]}}</span></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="[ 'table', 'employee_change', 'salary_adjust'].indexOf(form_item.type) !== -1" v-for="(row, rowIndex) in form_item.children" :key="rowIndex">
            <form-item ref="form-item-preview"  v-for="(item, index) in row"  @getData="getRowData" :key="index" :form_item="item"></form-item>
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
            index: Number
        },
        data() {
            return {
                detailCount: [true, true, true],
                rowData: null,
                total_results: {},
                detail_children: [],
                formula_tokens: [],
                delete_count: 0
            }
        },
        created() {

        },
        mounted() {
            if(this.form_item.type === 'detail') {
                const arr = [];

                this.detailCount.forEach((val, index) => {
                    const children = JSON.parse(JSON.stringify(this.form_item.children));

                    children.forEach((item, ins) => {
                        if(item.type === 'math') {
                            item.math_formula_arr.forEach((v,i) => {
                                if(this.tokens.indexOf(v.substr(14)) !== -1) {
                                    children[ins].math_formula_arr[i] = v+ index;
                                }
                            });
                            children[ins].math_formula = children[ins].math_formula_arr.join(' ');
                        }

                        item.token += index;
                    });
                    arr.push(children)
                })
               this.detail_children = arr;
            }
        },
        methods: {
            addCount() {
                const index = this.detail_children.length;
                const children = JSON.parse(JSON.stringify(this.form_item.children));
                children.forEach(item => {
                    item.token += index;
                });
                this.detail_children.push(children);
                this.detailCount.push(new Date().getTime());
            },
            deleteCount(n) {
                let count = 0;
                this.detailCount.forEach(item => {
                    if(item) {
                        count++;
                    }
                });
                if(count > 1) {
                    this.$set(this.detailCount, n, false);
                    this.$emit('delete', n, this.tokens, this.index);
                    this.detail_children[n] = [];
                    this.delete_count++;
                }


            },
            /**
             * 详情表参数
             * @param val1 type
             * @param val2 token
             * @param val3 value
             */
            getRowData(val1,val2, val3) {
                this.$emit('getData', val1, val2, val3);
            },
            /**
             * 详情表参数
             * @param val1 type
             * @param val2 token
             * @param val3 value
             * @param val4 当前数据在right_forms中 的 index
             */
            getDetailData(val1, val2, val3, val4) {
                this.$emit('getData', val1, val2, val3, val4, this.detail_children, this.formula_tokens);
            },
            setTotal(token, val) {
                this.$set(this.total_results, token, val);
            }
        },
        computed: {
            tokens() {
                return this.form_item.children.map(item => item.token).filter(item => item !== '');
            }
        },
        watch: {

        },
        destroyed() {

        }
    }
</script>

<style scoped lang="less">

</style>