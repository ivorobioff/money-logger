<?php
class Models_Archive_Event
{
	private $_models = array();
	private $_data = array();

	public function add(Models_Archive_Archivable $model)
	{
		$this->_models[] = $model;
		return $this;
	}

	public function closeMonth()
	{
		foreach ($this->_models as $model)
		{
			if ($model instanceof Models_Archive_Savable)
			{
				$this->_data[$model->getArchiveAlias()] = json_encode($model->buildArchiveData());
			}

			if ($model instanceof Models_Archive_Resetable)
			{
				$model->reset();
			}
		}

		$archive = new Models_Archive();
		$archive->save($this->_data);
	}
}