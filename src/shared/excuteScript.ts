import { KEYTYPE } from './domEventsToRecord';

/**
 * 控制器，false 会
 * @param bool
 * @returns
 */
export const controller = (bool: boolean) => {
  if (bool) {
    return `window.recorderController = ${bool};`;
  } else {
    return `window.recorderController = ${bool};${screenShotCommand(bool)};`;
  }
};

export const screenShotCommand = (bool: boolean) => {
  return `window.KOOLTESTMASKSHOW = false;
    window.KOOLTESTMASK && document.body.removeChild(window.KOOLTESTMASK);
    window.KOOLTESTMASK = null;`;
};

export const addAllListenersScript = (events: any): string => {
  let blocks = '';
  blocks += `window.keytype = ${JSON.stringify(KEYTYPE)};`;
  // blocks += `
  //   function getPathTo(element) {
  //     if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
  //       return '//*[@id=\"' + element.id + '\"]';
  //     }
  //     //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  //     if (element == document.body) {//递归到body处，结束递归
  //         return '/html/' + element.tagName.toLowerCase();
  //     }
  //     var ix = 1,//在nodelist中的位置，且每次点击初始化
  //         siblings = element.parentNode.childNodes;//同级的子元素

  //     for (var i = 0, l = siblings.length; i < l; i++) {
  //         var sibling = siblings[i];
  //         //如果这个元素是siblings数组中的元素，则执行递归操作
  //         if (sibling == element) {
  //             return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
  //             //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
  //         } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
  //             ix++;
  //         }
  //     }
  //   }
  //   function canWheel (domArr) {
  //     for (let i = 0; i < domArr.length; i++) {
  //       if (domArr[i].nodeName === 'CANVAS') {
  //         return getPathTo(domArr[i]);
  //       }
  //       let overflow = getComputedStyle(domArr[i]).overflow
  //       if (overflow.indexOf('overlay') >= 0 || overflow.indexOf('auto') >= 0 || overflow.indexOf('scroll') >= 0) {
  //         return getPathTo(domArr[i]);
  //       }
  //     }
  //     return null
  //   }
  //  `;
  for (let type in events) {
    if (type.startsWith('key')) {
      blocks += `\n !window.recorderListenerAdded && window.addEventListener('${type}', (e) => {
        window.recorderController && console.warn('recorder event {${type}}:', '"' + window.keytype[e.code] + '"')
      });`;
      continue;
    }
    if (type === 'mousewheel') {
      blocks += `\n !window.recorderListenerAdded && window.addEventListener('${type}', (e) => {
        if (window.recorderController) {
          console.warn('recorder event {${type}}:', e.clientX , e.clientY , e.deltaY)
        }
      });`;
      continue;
    }
    blocks += `\n !window.recorderListenerAdded && window.addEventListener('${type}', (e) => {
        window.recorderController && console.warn('recorder event {${type}}:', e.clientX, e.clientY)
      });`;
  }
  blocks +=
    '!window.recorderListenerAdded && (window.recorderListenerAdded = true);';
  return blocks;
};
