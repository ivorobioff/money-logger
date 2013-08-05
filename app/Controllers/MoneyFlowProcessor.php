<?php
class Controllers_MoneyFlowProcessor extends Libs_Controllers_Processor
{
	public function withdrawal()
	{
		if (!isset($_POST['amount']))
		{
			return $this->ajaxError(array('amount' => _t('/money_flow/validator/missing_field')));
		}

		$amount = floatval($_POST['amount']);
		$id = $_POST['id'];

		if ($amount < 0.01)
		{
			return $this->ajaxError(array('amount' => _t('/money_flow/validator/missing_field')));
		}

		$model = new Models_Categories();
		$budget = new Models_Budgets();

		$current_amount = $model->getCurrentAmount($id);

		if ($current_amount < $amount)
		{
			return $this->ajaxError(array('need_amount' => $amount - $current_amount));
		}

		$model->withdrawal($id, $amount);
		$budget->addRealExpenses($amount);

		return $this->ajaxSuccess(array('model' => $model->getById($id), 'budget' => $budget->getSummary()));
	}
}