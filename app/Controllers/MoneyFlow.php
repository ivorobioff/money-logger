<?php
class Controllers_MoneyFlow extends Libs_Controllers_Page
{
	public function index()
	{
		$view = Libs_Views::create('/moneyflow/index.phtml');
		$this->render($view);
	}
}
