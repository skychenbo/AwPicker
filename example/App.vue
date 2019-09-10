<template>
  <div class="demo">
    <section class="section">
      <p>单独使用</p>
      <aw-picker
        :datas="data2"
      />
    </section>
    <section class="section">
      <p>多级联动</p>
      <aw-picker
        :datas="data1"
        @change="changeValue"
      />
    </section>
  </div>
</template>
<script>
import citys from './citys';

export default {
  data() {
    return {
      data1: [
        {
          values: [],
          flex: 1,
          align: 'center',
        },
        {
          values: [],
          flex: 1,
          align: 'center',
        },
      ],
      data2: [
        {
          values: [
            {
              label: '选项一',
              value: 1,
            },
            {
              label: '选项二',
              value: 2,
            },
            {
              label: '选项三',
              value: 3,
            },
            {
              label: '选项四',
              value: 4,
            },
            {
              label: '选项五',
              value: 5,
            },
            {
              label: '选项六',
              value: 6,
            },
            {
              label: '选项七',
              value: 6,
            },
          ],
        },
      ],
    };
  },
  created() {
    this.data1[0].values = citys;
    this.data1[1].values = citys[0].children;
  },
  methods: {
    changeValue(pickerIndex, cityName) {
      if (pickerIndex === 0) {
        this.data1[1].values = citys.find(val => val.value === cityName.value).children;
      }
    },
  },
};
</script>
