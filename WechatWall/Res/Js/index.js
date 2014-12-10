$(document).ready(function(){
    content_limit = 20;
    comment_limit = 20;
    body_scoroll_top = 0;
    share_data_tmp = {}
        share_data_tmp.tTitle = window.shareData.tTitle;
        share_data_tmp.fTitle = window.shareData.fTitle;
        share_data_tmp.tContent = window.shareData.tContent;
        share_data_tmp.fContent = window.shareData.fContent;
        share_data_tmp.wContent = window.shareData.wContent;

    is_submit = false;
    i_bubble = false;

    $('nav>span').click(function(){
        more_data($(this).attr('data-eid'), 0, content_limit, true);
    });

    $('.auto_height').bind('input propertychange change', function(e){
          $(this).height(0);
          $(this).outerHeight($(this)[0].scrollHeight+2);
    });

    $('#post_form').submit(function(){
        post_data($(this), $('#post_form button'), function(){
            is_submit = false;
            // more_data($('#post_class').val(), 0, content_limit, true);
            more_data(0, 0, content_limit, true);
            $('#post_content').val('');
            $('#post_content').outerHeight(36);
        });
        return false;
    });

    $('#get_more_data').click(function(){
        more_data($('nav>span.selected').attr('data-eid'), $('#items>li').size(), content_limit, false);
    });

    $('.nick_input').change(function(){
        $('.nick_input').val($(this).val());
        $.cookie('nickname', $(this).val(), { 'path':'/','expires':1582308122 } );
    });

    $('#close_one').click(function(){
        $('#one_out').fadeOut();
        location.hash = '';
        modify_share_data('', '', share_data_tmp);
        $('#outer').show();
        $('body').scrollTop(body_scoroll_top);
    });

    $('.nick_input').val($.cookie('nickname'));

    var id = location.hash.replace('#', '');
    if(id != ''){
        $('#one_out').fadeIn();

        // show_one($('h1'), id, function(r){
        //     modify_share_data(r.data.nick + ': ' +r.data.con, r.data.con);
        //     more_comment_data(id, 0, comment_limit, true, function(){
        //         $('#one_comment_box_' + id).slideDown(function(r){
        //             $('#one_comment_' + id).attr('data-show', '1');
        //         });
        //     }, $('#one_comment_content_' + id), $(this), $('#one_get_more_comment_'+ id));
        // });

        show_one($(this), id, function(r){
            location.hash = id;
            modify_share_data(r.data.nick + ': ' +r.data.con, r.data.con);
            more_comment_data(id, 0, comment_limit, true, function(){
                $('#one_comment_box_' + id).slideDown(function(){
                    $('#one_comment_' + id).attr('data-show', '1');
                    is_submit = false;
                    more_data(0, 0, content_limit, true);
                });
            }, $('#one_comment_content_' + id), $(this), $('#one_get_more_comment_'+ id));
        });
    }else{
        more_data(0, 0, content_limit, true);
    }

    // smartTouchScroll();
    // $('#outer').height($(window).height());
    snow();
});

function more_data(class_id, start, count, clear_con){
    if(!is_submit){
        is_submit = true;
        var button = $('nav>span[data-eid='+ class_id +']');
        var button2 = $('#get_more_data');
        button.addClass('twinkle');
        button2.addClass('twinkle');
        show_bubble('加载中……', 0);

        $.ajax({
            url: $('nav').attr('data-url'),
            type: 'post',
            dataType: 'JSON',
            data: {eid: button.attr('data-eid'), start: start, count: count},
         })
        .done(function(r){
            if(r.status == 1){
                var content_box = $('#items');

                if(clear_con === true){
                    content_box.html('');
                }
                append_data(content_box, r.data);

                $('nav>span').removeClass('selected');
                button.addClass('selected');
                var class_id = (button.attr('data-eid') != '0') ? button.attr('data-eid') : '1';
                $('#post_class').val(class_id);
                // $('#post_class option').removeAttr('selected');
                // $('#post_class>option[value='+ button.attr('data-eid') +']').attr('selected', 'selected');
                show_bubble('加载完成！', 1000);
            }else{
                show_bubble(r.info, 3000);
            }
        })
        .fail(function(){
            // alert('网络错误！\n请稍候再试');
            show_bubble('网络错误！请稍候再试', 3000);
        })
        .always(function(){
            is_submit = false;
            button.removeClass('twinkle');
            button2.removeClass('twinkle');
        });
    }
}

function post_data(form, button, dFun, fFun, aFun){
    if(!arguments[2]) dFun = function(p){};
    if(!arguments[3]) fFun = function(p){};
    if(!arguments[4]) aFun = function(p){};

    if(!is_submit){
        is_submit = true;
        button.addClass('twinkle');
        show_bubble('发布中……', 0);
        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            dataType: 'JSON',
            data: form.serialize(),
         })
        .done(function(r){
            if(r.status == 1){
                show_bubble(r.info, 1000);
                dFun(r);
                // alert(r.info);
            }else{
                show_bubble(r.info, 1000);
                // alert(r.info);
                fFun(r);
            }
        })
        .fail(function(r){
            // alert('网络错误！\n请稍候再试');
            show_bubble('网络错误！请稍候再试', 3000);
            fFun(r);
        })
        .always(function(r){
            is_submit = false;
            button.removeClass('twinkle');
            aFun(r);
        });
    }
}

function append_data(box, data){
    item_tpl = '<li id="item_{id}" data-id="{id}" data-class="{class}">\
                    <span class="bull"></span>\
                    <span class="flag" style="border-top-color:{color};border-right-color:{color}"></span>\
                    <div class="content" style="background-color:{color}">\
                        <div class="tail"><span class="hash_rows">#{id} · {nick} | {class_name}</span></div>\
                        <div class="time" data-time="{time_r}" title="{time}">{time_r}</div>\
                        <!--div class="author">{nick}</div-->\
                        <div class="con">{con}</div>\
                        <div class="action"><span id="export_{id}" class="export" data-eid="{id}" data-show="0">&nbsp;</span><span id="good_{id}" class="good"></span><span id="comment_{id}" class="comment" data-eid="{id}" data-show="0">{com_count}</span><div class="clear"></div></div>\
                        <div id="comment_box_{id}" class="comment_box hide">\
                            <form id="comment_form_{id}" data-eid="{id}" class="pure-form comment_form" action="{comment_url}" method="post">\
                                <textarea class="auto_height content_input" name="comment_content" rows="1" maxlength="140" placeholder="我来说两句"></textarea>\
                                <input type="text" class="nick_input" name="comment_nick" maxlength="12" placeholder="昵称" value="{my_nick}" />\
                                <input type="hidden" name="comment_id" value="{id}" />\
                                <button class="pure-button pure-button-primary">评论</button>\
                            </form>\
                            <div class="comment_content_box_out">\
                                <ul class="comment_content_box" id="comment_content_{id}">\
                                    <div class="sofa">还没有人评论，快抢沙发吧！</div>\
                                </ul>\
                                <div id="get_more_comment_{id}" class="pure-button pure-button-primary get_more_comment" data-eid="{id}">更多评论</div>\
                            </div>\
                        </div>\
                    </div>\
                </li>\
                ';
    var items_html = '';
    var comment_url = $('#items').attr('data-comment-url');
    var my_nick = $('#post_nick').val();
    for(var item in data){
        data[item].comment_url = comment_url;
        data[item].my_nick = my_nick;
        items_html += item_tpl.oformat(data[item]);
    }
    box.append(items_html);

    $('.auto_height').unbind('input propertychange change').bind('input propertychange change', function(e){
        $(this).height(0);
        $(this).outerHeight($(this)[0].scrollHeight+2);
    });

    $('li .comment_form').unbind('submit').bind('submit', function(){
        post_data($(this), $(this).children('button'), function(p){
            is_submit = false;
            more_comment_data(p.eid, 0, comment_limit, true);
            $('.content_input[name=comment_content]').val('');
            $('.content_input[name=comment_content]').outerHeight(36);
        });
        return false;
    });

    $('.nick_input').unbind('change').bind('change', function(){
        $('.nick_input').val($(this).val());
        $.cookie('nickname', $(this).val(), { 'path':'/','expires':1582308122 } );
    });

    $('li .get_more_comment').unbind('click').bind('click', function(){
        var eid = $(this).attr('data-eid');
        more_comment_data(eid, $('#comment_content_'+ eid +'>li').size(), comment_limit, false);
    });

    $('li .comment').unbind('click').bind('click', function(){
        var eid = $(this).attr('data-eid');
        
        if($(this).attr('data-show') == 1){
            $(this).attr('data-show', '0');
            $('#comment_box_' + eid).slideUp();
        }else{
            more_comment_data(eid, 0, comment_limit, true, function(){
                $('#comment_box_' + eid).slideDown(function(){
                    $('#comment_' + eid).attr('data-show', '1');
                });
            });            
        }

    });

    $('.export').unbind('click').bind('click', function(){
        var id = $(this).attr('data-eid');
        show_one($(this), id, function(r){
            location.hash = id;
            modify_share_data(r.data.nick + ': ' +r.data.con, r.data.con);
            more_comment_data(id, 0, comment_limit, true, function(){
                $('#one_comment_box_' + id).slideDown(function(){
                    $('#one_comment_' + id).attr('data-show', '1');
                });
            }, $('#one_comment_content_' + id), $(this), $('#one_get_more_comment_'+ id));
        });
        return false;
    });

    $('.time').timeago();
    // $('#one_out').outerHeight($(document).height());
}

function append_comment_data(box, data){
// alert(1);
    // return false;
    item_tpl = '<li data-id="{id}" data-eid="{eid}">\
                    <span class="bull_c"></span>\
                    <span class="flag_c" style="border-top-color:{color};border-left-color:{color}"></span>\
                    <div class="comment_con" style="background-color: {color}">\
                    <div class="tail"><span class="hash_rows">#{row} · {nick}</span></div>\
                        <div class="time" data-time="{time_r}" title="{time}">{time_r}</div>\
                        <!--div class="author">{nick}</div-->\
                        <div class="con">{con}</div>\
                        <!--div class="action"><span id="good_{id}" class="good">赞({good})</span><span id="bad_{id}" class="bad">沉{bad}</span></div-->\
                        </div>\
                </li>\
                ';
    var items_html = '';
    // var comment_url = $('#items').attr('data-comment-url');
    // var my_nick = $('#post_nick').val();
    for(var item in data){
        // data[item].comment_url = comment_url;
        // data[item].my_nick = my_nick;
        items_html += item_tpl.oformat(data[item]);
    }
    box.append(items_html);
    // $('#one_out').outerHeight($(document).height());
    $('.time').timeago();
}

function show_one(button, id, aFun){
    if(!arguments[1]) id = buttLon.attr('data-eid');
    if(!arguments[2]) aFun = function(){};

    if(!is_submit){
        is_submit = true;

        button.addClass('twinkle');
        show_bubble('加载中……', 0);

        $.ajax({
            url: $('#one_out').attr('data-url'),
            type: 'post',
            dataType: 'JSON',
            data: {id: id},
         })
        .done(function(r){
            if(r.status == 1){
                var content_box = $('#one');
                var html_tpl = '<div class="content" style="background-color:{color}">\
                        <div class="tail"><span class="hash_rows">#{id} · {nick} | {class_name}</span></div>\
                        <div class="time" data-time="{time_r}" title="{time}">{time_r}</div>\
                        <!--div class="author">{nick}</div-->\
                        <div class="con">{con}</div>\
                        <div class="action"><span id="one_one_share_{id}" class="share" data-eid="{id}" data-show="0">&nbsp;</span><span id="one_good_{id}" class="good"></span><span id="one_comment_{id}" class="comment" data-eid="{id}" data-show="0">{com_count}</span><div class="clear"></div></div>\
                        <div id="one_comment_box_{id}" class="comment_box hide">\
                            <form id="one_comment_form_{id}" data-eid="{id}" class="pure-form comment_form" action="{comment_url}" method="post">\
                                <textarea class="auto_height content_input" name="comment_content" rows="1" maxlength="140" placeholder="我来说两句"></textarea>\
                                <input type="text" class="nick_input" name="comment_nick" maxlength="12" placeholder="昵称" value="{my_nick}" />\
                                <input type="hidden" name="comment_id" value="{id}" />\
                                <button class="pure-button pure-button-primary">评论</button>\
                            </form>\
                            <div class="comment_content_box_out">\
                                <ul class="comment_content_box" id="one_comment_content_{id}">\
                                    <div class="sofa">还没有人评论，快抢沙发吧！</div>\
                                </ul>\
                                <div id="one_get_more_comment_{id}" class="pure-button pure-button-primary get_more_comment" data-eid="{id}">更多评论</div>\
                            </div>\
                        </div>\
                    </div>\
                        ';

                var comment_url = $('#items').attr('data-comment-url');
                var my_nick = $('#post_nick').val();
                r.data.comment_url = comment_url;
                r.data.my_nick = my_nick;
                var html = html_tpl.oformat(r.data);

                content_box.html(html);

                $('#one .auto_height').unbind('input propertychange change').bind('input propertychange change', function(e){
                    $(this).height(0);
                    $(this).outerHeight($(this)[0].scrollHeight+2);
                });

                $('#one .comment_form').unbind('submit').bind('submit', function(){
                    post_data($(this), $(this).children('button'), function(p){
                        is_submit = false;
                        more_comment_data(p.eid, 0, comment_limit, true, function(){}, $('#one_comment_content_' + p.eid), $('#one_comment_' + p.eid), $('#one_get_more_comment_'+ p.eid));
                        $('.content_input[name=comment_content]').val('');
                        $('.content_input[name=comment_content]').outerHeight(36);
                    });
                    return false;
                });

                $('#one .nick_input').unbind('change').bind('change', function(){
                    $('.nick_input').val($(this).val());
                    $.cookie('nickname', $(this).val(), { 'path':'/','expires':1582308122 } );
                });

                $('#one .comment').unbind('click').bind('click', function(){
                    var eid = $(this).attr('data-eid');
                    
                    if($(this).attr('data-show') == 1){
                        $(this).attr('data-show', '0');
                        $('#one_comment_box_' + eid).slideUp();
                    }else{
                        more_comment_data(eid, 0, comment_limit, true, function(){
                            $('#one_comment_box_' + eid).slideDown(function(){
                                $('#one_comment_' + eid).attr('data-show', '1');
                            });                            
                        }, $('#one_comment_content_' + eid), $(this), $('#one_get_more_comment_'+ eid));
                    }

                });

                $('#one .get_more_comment').unbind('click').bind('click', function(){
                    var eid = $(this).attr('data-eid');
                    more_comment_data(eid, $('#one_comment_content_'+ eid +'>li').size(), comment_limit, false, function(){}, $('#one_comment_content_' + eid), $('#one_comment_' + eid), $('#one_get_more_comment_'+ eid));
                });

                $('.share').click(function(){
                    $('#share-wx').fadeIn();
                });

                $('.time').timeago();
                body_scoroll_top = $('body').scrollTop();
                $('#outer').hide();
                $('#one_out').fadeIn(function(){
                });
                show_bubble('加载完成！', 1000);
            }else{
                alert(r.info);
            }
        })
        .fail(function(){
            alert('网络错误！\n请稍候再试');
            // show_bubble('网络错误！请稍候再试', 3000);
        })
        .always(function(r){
            is_submit = false;
            button.removeClass('twinkle');
            aFun(r);
        });
    }
}

function show_bubble(html, time){
    var bubble = $('#bubble_out');
    $('#bubble').html(html);
    bubble.fadeIn();

    if(i_bubble != 'undefined'){
        clearTimeout(i_bubble);
    }
    if(time != 0){
        i_bubble = window.setTimeout(function(){
            bubble.fadeOut();
        }, time);
    }
}

function more_comment_data(eid, start, count, clear_con, dFun, content_box, button, button2){
    if(!arguments[4]) dFun = function(p){};
    if(!arguments[5]) content_box = $('#comment_content_' + eid);
    if(!arguments[6]) button = $('#comment_'+ eid);
    if(!arguments[7]) button2 = $('#get_more_comment_'+ eid);

    if(!is_submit){
        is_submit = true;
        button.addClass('twinkle');
        button2.addClass('twinkle');
        // return false;
        show_bubble('加载中……', 0);

        $.ajax({
            url: $('#items').attr('data-comment-data-url'),
            type: 'post',
            dataType: 'JSON',
            data: {eid: eid, start: start, count: count},
         })
        .done(function(r){
            if(r.status == 1){

                if(clear_con === true){
                    content_box.html('');
                }

                append_comment_data(content_box, r.data);

                button.text(r.total_count);
                show_bubble('加载完成！', 1000);
                dFun(r);
            }else{
                show_bubble(r.info, 3000);
                dFun(r);
            }
        })
        .fail(function(){
            // alert('网络错误！\n请稍候再试');
            show_bubble('网络错误！请稍候再试', 3000);
        })
        .always(function(){
            is_submit = false;
            button.removeClass('twinkle');
            button2.removeClass('twinkle');
        });
    }
}

function modify_share_data(title, content, default_data){
    if(arguments[2]){
        window.shareData.tTitle = share_data_tmp.tTitle;
        window.shareData.fTitle = share_data_tmp.fTitle;
        window.shareData.tContent = share_data_tmp.tContent;
        window.shareData.fContent = share_data_tmp.fContent;
        window.shareData.wContent = share_data_tmp.wContent;

        var url = location.href.replace(/#.*/, '');
        window.shareData.timeLineLink = url;
        window.shareData.sendFriendLink = url;
        window.shareData.weiboLink = url;
    }else{
        title += ' from:'+share_data_tmp.tTitle;
        window.shareData.tTitle = title;
        window.shareData.fTitle = title;
        window.shareData.tContent = content;
        window.shareData.fContent = content;
        window.shareData.wContent = title;

        var url = location.href;
        window.shareData.timeLineLink = url;
        window.shareData.sendFriendLink = url;
        window.shareData.weiboLink = url;
    }
}

String.prototype.oformat = function(param){
    var reg = /{([^{}]+)}/gm;
    return this.replace(reg, function(match, name){
      return param[name];
    });
}

jQuery.cookie = function(name, value, options){
     if(typeof value != 'undefined'){ // name and value given, set cookie
        options = options || {};
        if(value === null){
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if(options.expires &&(typeof options.expires == 'number' || options.expires.toUTCString)){
            var date;
            if(typeof options.expires == 'number'){
                date = new Date();
                date.setTime(date.getTime()+(options.expires * 24 * 60 * 60 * 1000));
            }else{
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' +(options.path): '';
        var domain = options.domain ? '; domain=' +(options.domain): '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    }else{
        var cookieValue = null;
        if(document.cookie && document.cookie != ''){
            var cookies = document.cookie.split(';');
            for(var i = 0; i < cookies.length; i++){
                var cookie = jQuery.trim(cookies[i]);
                if(cookie.substring(0, name.length + 1)==(name + '=')){
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
 };

(function(factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }else{
        // Browser globals
        factory(jQuery);
    }
 }(function($){
    $.timeago = function(timestamp){
        if(timestamp instanceof Date){
            return inWords(timestamp);
        }else if(typeof timestamp === "string"){
            return inWords($.timeago.parse(timestamp));
        }else if(typeof timestamp === "number"){
            return inWords(new Date(timestamp));
        }else{
            return inWords($.timeago.datetime(timestamp));
        }
    };
    var $t = $.timeago;
    $.extend($.timeago,{
        settings:{
            refreshMillis: 60000,
            allowFuture: false,
            localeTitle: false,
            cutoff: 0,
            strings:{
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "前",
                suffixFromNow: "from now",
                seconds: "%d秒",
                minute: "1分钟",
                minutes: "%d分钟",
                hour: "1小时",
                hours: "%d小时",
                day: "1天",
                days: "%d天",
                month: "1月",
                months: "%d月",
                year: "1年",
                years: "%d年",
                wordSeparator: "",
                numbers: []
            }
        },
        inWords: function(distanceMillis){
            var $l = this.settings.strings;
            var prefix = $l.prefixAgo;
            var suffix = $l.suffixAgo;
            if(this.settings.allowFuture){
                if(distanceMillis < 0){
                    prefix = $l.prefixFromNow;
                    suffix = $l.suffixFromNow;
                }
            }
            var seconds = Math.abs(distanceMillis) / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            function substitute(stringOrFunction, number){
                var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
                var value =($l.numbers && $l.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }
            var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute($l.minute, 1) ||
                minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute($l.hour, 1) ||
                hours < 24 && substitute($l.hours, Math.round(hours)) ||
                hours < 42 && substitute($l.day, 1) ||
                days < 30 && substitute($l.days, Math.round(days)) ||
                days < 45 && substitute($l.month, 1) ||
                days < 365 && substitute($l.months, Math.round(days / 30)) ||
                years < 1.5 && substitute($l.year, 1) ||
                substitute($l.years, Math.round(years));
            var separator = $l.wordSeparator || "";
            if($l.wordSeparator === undefined){
                separator = " ";
            }
            return $.trim([prefix, words, suffix].join(separator));
        },
        parse: function(iso8601){
            var s = $.trim(iso8601);
            s = s.replace(/\.\d+/, ""); // remove milliseconds
            s = s.replace(/-/, "/").replace(/-/, "/");
            s = s.replace(/T/, " ").replace(/Z/, " UTC");
            s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
            return new Date(s);
        },
        datetime: function(elem){
            var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
            return $t.parse(iso8601);
        },
        isTime: function(elem){
            // jQuery's `is()` doesn't play well with HTML5 in IE
            return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
        }
    });
    // functions that can be called via $(el).timeago('action')
    // init is default when no action is given
    // functions are called with context of a single element
    var functions ={
        init: function(){
            var refresh_el = $.proxy(refresh, this);
            refresh_el();
            var $s = $t.settings;
            if($s.refreshMillis > 0){
                setInterval(refresh_el, $s.refreshMillis);
            }
        },
        update: function(time){
            $(this).data('timeago',{
                datetime: $t.parse(time)
            });
            refresh.apply(this);
        },
        updateFromDOM: function(){
            $(this).data('timeago',{
                datetime: $t.parse($t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title"))
            });
            refresh.apply(this);
        }
    };
    $.fn.timeago = function(action, options){
        var fn = action ? functions[action] : functions.init;
        if(!fn){
            throw new Error("Unknown function name '" + action + "' for timeago");
        }
        // each over objects here and call the requested function
        this.each(function(){
            fn.call(this, options);
        });
        return this;
    };

    function refresh(){
        var data = prepareData(this);
        var $s = $t.settings;
        if(!isNaN(data.datetime)){
            if($s.cutoff == 0 || distance(data.datetime) < $s.cutoff){
                $(this).text(inWords(data.datetime));
            }
        }
        return this;
    }

    function prepareData(element){
        element = $(element);
        if(!element.data("timeago")){
            element.data("timeago",{
                datetime: $t.datetime(element)
            });
            var text = $.trim(element.text());
            if($t.settings.localeTitle){
                element.attr("title", element.data('timeago').datetime.toLocaleString());
            }else if(text.length > 0 && !($t.isTime(element) && element.attr("title"))){
                element.attr("title", text);
            }
        }
        return element.data("timeago");
    }

    function inWords(date){
        return $t.inWords(distance(date));
    }

    function distance(date){
        return(new Date().getTime() - date.getTime());
    }
    // fix for IE6 suckage
    document.createElement("abbr");
    document.createElement("time");
 }));

// <script>
function snow(){
    //canvas init
    var canvas = document.getElementById("snow_canvas");
    var ctx = canvas.getContext("2d");
    
    //canvas dimensions
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    
    //snowflake particles
    var mp = 50; //max particles
    var particles = [];
    for(var i = 0; i < mp; i++)
    {
        particles.push({
            x: Math.random()*W, //x-coordinate
            y: Math.random()*H, //y-coordinate
            r: Math.random()*3+1, //radius
            d: Math.random()*mp //density
        })
    }
    
    //Lets draw the flakes
    function draw()
    {
        ctx.clearRect(0, 0, W, H);
        
       ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
       /* ctx.fillStyle = "#FF0000";*/
        ctx.beginPath();
        for(var i = 0; i < mp; i++)
        {
            var p = particles[i];
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
        }
        ctx.fill();
        update();
    }
    
    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;
    function update()
    {
        angle += 0.01;
        for(var i = 0; i < mp; i++)
        {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle+p.d) + 1 + p.r/2;
            p.x += Math.sin(angle) * 2;
            
            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if(p.x > W || p.x < 0 || p.y > H)
            {
                if(i%3 > 0) //66.67% of the flakes
                {
                    particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
                }
                else
                {
                    //If the flake is exitting from the right
                    if(Math.sin(angle) > 0)
                    {
                        //Enter fromth
                        particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
                    }
                    else
                    {
                        //Enter from the right
                        particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
                    }
                }
            }
        }
    }
    
    //animation loop
    setInterval(draw, 50);
}
// </script>