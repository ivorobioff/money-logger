<?php
class Models_Logger
{
	private $_action_type;
	private $_item_id;

	public function __construct($action_type, $item_id = null)
	{
		$this->_action_type = $action_type;
		$this->_item_id = $item_id;
	}

	public function fixBefore()
	{

	}

	public function fixAfter()
	{

	}

	public function save()
	{

	}
}