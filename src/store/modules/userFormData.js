import * as types from '../mutation_types';

const state = {
    formData: {}
}

const mutations = {
    [types.USER_FORM_DATA](state, data) {
        state.formData = data;
    }
};

const actions = {
    getUserFormData({commit}, data) {
        commit(types.USER_FORM_DATA, data);
    }
};

const getters = {
    listenUserFormData: state => state.formData
}

export default {
    state,
    getters,
    actions,
    mutations
}