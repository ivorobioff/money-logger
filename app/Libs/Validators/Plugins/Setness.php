<?php
class Libs_Validators_Plugins_Setness extends Libs_Validators_Plugins
{
	private $_required_fields;

	private $_fields;

	public function setRequiredFields(array $fields)
	{
		$this->_required_fields = $fields;
		return $this;
	}

	public function setFields(array $fields)
	{
		$this->_fields = $fields;
		return $this;
	}

	public function check()
	{
		if (!$this->_required_fields) return true;

		foreach ($this->_required_fields as $item)
		{
			if ($this->_isEmpty($item)) return false;
		}

		return true;
	}

	public function getMissingFields()
	{
		$fields = array();

		if (!$this->_required_fields) return array();

		foreach ($this->_required_fields as $item)
		{
			if ($this->_isEmpty($item)) $fields[] = $item;
		}

		return $fields;
	}

	private function _isEmpty($item)
	{
		$item = trim($this->_fields[$item]);
		return empty($item);
	}
}