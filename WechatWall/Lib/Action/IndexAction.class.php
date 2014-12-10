<?php
class IndexAction extends Action {
    public function index(){
        $class_names = C('class_names');
        $this->assign('class_names', $class_names);
        $this->assign('class_name_width', 80 / count($class_names));
        unset($class_names[0]);
        $this->assign('class_options', $class_names);

        $this->assign('html_title', C('html_title'));
        $this->assign('site_name', C('site_name'));
        $this->assign('copy_str', C('copy_str'));
        $this->assign('share_title', C('html_title').'-表白·吐槽·心愿');
        $this->assign('share_content', '快来看看有没有人向你表白！');
        $this->assign('data_url', U('Data/getContent'));
        $this->assign('post_url', U('Data/postContent'));
        $this->assign('comment_url', U('Data/postComment'));
        $this->assign('comment_data_url', U('Data/getComment'));
        $this->assign('one_url', U('Data/getOne'));

        $this->display();
    }

    public function test(){
        $test = D('Comment');
        $test->getCommentCount(12);
    }
}