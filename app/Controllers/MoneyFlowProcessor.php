<?php
class Controllers_MoneyFlowProcessor extends Libs_Controllers_Processor
{
	public function withdrawal()
	{
		$logger = new Libs_Logger();

		if ($fail = $this->_hasFail())
		{
			return $this->ajaxError($fail);
		}

		$amount = floatval($_POST['amount']);
		$id = $_POST['id'];

		$model = new Models_Categories();
		$category = $model->getById($id);

		$budget = new Models_Budgets();

		if ($request_amount = always_set($_POST, 'request_amount'))
		{
			$logger_request = new Libs_Logger();

			$logger_request->fixBefore($id);

			$model->requestAmount($id, $request_amount);

			$logger->fixAfter($id)
				->setAmount($request_amount)
				->setAction(Libs_Logger::AC_REQUEST_AMOUNT)
				->setTitle($category['title'])
				->save();
		}

		if ($category['current_amount'] < $amount)
		{
			$post_back = $_POST;
			$post_back['request_amount'] =  $amount - $category['current_amount'];
			return $this->ajaxError(array('post_back' => $post_back));
		}

		$logger->fixBefore($id);

		$model->withdrawal($id, $amount);
		$budget->addRealExpenses($amount);

		$logger->fixAfter($id)
			->setAmount($amount)
			->setAction(Libs_Logger::AC_CATEGORY_WITHDRAWAL)
			->setTitle($category['title'])
			->setComment(always_set($_POST, 'comment', ''))
			->save();

		return $this->ajaxSuccess(array('model' => $model->getById($id), 'budget' => $budget->getSummary()));
	}

	public function refund()
	{
		$logger = new Libs_Logger();

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

		$logger->fixBefore($id);

		$model->refund($id, $amount);
		$budget->subtractRealExpenses($amount);

		$logger
			->fixAfter($id)
			->setAction(Libs_Logger::AC_CATEGORY_REFUND)
			->setAmount($amount)
			->setTitle($category['title'])
			->setComment(always_set($_POST, 'comment', ''))
			->save();

		return $this->ajaxSuccess(array('model' => $model->getById($id), 'budget' => $budget->getSummary()));
	}

	public function returnRemainder()
	{
		$logger = new Libs_Logger();

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

		$logger->fixBefore($id);

		$model->returnRemainder($id, $category['current_amount']);

		$logger
			->fixAfter($id)
			->setAction(Libs_Logger::AC_RETURN_REMAINDER)
			->setAmount($category['current_amount'])
			->setTitle($category['title'])
			->save();

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