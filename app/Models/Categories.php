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
			->fetchAll();
	}

	public function add(array $data)
	{
		$data = array(
			'title' => $data['title'],
			'amount' => round($data['amount'], 2),
			'current_amount' => $data['amount'],
			'group_id' => $data['group'],
			'user_id' => Models_CurrentUser::getInstance()->id,
			'pin' => isset($data['pin']) ? 1 : 0,
		);
		return $this->_table->insert($data);
	}

	public function getById($id)
	{
		return $this->_table->fetchOne('id', $id);
	}
}