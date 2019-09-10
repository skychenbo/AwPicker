<template>
  <div
    class="aw-picker"
    @touchmove.prevent
  >
    <div class="aw-picker-content">
      <div class="aw-picker__items">
        <picker-item
          ref="picker"
          v-for="(data,index) in datas"
          :key="index"
          v-bind="data"
          :data-index="index"
          @init="initchoiceList"
          @change="onChange"
        />
      </div>
      <div class="aw-picker--center" />
      <div class="aw-picker__mask" />
    </div>
  </div>
</template>
<script>
import PickerItem from './pickerItem.vue';

export default {
  name: 'AwPicker',
  props: {
    datas: {
      type: Array,
      default: () => ([]),
    },
    showToolbar: Boolean,
    title: String,
  },
  components: {
    PickerItem,
  },
  data() {
    return {
      choiceList: Array.from({ length: this.datas.length }),
    };
  },
  methods: {
    onChange(index, val, currentIndex) {
      this.choiceList[index] = val;
      this.$emit('change', index, val, currentIndex);
    },
    initchoiceList(index, val) {
      this.choiceList[index] = val;
    },
    getPickerInstance() {
      return this.$refs.picker;
    },
    getChoiceList() {
      return this.choiceList;
    },
  },
};
</script>
<style lang="scss">
@import '../style/picker.scss';
</style>
