<?php
return array(
    //'配置项'=>'配置值'
    //PDO连接方式
    'DB_TYPE'   => 'pdo', // 数据库类型
    'DB_USER'   => SAE_MYSQL_USER, // 用户名
    'DB_PWD'    => SAE_MYSQL_PASS, // 密码
    'DB_PREFIX' => 'wxw_', // 数据库表前缀 
    'DB_DSN'    => 'mysql:host='.SAE_MYSQL_HOST_M.';port='.SAE_MYSQL_PORT.';dbname='.SAE_MYSQL_DB.';charset=utf8',
    'DB_FIELDTYPE_CHECK' => true
);
?>