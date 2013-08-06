<?php
class Controllers_Logs extends Libs_Controllers_Page
{
	public function index()
	{
		$model = new Models_Logs();

		$view = Libs_Views::create('/logs/index.phtml')
			->assign('logs', $model->getAll());

		$this->render($view);
	}
}
