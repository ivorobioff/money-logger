<?php
abstract class Libs_Controllers_Page extends Libs_Controllers
{
	/**
	 * @var Libs_Views
	 */
	protected $_layout;
	protected $_title = 'MoneyLogger 1.0';

	public function __construct()
	{
		parent::__construct();

		if (!$this->_checkAuth())
		{
			redirect('/Auth/');
		}

		$this->_layout = Libs_Views::create('layout.phtml');
	}

	protected function render(Libs_Views $view)
	{
		$budget = new Models_Budgets();

		$this->_layout
			->assign('view', $view)
			->assign('title', $this->_title)
			->assign('budget_summary', $budget->getSummary())
			->assign('year', date('Y'))
			->render();
	}
}
