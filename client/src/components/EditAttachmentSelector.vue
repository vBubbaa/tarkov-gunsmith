<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card color="grey darken-4">
          <v-card-title class="blue-grey darken-2">Attachments</v-card-title>
          <v-container fluid>
            <v-toolbar flat>
              <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Filter" class="pb-2 pt-2" single-line hide-details clearable>
              </v-text-field>
              <v-spacer></v-spacer>
              <edit-attachment-selector-dialog></edit-attachment-selector-dialog>
            </v-toolbar>
            <v-skeleton-loader :loading="loading" :transition="transition" type="table-tbody">
              <v-data-table :headers="headers" :items="attachments" :search="search" :items-per-page="10" class="elevation-1">
                <template v-slot:item.image="{ item }">
                  <div class="pt-1 pb-1 pl-1 pr-1">
                    <v-img :src="item.image" alt="No image" max-height="75" max-width="175" contain></v-img>
                  </div>
                </template>

                <template v-slot:item.ergonomics_modifier="{ item }">
                  <template v-if="item.ergonomics_modifier > 0">
                    <h3 class="green--text">{{ item.ergonomics_modifier }}</h3>
                  </template>

                  <template v-else-if="item.ergonomics_modifier === 0">
                    <h3 class="grey--text">{{ item.ergonomics_modifier }}</h3>
                  </template>

                  <template v-else>
                    <h3 class="red--text">{{ item.ergonomics_modifier }}</h3>
                  </template>
                </template>

                <template v-slot:item.recoil_modifier="{ item }">
                  <template v-if="item.recoil_modifier < 0">
                    <h3 class="green--text">{{ item.recoil_modifier }}</h3>
                  </template>

                  <template v-else-if="item.recoil_modifier === 0">
                    <h3 class="grey--text">{{ item.recoil_modifier }}</h3>
                  </template>

                  <template v-else>
                    <h3 class="red--text">{{ item.recoil_modifier }}</h3>
                  </template>
                </template>

                <template v-slot:item.action="{ item }">
                  <v-btn color="red" @click="deleteAttachment(item), calculateWeaponStats()">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-skeleton-loader>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';
import EditAttachmentSelectorDialog from './EditAttachmentSelectorDialog.vue';

export default {
  components: {
    EditAttachmentSelectorDialog,
  },

  methods: {
    ...mapMutations('editLoadout', [
      'deleteAttachment',
      'calculateWeaponStats',
    ]),
  },

  computed: {
    ...mapState('editLoadout', [
      'attachments',
      'loading',
    ]),
  },

  data: () => ({
    transition: 'scale-transition',
    search: '',
    headers: [{
      text: 'Image',
      value: 'image',
      sortable: false,
      filterable: false,
    },
    {
      text: 'Name',
      value: 'name',
    },
    {
      text: 'Type',
      value: 'type',
    },
    {
      text: 'Ergonomics',
      value: 'ergonomics_modifier',
    },
    {
      text: 'Recoil (%)',
      value: 'recoil_modifier',
    },
    {
      text: '',
      value: 'action',
      sortable: false,
      filterable: false,
    },
    ],
  }),
};

</script>
