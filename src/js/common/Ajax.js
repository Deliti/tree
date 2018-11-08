var apiPath = '/api'
function Cmd(cmd, params) {
    this.cmd = cmd;
    this.params = params;
}

var ajaxRequest = function(cmdName, params, callBack) {
    var paramsData = new Cmd(cmdName, params);
    $.ajax({
        url: apiPath,  //+';JSESSIONID='+$.cookie('JSESSIONID')
        timeout: 10*60*1000,
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: paramsData,
        success: function(data){
            //处理 解析ajax 服务器端返回的  null对象
            var  dataStr = JSON.stringify(data);
            dataStr=dataStr.replace(new RegExp(":null","gm"),':""');
            var  parseData = $.parseJSON(dataStr) ;
            if (parseData.result == 10) {
                localStorage.clear()
                location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3d87ebb7df88b56c&redirect_uri=http%3A%2F%2Fzhgbdstxmjj.yilianservice.com%2Fvote%2Fhtml%2Findex.html&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect')
            } else {
                callBack(parseData);
            }
        }
    });
};

var ajaxSyncRequest = function(cmdName, params, callBack) {
    var paramsData = new Cmd(cmdName, params);
    $.ajax({
        url: apiPath,
        timeout: 10*60*1000,   //响应超时时间设置为10分钟
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: paramsData,
        async: false,
        success: function(data){
            //处理 解析ajax 服务器端返回的  null对象
            var  dataStr = JSON.stringify(data);
            dataStr=dataStr.replace(new RegExp(":null","gm"),':""');
            var  parseData = $.parseJSON(dataStr) ;
            callBack(parseData);
        }
    });
};
