$(function() {
	au.volume = 0.5;
	var musics = [];
	var index = 0; // 记录当前播放歌曲的下标
	var get = true; // 是否拿到歌词标记
	var bf = true; // 是否播放标记
	var playType = 1; // 播放类型: 1:顺序播放 2:单曲循环 3:列表循环:4:随机播放

	// 从本地存储加载歌曲的JSON
	var loacl = window.localStorage;
	if(loacl.getItem("musicList") != null) {
		musics = JSON.parse(loacl.getItem("musicList"));
	} else {
		musics = [];
	}
	if(musics.length >= 0) {
		init(0);
		// 查询音乐列表
		$
			.each(
				musics,
				function(index, item) {

					$("#music-list")
						.append(
							'<tr>' +
							'<td  >' +
							(index + 1) +
							'.</td>' +
							'<td data-index="' +
							index +
							'" class="m_list">' +
							item.name +
							'</td>' +
							'<td>' +
							item.gs +
							'</td>' +
							'<td>' +
							item.time +
							'</td>' +
							'<td><a class="glyphicon glyphicon-download-alt" href="' + serverLocation + '/kexunMusic/musicDownload?id=' +
							item.id + '"></a></td>' +
							'</tr>');
				});
	} else {
		alert("列表为空")
		history.back();
	}

	// 播放按钮
	$("#play").click(function() {

		play();

	})
	// 下一个
	$("#next").click(function() {
		next();
	});

	// 上一个
	$("#last").click(function() {

		last();
	});

	// 上一首
	function next() {

		index++;
		if(index >= musics.length) {
			index = 0;
		}
		init(index);
	}
	// 下一首
	function last() {
		index--;
		if(index < 0) {
			index = musics.length - 1;
		}
		init(index);

	}
	// 播放//或暂停
	function play() {
		if(au.paused) {
			// 修改图标
			$("#play").attr("class", "glyphicon glyphicon-pause");
			// 播放音乐
			au.play();
			bf = true;
		} else {
			// 修改图标
			$("#play").attr("class", "glyphicon glyphicon-play");
			// 暂停
			au.pause();
			bf = false;
		}

	}

	function init(index) {
		if(musics[index].img.trim().length > 0) {
			// $("#bg").css("background-image", 'url('+musics[index].img+')');
			$("#bg").attr("src", serverLocation+musics[index].img);
			$(".img-music").attr("src", serverLocation+musics[index].img);
		} else {
			$("#bg").css("background-image", "url(img/3.png)");
		}
		console.log(musics[index].url + "------")
		au.src = serverLocation + musics[index].url;
		$("#music-name").text(musics[index].name);
		$("title").text("正在播放音乐-" + musics[index].name);
		$("#music-title").text(musics[index].name);
		$("#music-gs").text("歌手:" + musics[index].gs);
		$("#music-zj").text("专辑:" + musics[index].zj);
		$("#music-img").attr("src", serverLocation + musics[index].img);
		$("#nowlrc").text("");
		// var time = "00:00/" + getTime(parseInt(au.duration));
		// //设置当前时间和总时间
		// 设置图片

		$("#time").text("00:00/00:00");
		// 滚到第一
		$("#kfc-list-ul").css("transform", "translateY(0px)");
		get = true;
		// 拼接歌词
		appendLrc(index);
		if(bf) {
			// 修改图标
			$("#play").attr("class", "glyphicon glyphicon-pause");
			// 播放音乐
			au.play();

		} else {
			// 修改图标
			$("#play").attr("class", "glyphicon glyphicon-play");
			// 暂停
			au.pause();
		}
		au.onerror = function() {

			popup({
				type: 'tip',
				msg: "歌曲加载失败",
				delay: 1500,
				callBack: function() {
					next();

				}
			});

		}

	}

	// 把秒转换成 分:秒 的形式
	function getTime(s) {
		var ss = 0;
		var mm = 0;
		if(s >= 60) {

			if(s % 60 == 0) {
				ss = 0;
				mm = s / 60;
			} else {
				mm = parseInt(s / 60);
				ss = s - mm * 60;
			}
		} else {
			ss = s;
			mm = 0;
		}

		if(mm < 10) {
			mm = "0" + mm;
		}
		if(ss < 10) {
			ss = "0" + ss;
		}
		if(s == NaN) {
			ss = "00";
		}

		return mm + ":" + ss;

	}

	// 播放器的时间改变时间
	au.ontimeupdate = function() {

		timeUpdate();
	}

	function timeUpdate() {

		// 判断是否已经播放到末尾 如果是则下一首 还要判断是否是循环播放
		// 设置循环播放 通过本地存储 保存 一遍下一次打开自动会设置
		if(au.ended) {
			// 下一首音乐
			// next();
			// 判断播放的类型 播放类型: 1:顺序播放 2:单曲循环 3:列表循环:4:随机播放
			if(window.localStorage.getItem("playType") != null) {
				playType = parseInt(window.localStorage.getItem("playType"));

			} else {
				playType = 1;
			}

			if(playType == 1) {
				next();

			} else if(playType == 2) {
				init(index);
			} else if(playType == 3) {
				next();
				if(index == musics.length - 1) {
					play();
				}

			} else if(playType == 4) {
				var max = musics.length;
				// 如果产生的随机数和当前的不一样
				if(parseInt(Math.random() * max) != index) {
					index = parseInt(Math.random() * max);
				} else {
					index = parseInt(Math.random() * max);
				}
				init(index);
			}

		} else {
			// 获取播放器当前播放到的时间
			var dt = parseInt(au.currentTime);
			// 秒-分运算
			var time = getTime(dt) + "/" + getTime(parseInt(au.duration));
			// 设置当前时间和总时间
			$("#time").text(time);
			// 判断当前时间是否有歌词 获取歌词
			var lrcArr = getLRC(getTime(dt), musics[index].lrc).split("&");
			// 文本歌词同步
			$("#nowlrc").text(lrcArr[1]);
			// 歌词列表同步
			lrcSynchronization(lrcArr[0]);

			// 计算百分比(当前时间/总时间 )x 100%
			var bfb = (au.currentTime / au.duration) * 100;
			// 设置进度条
			$("#jd").css("width", bfb + "%");
			// 进度条控制
		}

	}

	// 拿到歌词列表的div
	var m_list = $(".m_list");
	// 拿到歌曲列表
	$.each(m_list, function(i1, item) {
		$(item).click(function() {
			$.each(m_list, function(i2, item) {
				$(item).removeClass("active");
			});
			// 给选中的歌曲添加选中
			$(this).addClass("myactive");
			index = this.dataset.index;
			init(index);
		});
	});

	// 定义歌词数组 只拿一次
	// 从服务器拿歌词
	// 根据url 获取歌词数组
	function getLrcs(url) {
		console.log(url + "获取歌词");
		try {
			var lrcs;
			$.ajax({
				type: "post",
				dataType: "text",
				url: serverLocation + url,
				async: false,
				success: function(data) {
					// 得到歌词数组
					lrcs = data.split("\n");
				},
				error: function() {

					alert("歌词加载失败");

					lrcs = [];
				}

			});
		} catch(e) {
			// TODO handle the exception
		}

		get = false;
		return lrcs;

	}

	// 传入时间格式 xx:xx
	// 传入时间和歌词文件的url 返回歌词字符串
	// 歌词数组
	var lrcs;

	// 获取歌词 时间 歌词url
	function getLRC(time, url) {

		var lrcRes = "";
		// 判断传入的url是不是为空 如果为空的话 就是没有歌词
		if(url.length != 0) {

			if(get) {
				lrcs = getLrcs(url);
			}
			// 遍历歌词数组
			// 如果传入时间和遍历到的时间是一样的话就返回
			if(lrcs.length > 0) {
				for(var i = 0; i < lrcs.length; i++) {

					var lrc = lrcs[i];

					// 拿到时间
					var t = lrc.substring(lrc.indexOf("[") + 1, lrc
						.lastIndexOf("]"));

					// 去掉毫秒
					t = t.substring(0, t.indexOf("."));
					lrcRes = lrc;
					// 如果传入的时间刚好是 这条歌词的时间 就返回
					if(time.trim() == t.trim()) {

						lrcRes = lrcRes.substring(lrcRes.indexOf("]") + 1,
							lrcRes.length + 1);
						if(lrcRes.trim().length == 0) {
							lrcRes = lrcs[i - 1].substring(lrcs[i - 1]
								.indexOf("]") + 1, lrcs[i - 1].length + 1);
							return i - 1 + "&" + lrcRes;
						} else {
							return i + "&" + lrcRes;
						}

					}
				}
			} else {

				return "-1&歌词文件加载失败";
			}
		} else {

			return "-1&此歌曲没有歌词";
		}

		return lrcRes;

	}

	// 拼接歌词到列表
	function appendLrc(i) {

		$("#kfc-list-ul").html("");
		// 也先判断是不是有歌词
		if(musics[i].lrc.length != 0) {
			if(get) {
				lrcs = getLrcs(musics[i].lrc);
			}
			if(lrcs.length == 0) {
				$("#kfc-list-ul").append("<li>歌词文件加载失败</li>")

			}
			$.each(lrcs, function(index, item) {
				// 歌词内容
				var name = item.substring(item.indexOf("]") + 1,
					item.length + 1);
				if(name.trim().length > 0) {
					// 拼接到div
					$("#kfc-list-ul").append("<li >" + name + "</li>")
				} else {
					$("#kfc-list-ul").append("<li >&nbsp;</li>")
				}

			});
		} else {
			$("#kfc-list-ul").append("<li>此歌曲没有歌词</li>")
		}

	}

	// 歌词同步方法 参数 歌词下标
	function lrcSynchronization(lrcIdx) {
		if(lrcIdx != undefined && lrcIdx != -1) {
			var lis = $("#kfc-list-ul li");

			if(lrcIdx >= 1) {
				var lrc = $(lis[(parseInt(lrcIdx) - 1)]).text().trim();
				var lrc2 = $(lis[(parseInt(lrcIdx) + 1)]).text().trim();
				if(lrcIdx > 9) {
					// 如果下一句是空
					var top = (240 - (parseInt(lrcIdx) * 30));
					$("#kfc-list-ul").css("transform",
						"translateY(" + top + "px)");

				} else {
					$("#kfc-list-ul").css("transform", "translateY(0px)");
				}
				$(".kfc-list").scrollTop(0);

				$(lis).removeClass("nowlrc");

				$(lis[lrcIdx]).attr("class", "nowlrc");
			}

		}
	}
	// 控制进度条
	$(".wc").click(function(e) {
		// 当前进度条宽度
		var w = e.pageX - $("#progress").offset().left;
		// 总进度条宽度

		// 计算百分比
		var bfb = w / ($("#progress").width());

		au.currentTime = au.duration * bfb;
		$("#jd").width((bfb * 100) + "%")
	})

	// 音量调节

	$(".volume").click(function(e) {
		// 当前进度条宽度
		var w = e.pageX - $("#volume-in").offset().left;
		// 总进度条宽度

		// 计算百分比
		var bfb = w / ($(".volume").width());
		console.log(bfb)
		au.volume = bfb;
		au.muted = false;
		$("#vico").attr("class", " glyphicon glyphicon-volume-up")
		$("#volume-in").width((bfb * 100) + "%");
	});
	// 静音按钮
	$("#vico").click(function() {

		if(au.muted) {
			au.muted = false;
			$("#vico").attr("class", " glyphicon glyphicon-volume-up")
		} else {
			au.muted = true;
			$("#vico").attr("class", "glyphicon glyphicon-volume-off")
		}

	});

	$("#love").click(
		function addLove() {

			// 判断用户是登录 没有登录跳转登录页面
			if(window.localStorage.getItem("userInfo") != null) {
				// 发请求
				var MID = musics[index].id;
				var userName = JSON.parse(window.localStorage
					.getItem("userInfo")).userName;
				$.get("addLove", {
					"uName": userName,
					"mID": MID
				}, function(data) {
					if(data.message == "ok") {
						popup({
							type: 'success',
							msg: "收藏成功",
							delay: 1000,
						});

					} else if(data.message == "have") {

						popup({
							type: 'tip',
							msg: "已经存在",
							delay: 1500,
						});

					}
				});
			} else {
				window.location.href = 'login.html';

			}

		});

	$("#type").click(function() {

		playType++;
		if(playType <= 4) {
			window.localStorage.setItem("playType", playType + "");
		} else {
			window.localStorage.setItem("playType", "1");
			playType = 1;
		}
		// 播放类型: 1:顺序播放 2:单曲循环 3:列表循环:4:随机播放
		if(playType == 1) {
			popup({
				type: 'success',
				msg: "已经切换到顺序播放模式",
				delay: 1000,
			});
			$("#type").text("顺序播放");
		} else if(playType == 2) {
			popup({
				type: 'success',
				msg: "已经切换到单曲循环模式",
				delay: 1000,
			});
			$("#type").text("单曲循环");

		} else if(playType == 3) {
			popup({
				type: 'success',
				msg: "已经切换到列表循环模式",
				delay: 1000,
			});
			$("#type").text("列表循环");
		} else if(playType == 4) {
			popup({
				type: 'success',
				msg: "已经切换到随机播放模式",
				delay: 1000,
			});
			$("#type").text("随机播放");
		}

	});
});