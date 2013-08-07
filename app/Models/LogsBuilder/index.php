<?php
class Models_LogsBuilder
{
	private $_cache_total;
	private $_cache_data;
	private $_cache_paginator;

	private $_params;

	public function __construct(array $params)
	{
		$this->_params = $params;
	}

	/**
	 * @return Models_LogsBuilder_Iterator
	 */
	public function createLogsIterator()
	{
		return new Models_LogsBuilder_Iterator($this->_getData());
	}

	/**
	 * @return Libs_Paginator
	 */
	public function getPaginator()
	{
		if (is_null($this->_cache_paginator))
		{
			$this->_cache_paginator = new Libs_Paginator($this->_getTotal());
		}

		return $this->_cache_paginator;
	}

	/**
	 * @return Db
	 */
	private function _buildQuery()
	{
		return Db_Logs::create();
	}

	/**
	 * @return int
	 */
	private function _getTotal()
	{
		if (is_null($this->_cache_total))
		{
			$this->_cache_total = $this->_buildQuery()
				->select('COUNT(*) as total')
				->where('user_id', user_id())
				->createResultFormat()
				->getValue('total', 0);
		}

		return $this->_cache_total;
	}

	/**
	 * @return array
	 */
	private function _getData()
	{
		if (is_null($this->_cache_data))
		{
			$this->_cache_data = $this->_buildQuery()
				->where('user_id', user_id())
				->orderBy('id', 'DESC')
				->limit($this->getPaginator()->getOffset(), $this->getPaginator()->getLimit())
				->fetchAll();
		}

		return $this->_cache_data;
	}
}