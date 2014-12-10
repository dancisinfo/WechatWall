<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="cn_ZH">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="viewport" content=" initial-scale=1.0,user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    
    <title><?php echo ($html_title); ?></title>

    <link rel="stylesheet" href="__ROOT__/__CSS__/pure.css" />
    <link rel="stylesheet" href="__ROOT__/___CSS___/index.css?v=0.02" />
    <script src="__ROOT__/__JS__/jquery-2.1.1.min.js"></script>
    <script src="__ROOT__/___JS___/index.js?v=0.05"></script>
</head>
<body class="pure-skin-yang">
    <header>
        <h1><?php echo ($site_name); ?></h1>
        <nav data-url="<?php echo ($data_url); ?>">
            <span class="selected" data-eid="0">全部</span>
            <span data-eid="1">栏目1</span>
            <span data-eid="2">栏目2</span>
            <span data-eid="3">栏目3</span>
        </nav>
    </header>

    <div id="post_box">
        <fieldset>
            <legend>想说点什么呢~</legend>
            <form id="post_form" class="pure-form" action="<?php echo ($post_url); ?>" method="post">
                <textarea class="content_input auto_height" name="post_content" id="post_content" rows="1" maxlength="300" placeholder="在这里说呢~"></textarea>
                <div class="post_op">
                    <label style="display:inline-block">发布在: <select name="post_class" id="post_class">
                        <option value="1" selected="selected">栏目1</option>
                        <option value="2">栏目2</option>
                        <option value="3">栏目3</option>
                    </select></label>
                    <input type="text" class="nick_input" id="post_nick" name="post_nick" maxlength="12" placeholder="昵称" />
                    <button class="pure-button pure-button-primary">发布</button>
                </div>
            </form>
        </fieldset>
    </div>

    <div class="contents">
        <ul id="items" data-comment-url="<?php echo ($comment_url); ?>" data-comment-data-url="<?php echo ($comment_data_url); ?>">
        </ul>
        <div id="get_more_data" class="pure-button pure-button-primary">查看更多</div>
    </div>
    
    <div id="one_out" data-url="<?php echo ($one_url); ?>">
        <span id="close_one"></span>
        <div id="one">
            请稍候……
        </div>
    </div>
    <div id="bubble_out"><div id="bubble"></div></div>

    <footer>
        <div class="copy_str"><?php echo ($copy_str); ?></div>
    </footer>
    <img src="__ROOT__/___IMG___/bg.png" alt="background" id="background_img" />
<script type="text/javascript">
window.shareData = {   
           "imgUrl": 'http://' + window.location.host + '__ROOT__/___IMG___/share_logo.png', 
            "timeLineLink": location.href,
            "sendFriendLink": location.href,
            "weiboLink": location.href,
            "tTitle": '<?php echo ($share_title); ?>',
            "tContent": '<?php echo ($share_content); ?>',
            "fTitle": '<?php echo ($share_title); ?>', 
            "fContent": '<?php echo ($share_content); ?>',
            "wContent": '<?php echo ($share_title); ?>'
    };
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        WeixinJSBridge.invoke('sendAppMessage', {
            "img_url": window.shareData.imgUrl,
            // "img_width": "640",
            // "img_height": "640", 
            "link": window.shareData.sendFriendLink,
            "desc": window.shareData.fContent,
            "title": window.shareData.fTitle
        }, function(res){
                    _report('send_msg', res.err_msg);
                })
        });

    // 分享到朋友圈 
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        WeixinJSBridge.invoke('shareTimeline', {
            "img_url": window.shareData.imgUrl,
            "img_width": "640",
            "img_height": "640", 
            "link": window.shareData.timeLineLink,
            "desc": window.shareData.tContent,
            "title": window.shareData.tTitle
        }, function(res){
                _report('timeline', res.err_msg);
        });
    });


    // 分享到微博 
    WeixinJSBridge.on('menu:share:weibo', function(argv){
        WeixinJSBridge.invoke('shareWeibo', { 
            "content": window.shareData.wContent,
            "url": window.shareData.weiboLink,
        }, function (res) { 
                _report('weibo', res.err_msg);
            });
    });

}, false)
</script>
</body>
</html>