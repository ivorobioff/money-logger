<?php
class Controllers_BudgetProcessor extends Libs_Controllers_Processor
{
	public function deposit()
	{
		$amount = floatval($_POST['amount']);

		if ($amount < 0.01)
		{
			return $this->ajaxError(array(_t('/budget/validator/small_amount')));
		}

		$model = new Models_Budgets();
		$model->deposit($amount);

		$this->ajaxSuccess($model->getSummary());
	}

	public function withdrawal()
	{
		if (!isset($_POST['amount']))
		{
			return $this->ajaxError(array(_t('/budget/validator/small_amount')));
		}

		$amount = floatval($_POST['amount']);

		if ($amount < 0.01)
		{
			return $this->ajaxError(array(_t('/budget/validator/small_amount')));
		}

		$model = new Models_Budgets();

		if (!$model->hasEnoughMoney($amount))
		{
			return $this->ajaxError(array(_t('/budget/validator/not_enough_money')));
		}

		$model->withdrawal($amount);

		$this->ajaxSuccess($model->getSummary());
	}
}