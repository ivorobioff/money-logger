<?php
class Models_Groups
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Groups();
	}

	public function addDefault($user_id)
	{
		$data = array(
			'user_id' => $user_id,
			'name' => 'Default'
		);

		$this->_table->insert($data);
	}

	public function getGroupsByUserId($user_id)
	{
		return $this->_table
			->where('user_id', $user_id)
			->createResultFormat()
			->getHash();
	}
}
