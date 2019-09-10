/* eslint-disable no-param-reassign */

const getElementTranslate = (element) => {
  if (!element) {
    return false;
  }
  const result = { left: 0, top: 0 };
  const { transform } = element.style;
  const matches = /translate\((-?\d+(\.?\d+?)?)px, (-?\d+(\.?\d+?)?)px\)/g.exec(transform);
  if (matches) {
    [result.left, result.top] = [+matches[1], +matches[3]];
  }
  return result;
};
const translateElement = (element, x, y) => {
  if (!element) {
    return false;
  }
  if (x === null && y === null) return false;
  const translate = getElementTranslate(element);
  if (x === null) {
    x = translate.left;
  }
  if (y === null) {
    y = translate.top;
  }
  element.style.transform = `translate(${x || 0}px, ${y || 0}px)`;
};

export default {
  translateElement,
  getElementTranslate,
};
