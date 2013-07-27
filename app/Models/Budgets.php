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
}