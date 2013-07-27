<?php
class Controllers_Planner extends Libs_Controllers_Page
{
	public function index()
	{
		$group_model = new Models_Groups();
		$categories_model = new Models_Categories();
		$user_id = Models_CurrentUser::getInstance()->id;

		$view = Libs_Views::create('/planner/index.phtml')
			->assign('groups', $group_model->getGroupsByUserId($user_id))
			->assign('categories', $categories_model->getCategoriesByUserId($user_id));

		$this->render($view);
	}
}
