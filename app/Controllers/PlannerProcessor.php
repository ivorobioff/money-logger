<?php
class Controllers_PlannerProcessor extends Libs_Controllers_Processor
{
	public function addCategory()
	{
		$logger = new Libs_Logger();

		if ($errors = $this->_getCategoryValidationErrors())
		{
			return $this->ajaxError($errors);
		}

		$model = new Models_Categories();

		$logger->fixBefore();

		$data = $_POST;
		$data['amount'] = round($data['amount'], 2);

		$id = $model->add($data);

		$category = $model->getById($id);

		$logger
			->fixAfter($id)
			->setAmount($data['amount'])
			->setAction(Libs_Logger::AC_CREATE_CATEGORY)
			->setTitle($category['title'])
			->save();

		$budget = new Models_Budgets();
		return $this->ajaxSuccess(array('model' => $category, 'budget' => $budget->getSummary()));
	}

	public function editCategory()
	{
		$logger = new Libs_Logger();

		if ($errors = $this->_getCategoryValidationErrors())
		{
			return $this->ajaxError($errors);
		}

		$data = $_POST;
		$data['amount'] = round($data['amount'], 2);

		$model = new Models_Categories();
		$category = $model->getById($data['id']);

		$changed_amount = $data['amount'] - $category['amount'];

		if ($category['amount'] == $category['current_amount'])
		{
			$data['current_amount'] = $data['amount'];
		}
		else
		{
			$diff_amount = $data['amount'] - $category['amount'];
			$data['current_amount'] = $category['current_amount'] + $diff_amount;

			if ($data['current_amount'] < 0)
			{
				return $this->ajaxError(array('amount' => _t('/planner/validator/amount_too_small')));
			}
		}

		if ($changed_amount != 0)
		{
			$logger->fixBefore($data['id']);

		}

		$model->edit($data);

		if ($changed_amount != 0)
		{
			$logger
				->fixAfter($data['id'])
				->setAmount(abs($changed_amount))
				->setAction($changed_amount > 0 ? Libs_Logger::AC_ADD_AMOUNT : Libs_Logger::AC_SUBTRACT_AMOUNT)
				->setTitle($category['title'])
				->save();
		}

		$budget = new Models_Budgets();
		return $this->ajaxSuccess(array('model' => $model->getById($data['id']), 'budget' => $budget->getSummary()));
	}

	public function deleteCategory()
	{
		$logger = new Libs_Logger();

		$id = $_POST['id'];

		$model = new Models_Categories();

		if (!$model->isSync($id))
		{
			return $this->ajaxError(array(_t('/planner/validator/not_sync')));
		}

		$category = $model->getById($id);

		$logger->fixBefore($id);

		$model->delete($id);

		$logger->fixAfter()
			->setAction(Libs_Logger::AC_DELETE_CATEGORY)
			->setAmount($category['amount'])
			->setTitle($category['title'])
			->save();

		$budget = new Models_Budgets();

		return $this->ajaxSuccess(array('id' => $id, 'budget' => $budget->getSummary()));
	}

	private function _getCategoryValidationErrors()
	{
		if ($missing_fields = Libs_Validators::getSetnessValidator()
				->setRequiredFields(array('title', 'group', 'amount'))
				->setFields($_POST)
				->getMissingFields())
		{
			$errors = array();

			foreach ($missing_fields as $item)
			{
				$errors[$item] = _t('/planner/validator/missing_field');
			}

			return $errors;
		}

		if (floatval($_POST['amount']) < 0.01)
		{
			 return array('amount' => _t('/planner/validator/wrong_amount'));
		}
	}

	public function addGroup()
	{
		if (trim(always_set($_POST, 'name', '')) == '')
		{
			return $this->ajaxError(array('name' => _t('/planner/validator/missing_field')));
		}

		$model = new Models_Groups();

		$id = $model->add($_POST);
		return $this->ajaxSuccess($model->getById($id));
	}

	public function editGroup()
	{
		if (trim(always_set($_POST, 'name', '')) == '')
		{
			return $this->ajaxError(array('name' => _t('/planner/validator/missing_field')));
		}

		$model = new Models_Groups();

		$id = $model->edit($_POST);
		return $this->ajaxSuccess($model->getById($_POST['id']));
	}

	public function deleteGroup()
	{
		$model = new Models_Groups();

		$id = $_POST['id'];

		if ($model->oneLeft())
		{
			return $this->ajaxError(array(_t('/planner/validator/group_one_left')));
		}

		if ($model->hasCategories($id))
		{
			return $this->ajaxError(array(_t('/planner/validator/group_not_empty')));
		}

		$model->delete($id);
		return $this->ajaxSuccess(array('id' => $id));
	}
}