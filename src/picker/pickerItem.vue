<template>
  <div
    class="aw-picker-item"
    :style="{'text-align': align, 'flex': flex}"
  >
    <div
      v-if="!divider"
      :style="{height: `${contentHeight}px`}"
      ref="wrapper"
      :class="['aw-picker-item__wrapper', {'aw-picker-item__wrapper--dragging': dragging}]"
    >
      <div
        v-for="(itemVal, index) in currentValues"
        ref="pickerItems"
        :class="['aw-picker-item__item',
                 {'aw-picker-item__item--selected': currentValue === itemVal.value},
                 {'aw-picker-item__item--dragging': dragging}]"
        :key="index"
      >
        {{ itemVal.label }}
      </div>
    </div>
    <div
      class="aw-picker-item__divider"
      :style="dividerStyles"
      ref="divider"
      v-else
    >
      {{ content }}
    </div>
  </div>
</template>
<script>
import drag from '../util/drag';
import translateUtil from '../util/translate';

const ITEM_HEIGHT = 44;
const FONTSIZE = 18;
const VISIBLE_ITEM_COUNT = 5;
export default {
  props: {
    values: {
      type: Array,
      default: () => ([]),
    },
    value: {
      type: [String, Number],
    },
    defaultIndex: Number,
    dataIndex: Number,
    flex: {
      type: Number,
      default: 1,
    },
    divider: Boolean,
    content: String,
    align: {
      type: String,
      default: 'center',
    },
    dividerStyles: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentValues: this.values,
      currentValue: this.value,
      dragging: false,
      distance: 0,
      lastValue: this.value,
    };
  },
  mounted() {
    if (this.divider) {
      const el = this.$refs.divider;
      const distance = Math.floor(VISIBLE_ITEM_COUNT / 2) * ITEM_HEIGHT;
      translateUtil.translateElement(el, 0, distance);
      return;
    }
    let index = 0;
    if (this.currentIndex > -1) {
      index = this.currentIndex;
    } else if (this.defaultIndex >= 0) {
      index = this.defaultIndex;
    }
    this.translateWrapper(index);
    this.initEvents();
    this.$nextTick(() => {
      this.setRotateDeg(this.currentTranslate);
    });
  },
  methods: {
    initEvents() {
      const el = this.$refs.wrapper;
      let status = {};
      drag(el, {
        start: (event) => {
          this.dragging = false;
          this.distance = 0;
          status = {
            start: Date.now(),
            startLeft: event.pageX,
            startTop: event.pageY,
            startTranslateTop: parseInt(translateUtil.getElementTranslate(el).top, 10),
          };
        },
        move: (event) => {
          this.dragging = true;
          status.left = event.pageX;
          status.top = event.pageY;
          const deltaY = status.top - status.startTop;
          const translateDistance = status.startTranslateTop + deltaY;
          this.distance = status.top - status.startTop + status.startTranslateTop;
          translateUtil.translateElement(el, 0, translateDistance);
          this.setRotateDeg(translateDistance);
        },
        end: (event) => {
          this.dragging = false;
          status.end = Date.now();
          let currentTranslate = translateUtil.getElementTranslate(el).top;
          const distance = Math.abs(status.startTranslateTop - currentTranslate);
          const duration = status.end - status.start;
          // 说明是点击事件, 点击事件好像是有300秒的延时，会触发touchend事件两次
          if (distance < 10 && duration < 300) {
            const rect = this.$el.getBoundingClientRect();
            const halfTranslate = (ITEM_HEIGHT * VISIBLE_ITEM_COUNT) / 2;
            const offset = event.clientY - (rect.top + halfTranslate) + this.distance;
            currentTranslate -= offset;
          }
          let translate = Math.round(currentTranslate / ITEM_HEIGHT) * ITEM_HEIGHT;
          translate = this.restrictDistance(translate);
          this.distance = 0;
          this.$nextTick(() => {
            this.currentValue = this.translateValue(translate);
            if ((distance > 10 || (distance < 10 && duration < 300)) && this.currentValue !== this.lastValue) {
              this.emitChange();
            }
            this.lastValue = this.currentValue;
            const minTranslate = Math.max(this.dragRange[0], translate - this.diffValue);
            translateUtil.translateElement(el, 0, minTranslate);
            this.setRotateDeg(minTranslate);
          });
        },
      });
    },
    emitChange() {
      this.$emit('change', this.dataIndex, this.currentValues[this.currentIndex], this.currentIndex);
    },
    setRotateDeg(distance) {
      const elements = this.$refs.pickerItems || [];
      [].forEach.call(elements, (element, index) => {
        const currentIndex = this.actualIndex(index);
        const needTransfromDistance = currentIndex * ITEM_HEIGHT;
        const all = needTransfromDistance - distance;
        const percent = Math.abs(all) / ITEM_HEIGHT;
        const size = Math.max(10, FONTSIZE - (2 * percent));
        element.style.fontSize = `${size}px`;
      });
    },
    translateValue(translate) {
      const values = this.currentValues;
      const index = Math.floor(-(translate - (Math.floor(VISIBLE_ITEM_COUNT / 2) * ITEM_HEIGHT)) / ITEM_HEIGHT);
      return values[index] && values[index].value;
    },
    // 需要限制滚动距离
    restrictDistance(distance) {
      return Math.max(Math.min(distance, this.dragRange[1]), this.dragRange[0]);
    },
    valueTranslate(value) {
      const index = this.currentValues.indexOf(value);
      if (index > -1) {
        this.translateWrapper(index);
      } else {
        throw new Error('[h2] Picker: 请重新检查, 目前没有这个值');
      }
    },
    // 这个函数设置解耦并没有什么意义
    translateWrapper(index) {
      index = this.actualIndex(index);
      const el = this.$refs.wrapper;
      const distance = this.restrictDistance(index * ITEM_HEIGHT);
      this.currentValue = this.translateValue(distance);
      translateUtil.translateElement(el, 0, distance - this.diffValue);
    },
    // 返回的数值乘每个高度就是需要滚动的距离
    actualIndex(index) {
      return Math.floor(VISIBLE_ITEM_COUNT / 2) - parseInt(index, 10);
    },
  },
  computed: {
    contentHeight() {
      return ITEM_HEIGHT * VISIBLE_ITEM_COUNT;
    },
    currentIndex() {
      return this.currentValues.findIndex(val => val.value === this.currentValue);
    },
    diffValue() {
      if (VISIBLE_ITEM_COUNT % 2 === 0) {
        return ITEM_HEIGHT / 2;
      }
      return 0;
    },
    currentTranslate() {
      const el = this.$refs.wrapper;
      return translateUtil.getElementTranslate(el).top;
    },
    dragRange() {
      const { currentValues: values } = this;
      return [-ITEM_HEIGHT * (values.length - Math.ceil(VISIBLE_ITEM_COUNT / 2)) + this.diffValue, ITEM_HEIGHT * Math.floor(VISIBLE_ITEM_COUNT / 2)];
    },
  },
  watch: {
    values: {
      handler(values = []) {
        this.currentValues = values;
        // 需要默认滚动到0的位置
        this.translateWrapper(0, true);
        this.$nextTick(() => {
          this.setRotateDeg(this.currentTranslate);
        });
        this.$emit('init', this.dataIndex, this.currentValues[this.currentIndex]);
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    const el = this.$refs.wrapper;
    drag(el, {}, true);
  },
};
</script>
<style lang="scss">
@import '../style/pickerItem.scss';
</style>
