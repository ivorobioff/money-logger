<?php
class Models_Categories
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Categories();
	}

	public function getCategoriesByUserId($user_id)
	{
		return $this->_table
			->where('user_id', $user_id)
			->createResultFormat()
			->groupItemsBy('group_id');
	}
}