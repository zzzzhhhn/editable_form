import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import userFormData from './modules/userFormData';

export default new Vuex.Store({
    modules: [
        userFormData
    ]
})