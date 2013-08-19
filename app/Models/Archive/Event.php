<?php
/**
 * @author Igor Vorobioff<igor.vorobioff@gmail.com>
 */
class Models_Archive_Event
{
	private $_models = array();

	public function add(Models_Archive_Interfaces_Archivable $model)
	{
		$this->_models[] = $model;
		return $this;
	}

	public function closeMonth()
	{
		$this->_saveAll();
		$this->_resetAll();
	}

	private function _saveAll()
	{
		foreach ($this->_models as $model)
		{
			if ($model instanceof Models_Archive_Interfaces_Savable)
			{
				$data[$model->getArchiveAlias()] = json_encode($model->buildArchiveData());
			}
		}

		$archive = new Models_Archive();
		$archive->save($data);
	}

	private function _resetAll()
	{
		foreach ($this->_models as $model)
		{
			if ($model instanceof Models_Archive_Interfaces_Resetable)
			{
				$model->reset();
			}
		}
	}
}