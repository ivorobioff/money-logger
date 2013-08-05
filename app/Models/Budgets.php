<?php
class Models_Budgets
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Budgets();
	}

	public function addDefault($user_id)
	{
		$data = array(
			'user_id' => $user_id,
			'income' => 0,
			'real_expenses' => 0
		);

		$this->_table->insert($data);
	}

	public function get()
	{
		return $this->_table
			->where('user_id', user_id())
			->fetchOne();
	}

	public function getSummary()
	{
		$budget = $this->get();

		$total_planned = Db_Categories::create()
			->select('SUM(amount) AS total')
			->where('user_id', user_id())
			->createResultFormat()
			->getValue('total', 0);

		return array(
			'budget' => Libs_Utils::toMomey(($budget['income'] - $budget['real_expenses'])),
			'expenses' => Libs_Utils::toMomey(($total_planned)),
			'remainder' => Libs_Utils::toMomey(($budget['income'] - $total_planned))
		);
	}

	public function deposit($amount)
	{
		$this->_table
			->where('user_id', user_id())
			->update('income = income +', $amount);
	}

	public function withdrawal($amount)
	{
		$this->_table
		->where('user_id', user_id())
		->update('income = income -', $amount);
	}

	public function hasEnoughMoney($amount)
	{
		return $this->_table
			->where('user_id', user_id())
			->where('income >=', $amount)
			->check();
	}

	public function addRealExpenses($amount)
	{
		$this->_table
			->where('user_id', user_id())
			->update('real_expenses = real_expenses + ', $amount);
	}
}