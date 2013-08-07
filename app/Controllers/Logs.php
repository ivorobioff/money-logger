<?php
class Controllers_Logs extends Libs_Controllers_Page
{
	public function index()
	{
		$builder = new Models_LogsBuilder($_GET);

		$view = Libs_Views::create('/logs/index.phtml')
			->assign('logs', $builder->createLogsIterator())
			->assign('paginator', $builder->getPaginator())
			->assign('filter', $builder->getFilterParams());

		$this->render($view);
	}
}
