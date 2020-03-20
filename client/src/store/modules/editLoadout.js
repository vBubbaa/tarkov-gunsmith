import HTTP from '../../http';
import router from '../../router';

export default {
  namespaced: true,
  state: {
    loading: true,

    loadoutId: null,
    availableWeapons: [],
    availableAttachments: [],
    defaultAttachments: [],
    loadoutName: '',

    weapon: {
      id: 2,
      name: 'ADAR 2-15',
      src: 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/3c/ADAR2-15Image.png?version=5ce4ce8faa56a1c54bdb1cbab889f0d0',
      type: 'Assault rifle',
      calibre: '5.56x45mm NATO',
      rpm: 800,
      ergonomics: 48,
      horizontal_recoil: 407,
      vertical_recoil: 149,
    },

    weaponStatsCalculated: {
      ergonomics: 48,
      horizontal_recoil: 407,
      vertical_recoil: 149,
    },

    attachments: [],

    alert: null,
    titleError: null,
  },

  actions: {

    fillLoadoutDetails({ commit, state }) {
      commit('setLoading', true);
      return HTTP().get(`/gunbuilds/${state.loadoutId}`)
        .then(({ data }) => {
          commit('setLoadoutDetails', data);
          commit('calculateWeaponStats');
          commit('setLoading', false);
        })
        .catch((error) => {
          if (error.response.status === '404') {
            router.push('/my-loadouts');
          } else {
            router.push('/my-loadouts');
          }
        });
    },

    fetchAttachments({ commit }) {
      return HTTP().get('/attachments')
        .then(({ data }) => {
          commit('setAvailableAttachments', data.data);
        });
    },

    fetchWeapons({ commit }) {
      return HTTP().get('/guns')
        .then(({ data }) => {
          commit('setAvailableWeapons', data.data.guns);
          commit('setDefaultAttachments', data.data.defaultAttachments);
        });
    },

    editLoadout({ commit, state }) {
      return HTTP().patch(`/gunbuilds/${state.loadoutId}`, {
        gun_id: state.weapon.id,
        name: state.loadoutName,
        ergonomics_final: state.weaponStatsCalculated.ergonomics,
        vertical_recoil_final: state.weaponStatsCalculated.vertical_recoil,
        horizontal_recoil_final: state.weaponStatsCalculated.horizontal_recoil,
        attachments: state.attachments,
      })
        .then(({ data }) => {
          commit('reset');
          router.push('/my-loadouts');
        })
        .catch((error) => {
          if (error.response.data.message) {
            commit('setTitleError', error.response.data.message);
          } else {
            commit('setTitleError', error.response.data[0].message); // message from response body
          }
        });
    },
  },

  mutations: {

    setLoadoutDetails(state, data) {
      state.weapon.id = data.gun[0][0].id;
      state.weapon.name = data.gun[0][0].name;
      state.weapon.src = data.gun[0][0].image;
      state.weapon.type = data.gun[0][0].type;
      state.weapon.calibre = data.gun[0][0].calibre;
      state.weapon.rpm = data.gun[0][0].rpm;
      state.weapon.ergonomics = data.gun[0][0].ergonomics_base;
      state.weapon.horizontal_recoil = data.gun[0][0].horizontal_recoil_base;
      state.weapon.vertical_recoil = data.gun[0][0].vertical_recoil_base;

      data.gunbuild[0].attachments.forEach((attachment) => {
        for (let i = 0; i < attachment.pivot.quantity; i++) {
          state.attachments.push(attachment);
        }
      });

      state.loadoutName = data.gunbuild[0].name;
    },

    reset(state) {
      state.availableWeapons = [];
      state.availableAttachments = [];
      state.loadoutName = '';

      state.weapon = {
        id: 2,
        name: 'ADAR 2-15',
        src: 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/3c/ADAR2-15Image.png?version=5ce4ce8faa56a1c54bdb1cbab889f0d0',
        type: 'Assault rifle',
        calibre: '5.56x45mm NATO',
        rpm: 800,
        ergonomics: 48,
        horizontal_recoil: 407,
        vertical_recoil: 149,
      };

      state.weaponStatsCalculated = {
        ergonomics: 48,
        horizontal_recoil: 407,
        vertical_recoil: 149,
      };

      state.attachments = [];

      state.alert = null;
      state.titleError = null;
    },

    calculateWeaponStats(state) {
      let { ergonomics } = state.weapon;
      let { horizontal_recoil } = state.weapon;
      let { vertical_recoil } = state.weapon;
      let recoil_reduction = 0;

      state.attachments.forEach((attachment) => {
        if (attachment.ergonomics_modifier !== null) {
          ergonomics += attachment.ergonomics_modifier;
        }

        if (attachment.recoil_modifier !== null && attachment.recoil_modifier !== 0) {
          recoil_reduction += attachment.recoil_modifier;
        }
      });

      horizontal_recoil = Math.round(state.weapon.horizontal_recoil * ((100 + recoil_reduction) / 100));
      vertical_recoil = Math.round(state.weapon.vertical_recoil * ((100 + recoil_reduction) / 100));

      state.weaponStatsCalculated.ergonomics = ergonomics;
      state.weaponStatsCalculated.horizontal_recoil = horizontal_recoil;
      state.weaponStatsCalculated.vertical_recoil = vertical_recoil;
    },

    // Weapon selector
    setAvailableWeapons(state, availableWeapons) {
      state.availableWeapons = availableWeapons;
    },
    setWeapon(state, weapon) {
      state.weapon.id = weapon.id;
      state.weapon.name = weapon.name;
      state.weapon.src = weapon.image;
      state.weapon.type = weapon.type;
      state.weapon.calibre = weapon.calibre;
      state.weapon.ergonomics = weapon.ergonomics_base;
      state.weapon.vertical_recoil = weapon.vertical_recoil_base;
      state.weapon.horizontal_recoil = weapon.horizontal_recoil_base;
      state.weapon.rpm = weapon.rpm;

      state.attachments = [];
      const defaultAttachments = state.defaultAttachments.filter(x => x.gun_id === weapon.id);

      for (let i = 0; i < defaultAttachments.length; i++) {
        const attachment = state.availableAttachments.find(x => x.id === defaultAttachments[i].attachment_id);
        state.attachments.push(attachment);
      }
    },

    // Attachments selector
    setAvailableAttachments(state, availableAttachments) {
      state.availableAttachments = availableAttachments;
    },
    setDefaultAttachments(state, defaultAttachments) {
      state.defaultAttachments = defaultAttachments;
    },
    addAttachment(state, attachment) {
      state.attachments.push(attachment);
    },
    deleteAttachment(state, attachment) {
      const index = state.attachments.indexOf(attachment);
      state.attachments.splice(index, 1);
    },
    updateAlert(state, item) {
      const message = `${item} has been added`;
      state.alert = message;
    },
    setLoadoutName(state, name) {
      state.loadoutName = name;
    },
    setLoadoutId(state, id) {
      state.loadoutId = id;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setTitleError(state, error) {
      state.titleError = error;
    },
  },
};