/**
 * 通用方法，需在其他 js 注入前注入
 */

'use strict';

const DEFAULT_OPTION = {
	/**
	 * 选课模块
	 */
	pickLesson: {
		blockCaptcha: false,
		chooseCheckbox: false,
		autoRefresh: true,
		autoSubmit: true,
		delay: 3000
	},
	/**
	 * 学分统计
	 */
	calculateCredit: {
		enabled: false
	},
	/**
	 * 自动学评教
	 */
	rateTeacher: {
		enabled: false,
		level: 'A'
	}
}

/**
 * 禁用 window.alert
 * 本方法需要在 manifest.json 中 run_at 为 document_start 注入的脚本中调用才能生效
 */
function disableAlert() {
  const script = document.createElement('script');
  script.textContent = `
    const _alert = window.alert;
    window.alert = (text) => {
      const myAlert = document.createElement('div');
      myAlert.style = \`
        width: 250px;
        height: 50px;
        background: #fff;
        position: fixed;
        top: 20px;
        right: 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        line-height: 50px;
        color: #333;
        overflow: hidden;
        text-align: center;
      \`;
      myAlert.innerText = text;
      document.documentElement.appendChild(myAlert);
      console.log(\`Alert says: \${text}.\`);
    }
  `;
  document.documentElement.appendChild(script);
}

/**
 * 获取 manifest.json
 * @param keyPath 键路径
 * @returns manifest[keyPath]
 */
function getManifest(keyPath) {
  const manifest = chrome.runtime.getManifest();
  return keyPath ? manifest[keyPath] || null : manifest;
}

/**
 * 获取浏览器账号同步的存储数据
 * @param option 如果为空的默认值
 * @example
 *  // 如果已存储 {a: 1}，调用下面的方法
 *  const option = await getStorage({a: 2});
 *  console.log(option); // {a: 1}
 *  // 如果无存储，调用下面的方法
 *  const option = await getStorage({a: 2});
 *  console.log(option); // {a: 2}
 */
function getStorage(option) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(option, function (res) {
      resolve(res);
    });
  });
}

function setStorage(option) {
  chrome.storage.sync.set(option);
}
