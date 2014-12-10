<?php
class DataAction extends Action {
    public function postContent(){
        if(ip_access_limit(C('IP_ACCESS_INTERVAL'))){
            $post = D('Content');
            $this->ajaxReturn($post->addContent(), 'JSON');
        }else{
            $ajax['status'] = -3;
            $ajax['info'] = '访问超速，请稍候再试！';
            $this->ajaxReturn($ajax, 'JSON');
        }

    }

    public function getContent(){
        $class_id = (int)$_POST['eid'];
        $start = (int)$_POST['start'];
        $count = (int)$_POST['count'];

        $result = D('Content');
        $tmp_arr = $result->getContent($class_id, $start, $count);

        $rows = array();
        foreach($tmp_arr as $val) {
            $tmp_arr1 = array();

            $tmp_arr1['id'] = $val['id'];
            $tmp_arr1['class'] = $val['class_id'];
            $tmp_arr1['nick'] = $val['author'] ? html($val['author']) : '匿名';
            $tmp_arr1['time'] = date('Y-m-d H:i:s', $val['post_time']);
            $tmp_arr1['time_r'] = date('Y-m-d H:i', $val['post_time']);
            $tmp_arr1['con'] = html($val['content']);
            $tmp_arr1['com_count'] = $val['comment_count'];
            $tmp_arr1['good'] = $val['good'];

            $class_names = C('class_names');

            $tmp_arr1['color'] = $class_names[$val['class_id']][1];
            $tmp_arr1['class_name'] = $class_names[$val['class_id']][0];

            $rows[] = $tmp_arr1;
        }

        if($tmp_arr !== false){
            $rows_count = count($rows);
            if($rows_count != 0){
                $data['status'] = 1;
                $data['info'] = $class_id;
                $data['size'] = $rows_count;
                $data['data'] = $rows;
            }else{
                $data['status'] = -2;
                $data['info'] = '没有更多，去发布一条吧！';
                $data['size'] = 0;
                $data['data'] = $rows;           
            }
        }else{
            $data['status'] = -1;
            $data['info'] = '系统繁忙！';
            $data['size'] = -1;
            $data['data'] = $rows;
        }

        $this->ajaxReturn($data,'JSON');
    }

    public function postComment(){
        if(ip_access_limit(C('IP_ACCESS_INTERVAL'))){
            $post = D('Comment');
            $this->ajaxReturn($post->addContent(), 'JSON');
        }else{
            $ajax['status'] = -3;
            $ajax['info'] = '访问超速，请稍候再试！';
            $this->ajaxReturn($ajax, 'JSON');            
        }
    }

    public function getComment(){
        $eid = (int)$_POST['eid'];
        $start = (int)$_POST['start'];
        $count = (int)$_POST['count'];

        $result = D('Comment');
        $tmp_arr = $result->getContent($eid, $start, $count);
        $comment_count = $result->getCommentCount($eid);

        // $rows = $tmp_arr;
        $rows = array();
        foreach($tmp_arr as $key => $val) {
            $tmp_arr1 = array();

            $tmp_arr1['id'] = $val['id'];
            $tmp_arr1['row'] = $comment_count - $start - $key;
            $tmp_arr1['eid'] = $val['eid'];
            $tmp_arr1['nick'] = $val['author'] ? html($val['author']) : '匿名';
            $tmp_arr1['time'] = date('Y-m-d H:i:s', $val['time']);
            $tmp_arr1['time_r'] = date('Y-m-d H:i', $val['time']);;
            $tmp_arr1['con'] = html($val['content']);
            $tmp_arr1['good'] = $val['good'];
            $tmp_arr1['bad'] = $val['bad'];

            $colors = C('comment_colors');

            $tmp_arr1['color'] = $colors[rand(1, 3)];

            $rows[] = $tmp_arr1;
        }

        if($tmp_arr !== false){
            $rows_count = count($rows);
            if($rows_count != 0){
                $data['status'] = 1;
                $data['info'] = $eid;
                $data['total_count'] = $comment_count;
                $data['size'] = $rows_count;
                $data['data'] = $rows;
            }else{
                $data['status'] = -2;
                $data['info'] = '没有更多，去发布一条吧！';
                $data['size'] = 0;
                $data['data'] = $rows;           
            }
        }else{
            $data['status'] = -1;
            $data['info'] = '系统繁忙！';
            $data['size'] = -1;
            $data['data'] = $rows;
        }

        $this->ajaxReturn($data,'JSON');
    }

    public function getOne(){
        $id = (int)$_POST['id'];

        $result = D('Content');
        $tmp_arr = $result->getOne($id);

        if($tmp_arr !== false){
            $tmp_arr1 = array();

            $tmp_arr1['id'] = $tmp_arr['id'];
            $tmp_arr1['class'] = $tmp_arr['class_id'];
            $tmp_arr1['nick'] = $tmp_arr['author'] ? html($tmp_arr['author']) : '匿名';
            $tmp_arr1['time'] = date('Y-m-d H:i:s', $tmp_arr['post_time']);
            $tmp_arr1['time_r'] = date('Y-m-d H:i', $tmp_arr['post_time']);
            $tmp_arr1['con'] = html($tmp_arr['content']);
            $tmp_arr1['com_count'] = $tmp_arr['comment_count'];
            $tmp_arr1['good'] = $tmp_arr['good'];

            $class_names = C('class_names');

            $tmp_arr1['color'] = $class_names[$tmp_arr['class_id']][1];
            $tmp_arr1['class_name'] = $class_names[$tmp_arr['class_id']][0];
 
            $data['status'] = 1;
            $data['info'] = $id;
            $data['data'] = $tmp_arr1;
        }elseif($tmp_arr === null){
            $data['status'] = -2;
            $data['info'] = 'ID 错误！';
            $data['size'] = 0;
        }else{
            $data['status'] = -1;
            $data['info'] = '系统繁忙！';
        }

        $this->ajaxReturn($data, 'JSON');
    }
}