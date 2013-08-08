<?php
class Models_Archive
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Archives();
	}

	public function save(array $data)
	{
		$data['user_id'] = user_id();
		$data['insert_date'] = date('Y-m-d H:i:s');

		$this->_table->insert($data);
	}
}