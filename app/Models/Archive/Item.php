<?php
/**
 * @author Igor Vorobioff<igor.vorobioff@gmail.com>
 */
class Models_Archive_Item
{
	private $_data;

	public function __construct(array $data)
	{
		$this->_data = $data;
	}

	public function getBudget()
	{
		return json_decode($this->_data['budget'], true);
	}

	public function getCategories()
	{
		return json_decode($this->_data['categories'], true);
	}
}