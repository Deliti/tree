var apiPath = urlConfig.apiPath || ''

var ajaxRequest = function(path, params, callBack, needCode, method) {
    var url = apiPath + path
    var token = localStorage['token'] || ''
    url = needCode ? url + '?token='+token : url
    var type = method == 'get'?'GET':'POST'
    $.ajax({
        url: url,  //+';JSESSIONID='+$.cookie('JSESSIONID')
        timeout: 10*60*1000,
        type: type,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: params,
        success: function(data){
            //处理 解析ajax 服务器端返回的  null对象
            var  dataStr = JSON.stringify(data);
            dataStr=dataStr.replace(new RegExp(":null","gm"),':""');
            var  parseData = $.parseJSON(dataStr) ;
            if (parseData.code == 500) {
                localStorage.clear()
                location.replace('./login.html')
                // location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3d87ebb7df88b56c&redirect_uri=http%3A%2F%2Fzhgbdstxmjj.yilianservice.com%2Fvote%2Fhtml%2Findex.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect')
            } else {
                if (parseData.code != 200) {
                    utils.tips(parseData.msg)
                    return false
                }
                callBack(parseData);
            }
        }
    });
};

// var ajaxSyncRequest = function(cmdName, params, callBack) {
//     var paramsData = new Cmd(cmdName, params);
//     $.ajax({
//         url: apiPath,
//         timeout: 10*60*1000,   //响应超时时间设置为10分钟
//         type: "POST",
//         dataType: "json",
//         contentType: "application/x-www-form-urlencoded",
//         data: paramsData,
//         async: false,
//         success: function(data){
//             //处理 解析ajax 服务器端返回的  null对象
//             var  dataStr = JSON.stringify(data);
//             dataStr=dataStr.replace(new RegExp(":null","gm"),':""');
//             var  parseData = $.parseJSON(dataStr) ;
//             callBack(parseData);
//         }
//     });
// };
