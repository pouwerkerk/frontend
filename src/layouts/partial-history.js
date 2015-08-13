import {
  entityHistoryGetters,
  entityHistoryActions
} from 'home-assistant-js';

import Polymer from '../polymer';
import nuclearObserver from '../util/bound-nuclear-behavior';

require('./partial-base');
require('../components/state-history-charts');

export default new Polymer({
  is: 'partial-history',

  behaviors: [nuclearObserver],

  properties: {
    narrow: {
      type: Boolean,
    },

    isDataLoaded: {
      type: Boolean,
      bindNuclear: entityHistoryGetters.hasDataForCurrentDate,
      observer: 'isDataLoadedChanged',
    },

    stateHistory: {
      type: Object,
      bindNuclear: entityHistoryGetters.entityHistoryForCurrentDate,
    },

    isLoadingData: {
      type: Boolean,
      bindNuclear: entityHistoryGetters.isLoadingEntityHistory,
    },

    selectedDate: {
      type: String,
      value: null,
      bindNuclear: entityHistoryGetters.currentDate,
    },
  },

  isDataLoadedChanged(newVal) {
    if (!newVal) {
      this.async(() => entityHistoryActions.fetchSelectedDate(), 1);
    }
  },

  handleRefreshClick() {
    entityHistoryActions.fetchSelectedDate();
  },

  datepickerFocus() {
    this.datePicker.adjustPosition();
  },

  attached() {
    this.datePicker = new Pikaday({
      field: this.$.datePicker.inputElement,
      onSelect: entityHistoryActions.changeCurrentDate,
    });
  },

  detached() {
    this.datePicker.destroy();
  },

  computeContentClasses(narrow) {
    return 'flex content ' + (narrow ? 'narrow' : 'wide');
  },
});
