<?php
class Models_Archive_Event
{
	private $_models = array();

	public function add(Models_Archive_Archivable $model)
	{
		$this->_models[] = $model;
		return $this;
	}

	public function closeMonth()
	{
		foreach ($this->_models as $model)
		{
			$model->onCloseMonth();
		}
	}
}