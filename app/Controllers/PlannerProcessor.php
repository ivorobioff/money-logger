<?php
class Controllers_PlannerProcessor extends Libs_Controllers_Processor
{
	public function addCategory()
	{
		if ($errors = $this->_getCategoryValidationErrors())
		{
			return $this->ajaxError($errors);
		}

		$model = new Models_Categories();
		$id = $model->add($_POST);

		return $this->ajaxSuccess($model->getById($id));
	}

	public function editCategory()
	{
		if ($errors = $this->_getCategoryValidationErrors())
		{
			return $this->ajaxError($errors);
		}

		$model = new Models_Categories();
		$model->edit($_POST);

		return $this->ajaxSuccess($model->getById($_POST['id']));
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
}