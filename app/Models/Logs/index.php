<?php
class Models_Logs
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Logs();
	}

	/**
	 * @return Models_Logs_Iterator
	 */
	public function getAll()
	{
		$data = $this->_table
			->where('user_id', user_id())
			->orderBy('id', 'DESC')
			->fetchAll();

		return new Models_Logs_Iterator($data);
	}
}