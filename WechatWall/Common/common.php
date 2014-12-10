<?php
function html($str){
    return htmlspecialchars($str, ENT_QUOTES);
}

function ip_access_limit($ip_access_interval = 5){
    if(getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')){
        $userip = getenv('HTTP_CLIENT_IP');
    }elseif(getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')){
        $userip = getenv('HTTP_X_FORWARDED_FOR');
    }elseif(getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')){
        $userip = getenv('REMOTE_ADDR');
    }elseif(isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')){
        $userip = $_SERVER['REMOTE_ADDR'];
    }


    // session_id(md5($userip));
    // session_start();
    // if(isset($_SESSION['access_time'])){
    //     $last_time = $_SESSION['access_time'];
    //     if((time() - $last_time) < $ip_access_interval){
    //         $_SESSION['access_time'] = time();
    //         return false;
    //     }
    // }
    // $_SESSION['access_time'] = time();

    $session['name'] = md5($userip);
    $session['expire'] = 3600;
    session($session);

    $last_time = (int)session('access_time');
    if((time() - $last_time) < $ip_access_interval){
        session('access_time', time());
        return false;
    }
    session('access_time', time());
    return true;
}