<?php
class Controllers_MoneyFlow extends Libs_Controllers_Page
{
	public function index()
	{
		$view = Libs_Views::create('/default/index.phtml')
			->assign('fio', Models_CurrentUser::getInstance()->fio);

		$this->render($view);
	}
}
