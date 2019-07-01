'use strict';

// mdui 自带的阉割版jQuery，使用前阅读其文档：https://www.mdui.org/docs/jq
const $ = mdui.JQ;
const message = {
	pickLesson: {
		blockCaptcha: '重新启动浏览器后生效',
		chooseCheckbox: '有余课时会自动勾选列表第一个课',
		autoRefresh: '每隔 3 秒刷新页面',
		autoSubmit: '需搭配前面所有功能同时启用',
		delay: 3000
	},
	calculateCredit: {
		enabled: '去看看你的选课情况'
	},
	rateTeacher: {
		enabled: '进入学评教，解放双手！',
		level: '建议9A + 1B，否则小心被查水表！'
	}
}

$(document).ready(async () => {
	const option = await getStorage(DEFAULT_OPTION);

	initElement(option);

});

function initElement(option) {
	for (const moduleKey in option) {
		const $module = $(`#${moduleKey}`);

		// 初始化 checkbox
		$module.find('input[type=checkbox]').each(function () {
			const dataKey = $(this).prop('name');
			$(this)
			  // 绑定选中情况
				.prop('checked', option[moduleKey][dataKey])
				// 绑定事件
			  .on('click', () => {
					showSnackBar($(this).is(':checked') && message[moduleKey][dataKey]);
					option[moduleKey][dataKey] = $(this).is(':checked');
					setStorage(option);
				});
		});

		// 初始化 radio
		$module.find('input[type=radio]').each(function () {
			const dataKey = $(this).prop('name');
			$(this)
			  // 绑定选中情况
				.prop('checked', option[moduleKey][dataKey] === $(this).prop('value'))
				// 绑定事件
			  .on('click', () => {
					if ($(this).is(':checked')) {
						showSnackBar($(this).is(':checked') && message[moduleKey][dataKey]);
						option[moduleKey][dataKey] = $(this).prop('value');
						setStorage(option);
					}
				});
		});
	}
}

function showSnackBar(message = '') {
	if (!message) { return ; }
	mdui.snackbar({
		message: message,
		buttonText: '知道了'
	});
}









function getNotice() {
	$$.ajax({
		url: 'https://alphanut.cn/HDU-GO/index.php',
		data: {method: 'getNotice'},
		dataType: 'json',
		success: function (data) {
			$$('#noticeBoard').html(`
				<div class="mdui-card-header">
					<a href="https://user.qzone.qq.com/1198079622" target="__blank"><img class="mdui-card-header-avatar" src="http://q.qlogo.cn/headimg_dl?bs=qq&spec=160&dst_uin=1198079622"/></a>
					<div class="mdui-card-header-title">AlphaNut</div>
					<div class="mdui-card-header-subtitle">` + data.date + `</div>
				</div>
				<div class="mdui-card-content">
					` + data.content + `
				</div>
			`);
		}
	});
}

function bindInit() {
	$$('#Module1 input').each(function (i, element) {
		$$(this).on('click', function (e) {
			if (i == 0) {
				if ($$(this).is(':checked')) {
					showSnackBar('每隔2秒刷新课程列表，遇到有余课时暂停刷新。');
					OPTION.ctrl_AutoRefresh = true;
				} else {
					OPTION.ctrl_AutoRefresh = false;
				}
			} else if (i == 1) {
				if ($$(this).is(':checked')) {
					showSnackBar('只在有余课时才会进行识别。');
					OPTION.ctrl_RecognizeCode = true;
				} else {
					$$('#Module1 input').eq(3).prop('checked', false);
					OPTION.ctrl_RecognizeCode = false;
					OPTION.ctrl_AutoConfirm = false;
				}
			} else if (i == 2) {
				if ($$(this).is(':checked')) {
					showSnackBar('只在有余课时才会选中选课框。');
					OPTION.ctrl_ChooseCheckbox = true;
				} else {
					$$('#Module1 input').eq(3).prop('checked', false);
					OPTION.ctrl_ChooseCheckbox = false;
					OPTION.ctrl_AutoConfirm = false;
				}
			} else if (i == 3) {
				if ($$(this).is(':checked')) {
					showSnackBar('该功能需要一同开启 “验证码识别” 和 “选中选课程” 。');
					$$('#Module1 input').eq(1).prop('checked', true);
					$$('#Module1 input').eq(2).prop('checked', true);
					OPTION.ctrl_RecognizeCode = true;
					OPTION.ctrl_ChooseCheckbox = true;
					OPTION.ctrl_AutoConfirm = true;
				} else {
					OPTION.ctrl_AutoConfirm = false;
				}
			}
			saveConfig();
		});
	});
	$$('#Module2 input').on('click', function (e) {
		if ($$(this).is(':checked')) {
			OPTION.ctrl_CalculateCredit = true;
		} else {
			OPTION.ctrl_CalculateCredit = false;
		}
		saveConfig();
	});
	$$('#Module3 input').each(function (i, element) {
		$$(this).on('click', function (e) {
			if (i == 0) {
				if ($$(this).is(':checked')) {
					OPTION.ctrl_AutoXuePingJiao = true;
				} else {
					OPTION.ctrl_AutoXuePingJiao = false;
				}
			} else {
				if ($$(this).is(':checked')) {
					OPTION.value_XuePingJiaoDegree = i;
				}
			}
			saveConfig();
		});
	});
	$$('#checkUpdate').on('click', function (e) {
		checkUpdate(true);
	});
}



function readConfig() {
	version = chrome.runtime.getManifest().version;
	$$('#versionContent').text('版本：' + version);
	chrome.storage.sync.get(OPTION, function (option) {
		OPTION.ctrl_AutoXuePingJiao = option.ctrl_AutoXuePingJiao;
		OPTION.value_XuePingJiaoDegree = option.value_XuePingJiaoDegree;

		OPTION.ctrl_AutoConfirm = option.ctrl_AutoConfirm;
		OPTION.ctrl_AutoRefresh = option.ctrl_AutoRefresh;
		OPTION.ctrl_RecognizeCode = option.ctrl_RecognizeCode;
		OPTION.ctrl_ChooseCheckbox = option.ctrl_ChooseCheckbox;
		OPTION.value_RefreshTime = option.value_RefreshTime;

		OPTION.ctrl_CalculateCredit = option.ctrl_CalculateCredit;
		applyConfig();
	});
}

function applyConfig() {
	$$("#Module1 input").eq(0).prop("checked", OPTION.ctrl_AutoRefresh);
	$$("#Module1 input").eq(1).prop("checked", OPTION.ctrl_RecognizeCode);
	$$("#Module1 input").eq(2).prop("checked", OPTION.ctrl_ChooseCheckbox);
	$$("#Module1 input").eq(3).prop("checked", OPTION.ctrl_AutoConfirm);

	$$("#Module2 input").eq(0).prop("checked", OPTION.ctrl_CalculateCredit);

	$$("#Module3 input").eq(0).prop("checked", OPTION.ctrl_AutoXuePingJiao);
	$$("#Module3 input").eq(OPTION.value_XuePingJiaoDegree).prop("checked", true);
}

function saveConfig() {
	chrome.storage.sync.set(OPTION);
}

function showUpdateNotification(title = '', message = '') {
	chrome.notifications.create(
		null,// notificationID
		{
			type: 'basic',
			iconUrl: 'img/icon.png',
			title: title,
			message: message,
			buttons: [{title: '确定更新', iconUrl: ''}]
		},// option
		function () {
			chrome.notifications.onButtonClicked.addListener(function (notificationId) {
				window.open('https://alphanut.cn/HDU-GO/index.php');
				chrome.notifications.clear(notificationId);
			});
		}// callback
	);
}

function checkUpdate(needShowSnackBar = false) {
	$$.ajax({
		url: 'https://alphanut.cn/HDU-GO/index.php',
		data: {method: "getVersion"},
		dataType: 'json',
		success: function (data) {
			if (data.version > version) {
				showUpdateNotification('发现新版本' + data.version, '更新详情：' + data.log);
			} else {
				if (needShowSnackBar) {
					showSnackBar('已经是最新版本了。');
				}
			}
		}
	});
}