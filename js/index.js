function play(id) {
	var music = getMusicByID(id);
	console.log(music)
	if(music == null) {
		popup({
			type: 'error',
			msg: "未找到歌曲相关信息",
			delay: 1500,

		});
		return;

	}

	// 如果有就添加 没有就设置
	var loacl = window.localStorage;
	if(loacl.getItem("musicList") != null) {

		var musicList = JSON.parse(loacl.getItem("musicList"));
		var musicArr = [];
		var flag = 0; // 默认不存在
		// 判断是否存在
		$.each(musicList, function(index, item) {
			if(music.id == item.id) {
				// 存在添加到第一个
				flag = item.id;
			}
		});
		if(flag == 0) {
			musicArr.push(music);
			$.each(musicList, function(index, music1) {
				musicArr.push(music1)
			});
		} else {
			musicArr.push(music);
			$.each(musicList, function(index, music1) {
				if(music1.id != flag) {
					musicArr.push(music1)
				}

			});

		}

		loacl.setItem("musicList", JSON.stringify(musicArr));
	} else {
		loacl.setItem("musicList", "[" + JSON.stringify(music) + "]");
	}
	// 页面跳转
	popup({
		type: 'success',
		msg: "成功添加到播放列表",
		delay: 1000,
		callBack: function() {
			window.open("play.html", "play");
		}
	});

}

function getMusicByID(id) {
	var music;
	$.ajax({
		type: "get",
		data: {
			"id": id
		},
		url: serverLocation+"/kexunMusic/getMusicByID",
		async: false,
		success: function(data) {
			if(data.message == "ok") {
				music = data;

			} else {
				music = null;

			}

		}
	});
	return music;

}

// 点击退出按钮
function exit() {
	// 清空本地存储
	window.localStorage.clear();
	// 跳转登录界面
	window.location.href = "login.html";
}

// 搜索的方法
function serich() {
	var serich = $("#serich").val();
	window.open("serich.html?q=" + serich);
}
// 跳转歌单界面
function goGdList(gdID) {

	window.open("gdList.html?id=" + gdID);

}
//到mv
function goMV(mvID) {

	window.open('video.html?id=' + mvID, 'video');

}

// 读取地址栏参方法
function GetUrlParam(paraName) {　　　　
	var url = document.location.toString();　　　　
	var arrObj = url.split("?");
	if(arrObj.length > 1) {　　　　　　
		var arrPara = arrObj[1].split("&");　　　　　　
		var arr = [];
		for(var i = 0; i < arrPara.length; i++) {　　　　　　　　
			arr = arrPara[i].split("=");
			if(arr != null && arr[0] == paraName) {　　　　　　　　　　
				return decodeURI(arr[1]);　　　　　　　　
			}　　　　　　
		}　　　　　　
		return "";　　　　
	} else {　　　　　　
		return "";　　　　
	}　　
}