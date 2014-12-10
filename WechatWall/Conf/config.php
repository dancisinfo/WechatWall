<?php
return array(
    //'配置项'=>'配置值'
    'CLASS_NAMES' => array(
        array('全部', 'rgba(215, 41, 80, .85)'),
        array('表白', 'rgba(239, 112, 39, .85)'),
        array('吐槽', 'rgba(0, 175, 215, .85)'),
        array('心愿', 'rgba(229, 182, 0, .85)'),
        // array('测试', 'rgba(229, 182, 0, .85)'),
        // array('测试2', 'rgba(229, 182, 0, .85)'),
    ),

    'COMMENT_COLORS' => array(
        'rgba(255, 255, 255, .8)',
        'rgba(0, 175, 215, .85)',
        'rgba(239, 112, 39, .85)',
        'rgba(229, 182, 0, .85)'
    ),

    'SITE_NAME' => '辽科大微信墙',
    'HTML_TITLE' => '辽科大微信墙',
    'COPY_STR' => '辽科大助手版权所有 微信号 lkdhelper',











    'URL_MODEL' => '0',
    'TOKEN_ON' => false,
    'IP_ACCESS_INTERVAL' => 5,
    'URL_CASE_INSENSITIVE' => true,
    'SESSION_AUTO_START' => true,
    'DEFAULT_TIMEZONE' => 'Asia/Shanghai',
    'TMPL_PARSE_STRING'  =>array(
        '___CSS___' => 'WechatWall/Res/Css',
        '___JS___' => 'WechatWall/Res/Js', 
        '___IMG___' => 'WechatWall/Res/Img',
        '__CSS__' => 'Res/Css',
        '__JS__' => 'Res/Js', 
        '__IMG__' => 'Res/Img',
    ),

    'LOAD_EXT_CONFIG' => 'db_sae',    
    // 'LOAD_EXT_CONFIG' => 'db',
);
?>