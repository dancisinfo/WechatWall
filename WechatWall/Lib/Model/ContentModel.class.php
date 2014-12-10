<?php
class ContentModel extends Model{
    protected $_validate = array(
        array('content', 'require', '请输入发布内容！'),
        array('class_id', array(), '栏目不正确！', 0, 'in'),
        array('class_id', '1,10', '栏目不正确！', 0, 'between')
    );

    public function addContent(){
        $this->_validate[1][1] = array_keys(C('class_names'));

        $data['author'] = trim($_POST['post_nick']);
        $data['content'] = trim($_POST['post_content']);
        $data['class_id'] = (int)$_POST['post_class'];
        $data['post_time'] = time();
        $data['comment_time'] = time();

        $result = $this->create($data);

        if($result){
            if($this->add() !== false){
                $ajax['status'] = 1;
                $ajax['info'] = '发布成功！';
            }else{
                $ajax['status'] = -3;
                $ajax['info'] = '内部错误！';                
            }
        }else{
            $ajax['status'] = -1;
            $ajax['info'] = $this->getError();
        }

        return $ajax;
    }

    public function getContent($class_id = 0, $start = 0, $limit = 50){
        $class_id = (int)$class_id;
        $start = (int)$start;
        $limit = (int)$limit;

        $limit = ($limit < 500) ? $limit : 500;
        if($class_id){
            $result =  $this->where("class_id={$class_id}")->order('weight desc,comment_time desc,id desc')->limit($start, $limit)->select();
        }else{
            $result = $this->order('weight desc,comment_time desc,id desc')->limit($start, $limit)->select();
        }
        return $result;
    }

    public function addCommentCount($id, $num = 1){
        $this->find((int)$id);
        $this->comment_count = $this->comment_count + (int)$num;
        $this->comment_time = time();
        $this->save();
        return $this->comment_count;
    }

    public function getOne($id){
        if($id){
            return $this->find((int)$id);
        }else{
            return false;
        }
    }
}