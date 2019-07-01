/**
 * 注入页面：网上选课 -> 通识选修课
 */

'use strict';

disableAlert();

window.onload = async () => {
  const option = await getStorage(DEFAULT_OPTION);
  const {
    pickLesson: {
      blockCaptcha,
      chooseCheckbox,
      autoRefresh,
      autoSubmit,
      delay
    }
  } = option;

  if (blockCaptcha) {
    document.querySelector('.footbutton > span').innerHTML = '（PPS：每次开启验证码绕过，重启浏览器后可生效）（PS：验证码已被 <a href="https://alphanut.cn/HDU-GO/" target="_blank">HDU-GO</a> 拦截并绕过）';
  }
  if (chooseCheckbox) {
    const checkbox = document.querySelector('#kcmcGrid input[type=checkbox]');
    if (checkbox) {
      // 有余课
      checkbox.checked = 'true';
      if (autoSubmit) {
        document.querySelector('#Button1').click();
      }
    } else {
      // 无余课
      if (autoRefresh) {
        setTimeout(() => {
          window.location.reload();
        }, delay);
      }
    }
  }
}
