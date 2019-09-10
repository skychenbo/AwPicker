import Picker from './picker/picker.vue';

const install = (Vue) => {
  Vue.component(Picker.name, Picker);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  Picker,
};

export default {
  install,
};
