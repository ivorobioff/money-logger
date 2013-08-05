<?php
class Controllers_MoneyFlowProcessor extends Libs_Controllers_Processor
{
	public function withdrawal()
	{
		if ($fail = $this->_hasFail())
		{
			return $this->ajaxError($fail);
		}

		$amount = floatval($_POST['amount']);
		$id = $_POST['id'];

		$model = new Models_Categories();
		$budget = new Models_Budgets();

		if ($request_amount = always_set($_POST, 'request_amount'))
		{
			$model->requestAmount($id, $request_amount);
		}

		$current_amount = $model->getCurrentAmount($id);

		if ($current_amount < $amount)
		{
			$post_back = $_POST;
			$post_back['request_amount'] =  $amount - $current_amount;
			return $this->ajaxError(array('post_back' => $post_back));
		}

		$model->withdrawal($id, $amount);
		$budget->addRealExpenses($amount);

		return $this->ajaxSuccess(array('model' => $model->getById($id), 'budget' => $budget->getSummary()));
	}

	public function refund()
	{
		if ($fail = $this->_hasFail())
		{
			return $this->ajaxError($fail);
		}

		$amount = floatval($_POST['amount']);
		$id = $_POST['id'];

		$model = new Models_Categories();
		$budget = new Models_Budgets();

		$category = $model->getById($id);

		if ($category['current_amount'] + $amount > $category['amount'])
		{
			return $this->ajaxError(array('amount' => _t('/money_flow/validator/refund_too_big')));
		}

		$model->refund($id, $amount);
		$budget->subtractRealExpenses($amount);

		return $this->ajaxSuccess(array('model' => $model->getById($id), 'budget' => $budget->getSummary()));
	}

	public function returnRemainder()
	{
		$id = $_POST['id'];

		$model = new Models_Categories();
		$category = $model->getById($id);

		if ($category['current_amount'] < 0.01)
		{
			return $this->ajaxError(array('error' => _t('/money_flow/validator/remainder_zero')));
		}

		if ($category['current_amount'] == $category['amount'])
		{
			return $this->ajaxError(array('error' => _t('/money_flow/validator/is_sync')));
		}

		$model->returnRemainder($id, $category['current_amount']);

		$budget = new Models_Budgets();

		return $this->ajaxSuccess(array('model' => $model->getById($id), 'budget' => $budget->getSummary()));
	}

	private function _hasFail()
	{
		if (!isset($_POST['amount']))
		{
			return array('amount' => _t('/money_flow/validator/missing_field'));
		}

		if (floatval($_POST['amount']) < 0.01)
		{
			return array('amount' => _t('/money_flow/validator/wrong_amount'));
		}

		return false;
	}
}