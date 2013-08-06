<?php
class Controllers_BudgetProcessor extends Libs_Controllers_Processor
{
	public function deposit()
	{
		$logger = new Libs_Logger();

		$amount = floatval($_POST['amount']);

		if ($amount < 0.01)
		{
			return $this->ajaxError(array(_t('/budget/validator/small_amount')));
		}

		$model = new Models_Budgets();

		$logger->fixBefore();

		$model->deposit($amount);

		$logger
			->fixAfter()
			->setAction(Libs_Logger::AC_BUDGET_DEPOSIT)
			->setAmount($amount)
			->save();

		$this->ajaxSuccess($model->getSummary());
	}

	public function withdrawal()
	{
		$logger = new Libs_Logger();

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

		$logger->fixBefore();

		$model->withdrawal($amount);

		$logger
			->fixAfter()
			->setAction(Libs_Logger::AC_BUDGET_WITHDRAWAL)
			->setAmount($amount)
			->save();

		$this->ajaxSuccess($model->getSummary());
	}
}