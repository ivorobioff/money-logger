<?php
class Libs_Logger_States_Category extends Libs_Logger_States
{
	private $_id;

	public function __construct($id)
	{
		$this->_id = $id;
	}

	public function fix()
	{
		$model = new Models_Categories();
		$this->_data = $model->getById($this->_id);
	}
}