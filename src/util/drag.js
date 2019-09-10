export default (element, options, destroy) => {
  const moveFn = (event) => {
    if (options.move) {
      options.move(event.changedTouches[0] || event.touches[0]);
    }
  };

  const endFn = (event) => {
    if (options.end) {
      options.end(event.changedTouches[0] || event.touches[0]);
    }
  };

  const startFn = (event) => {
    if (options.start) {
      options.start(event.changedTouches[0] || event.touches[0]);
    }
  };
  if (element) {
    element.addEventListener('touchmove', moveFn);
    element.addEventListener('touchstart', startFn);
    element.addEventListener('touchend', endFn);
  }
  if (element && destroy) {
    element.removeEventListener('touchstart', startFn);
    element.removeEventListener('touchmove', moveFn);
    element.removeEventListener('touchend', endFn);
  }
};
