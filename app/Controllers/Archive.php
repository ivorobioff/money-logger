<?php
class Controllers_Archive extends Libs_Controllers_Page
{
	public function index()
	{
		$model = new Models_Archive();
		$view = new Libs_Views('/archive/index.phtml');

		$budget = '-';
		$expenses = '-';
		$remainder = '-';
		$categories_item = array();

		if ($archive_id = intval(always_set($_GET, 'archive_id', 0)))
		{
			if ($archive = $model->getById($archive_id))
			{
				$budget_item = $archive->getBudget();
				$categories_item = $archive->getCategories();

				$budget = $budget_item['budget'];
				$expenses = $budget_item['expenses'];
				$remainder = $budget_item['remainder'];
			}
			else
			{
				$archive_id = 0;
			}
		}

		$view
			->assign('archive_id', $archive_id)
			->assign('budget', $budget)
			->assign('expenses', $expenses)
			->assign('remainder', $remainder)
			->assign('categories', $categories_item)
			->assign('archive_dates', $model->getDates());

		$this->render($view);
	}
}
