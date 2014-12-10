<?php
class CommentModel extends Model{
    protected $_validate = array(
        array('content', 'require', '请输入发布内容！'),
        array('eid', 'require', '系统繁忙！', 'in'),
    );

    public function addContent(){        
        $data['author'] = trim($_POST['comment_nick']);
        $data['content'] = trim($_POST['comment_content']);
        $data['eid'] = (int)$_POST['comment_id'];
        $data['time'] = time();

        $result = $this->create($data);

        if($result){
            if($this->add() !== false){
                $c_c = D('Content');
                $c_c->addCommentCount($data['eid']);

                $ajax['status'] = 1;
                $ajax['eid'] = $data['eid'];
                $ajax['info'] = '发布成功！';
            }else{
                $ajax['status'] = -3;
                $ajax['eid'] = $data['eid'];
                $ajax['info'] = '内部错误！';
            }
        }else{
            $ajax['status'] = -1;
            $ajax['eid'] = $data['eid'];
            $ajax['info'] = $this->getError();
        }


        return $ajax;
    }

    public function getContent($eid = 0, $start = 0, $limit = 50){
        $eid = (int)$eid;
        $start = (int)$start;
        $limit = (int)$limit;

        $limit = ($limit < 500) ? $limit : 500;
        if($eid){
            $result =  $this->where("eid={$eid}")->order('time desc')->limit($start, $limit)->select();
        }else{
            $result = $this->order('time desc')->limit($start, $limit)->select();
        }
        return $result;
    }

    public function getCommentCount($eid){
        $eid = (int)$eid;
        if($eid){
            $result =  $this->where("eid={$eid}")->count();
        }else{
            $result = $this->count();
        }
        return (int)$result;
    }

}