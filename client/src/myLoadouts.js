import HTTP from './http';
import router from './router';

export default {
  namespaced: true,
  state: {
    loading: true,
    
    loadouts: [],
    loadoutToDelete: null,
  },

  actions: {
    fetchMyLoadouts({ commit }) {
      commit('setLoading', true);
      return HTTP().get('/gunbuilds/mine')
        .then(({ data }) => {
          commit('setLoadouts', data.data[0]);
          commit('setLoading', false);
        });
    },

    deleteLoadout({ commit, state }) {
      return HTTP().delete(`/gunbuilds/${state.loadoutToDelete}`)
        .then(({ data }) => {
          commit('removeLoadout', state.loadoutToDelete);
        });
    },
  },

  mutations: {
    setLoadouts(state, myLoadouts) {
      state.loadouts = myLoadouts;
    },

    setLoadoutToDelete(state, loadoutToDelete) {
      state.loadoutToDelete = loadoutToDelete;
    },

    removeLoadout(state, loadoutToDelete) {
      state.loadouts = state.loadouts.filter(loadout => loadout.id !== loadoutToDelete);
    },

    setLoading(state, loading) {
      state.loading = loading;
    },
  },
};