<?php
class Controllers_MoneyFlow extends Libs_Controllers_Page
{
	public function index()
	{
		$group_model = new Models_Groups();
		$categories_model = new Models_Categories();

		$view = Libs_Views::create('/moneyflow/index.phtml')
			->assign('groups', $group_model->getAll())
			->assign('categories', $categories_model->getAll());

		$this->render($view);
	}
}
