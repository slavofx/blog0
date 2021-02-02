/**
 * Created by guomin on 2021/1/12.
 */
var shareWxData = function(config,shareData){
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: config.appId,   // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.noncestr, // 必填，生成签名的随机串
    signature: config.signature,// 必填，签名，见附录1
    jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareQZone"] // 必填，需要使用的JS接口列表
  });
  wx.ready(function(){
    wx.onMenuShareAppMessage(shareData);
    wx.onMenuShareTimeline(shareData);
    wx.onMenuShareQQ(shareData);
    wx.onMenuShareWeibo(shareData);
  });
};

function weixinShare(appId,url,shareData){
  var configUrl = "https://hljaxx.k618.cn/hljxuexi/weixin/share?url=" + url+"&appId="+appId;
  $.ajax({
    type:"GET",
    url:configUrl,
    timeout:10000,
    contentType: 'application/json',
    success:function(data){
      if(data.message == "SUCCESS" && data.data!=null){
        var config;
        if(typeof data.data == "string"){
          config = $.parseJSON(data.data);//JSON.parse(data);
        }else{
          config = data.data;
        }
        if(typeof shareData == "string"){
          shareData = $.parseJSON(shareData);
        }
        shareWxData(config,shareData);
      }
    }
  });
}

// 获取地址栏参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return decodeURI(r[2]);
  return null;
}

//跳转语句，如果是手机访问则提示微信打开,微信打开时判断是否授权
function isMobileVisitAndAuthorize(redirect_url){
  if (!system.win && !system.mac && !system.xll && !system.ipad) {
    var openid = $.cookie("openid");
    if(openid == undefined || openid == null || openid==""){
      weixinAuthorize(redirect_url);
    }
  }
}

function weixinAuthorize(redirect_url){
  var code = GetQueryString("code");
  if(code == null || code ==""){
    location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx591ea71490e6902b&redirect_uri="+redirect_url+"&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect");
  }else{
    $.ajax({
      url:'https://hljaxx.k618.cn/hljxuexi/weixin/openid?appId=wx591ea71490e6902b&code='+code,
      method:'GET',
      timeout:10000,
      success:function(data){
        if(data.message == "SUCCESS"){
          $.cookie("openid", data.data, {domain:'k618.cn', path: '/'});
        }
      }
    });
  }
}
function numtocnnum(section) {
  let n = parseInt(section);
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  // var chnUnitChar = ["", "十", "百", "千"];
  // var strIns = '', chnStr = '';
  // var unitPos = 0;
  // var zero = true;
  // while (section > 0) {
  //     var v = section % 10;
  //     if (v === 0) {
  //         if (!zero) {
  //             zero = true;
  //             chnStr = chnNumChar[v] + chnStr;
  //         }
  //     } else {
  //         zero = false;
  //         strIns = chnNumChar[v];
  //         strIns += chnUnitChar[unitPos];
  //         chnStr = strIns + chnStr;
  //     }
  //     unitPos++;
  //     section = Math.floor(section / 10);
  // }

  return chnNumChar[n];
}
