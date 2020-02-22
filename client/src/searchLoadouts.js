import HTTP from './http';
import router from './router';

export default {
  namespaced: true,
  state: {
    loading: true,
    loadouts: [],
    gunToIndexBy: 'Any',
    guns: [],
    gunNames: [],
    gunNamesFilter: [],
  },

  actions: {
    fetchLoadouts({ commit, state }) {
      commit('setLoading', true);

      if (state.gunToIndexBy === 'Any') {
        return HTTP().get('/gunbuilds')
        .then(({ data }) => {
          commit('setLoadouts', data.data[0]);
          commit('formatDates');
          commit('setLoading', false);
        });
      }

      else {
        return HTTP().get(`/gunbuilds/indexbygun/${state.gunToIndexBy}`)
        .then(({ data }) => {
          commit('setLoadouts', data.data[0]);
          commit('formatDates');
          commit('setLoading', false);
        });
      }
    },

    fetchGuns({ commit }) {
      return HTTP().get(`/guns`)
        .then(({ data }) => {
          commit('setGuns', data.data);
          commit('setGunNames', data.data);
        });
    },
  },

  mutations: {
    setLoadouts(state, myLoadouts) {
      state.loadouts = myLoadouts;
    },

    setLoading(state, loading) {
      state.loading = loading;
    },

    setGunToIndexBy(state, gun) {
      let gun_id = gun;
      if (gun !== 'Any') {
        gun_id = state.guns.filter(x => {
          return x.name === gun;
        })[0].id;
      }

      state.gunToIndexBy = gun_id;
    },

    setGuns(state, guns) {
      let gunList = [];
      for (let i = 0; i < guns.length; i++) {
        var gun = {id: guns[i].id, name: guns[i].name}
        gunList.push(gun);
      }
      state.guns = gunList;
    },

    setGunNames(state, guns) {
      let gunList = [];
      for (let i = 0; i < guns.length; i++) {
        var gun = guns[i].name
        gunList.push(gun);
      }
      state.gunNames = gunList;
      state.gunNamesFilter = gunList;
      state.gunNamesFilter.unshift('Any');
    },

    setGunNamesFilter(state, gunNamesFilter) {
      state.gunNamesFilter = gunNamesFilter;
    },

    formatDates(state) {
      var options = { year: 'numeric', month: 'long', day: 'numeric' };

      for (var i = 0; i < state.loadouts.length; i++) {
        var date = state.loadouts[i].updated_at;
        var dateNew = new Date(date);
        dateNew = dateNew.toLocaleDateString(undefined, options);
        state.loadouts[i].updated_at = dateNew;
      }
    },
  },
};