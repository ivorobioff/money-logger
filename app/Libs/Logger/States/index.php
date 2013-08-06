<?php
abstract class Libs_Logger_States
{
	protected $_data = array();

	abstract public function fix();

	public function toArray()
	{
		return $this->_data;
	}
}