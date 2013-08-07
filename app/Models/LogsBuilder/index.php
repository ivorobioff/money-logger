<?php
class Models_LogsBuilder
{
	private $_cache_total;
	private $_cache_data;
	private $_cache_paginator;

	private $_params;

	private $_page;

	public function __construct(array $params)
	{
		$this->_params = $this->_prepareFilterParams($params);
		$this->_page = always_set($params, 'page', 1);
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
			$this->_cache_paginator = new Libs_Paginator($this->_getTotal(), $this->_page);
		}

		return $this->_cache_paginator;
	}

	public function getFilterParams()
	{
		return $this->_params;
	}

	private function _prepareFilterParams(array $data)
	{
		if ($from = always_set($data, 'from', ''))
		{
			$from = Libs_Validators::getDateFormatValidator()
				->setDate($from)
				->setFormat('Y-m-d')
				->check() ? $from : '';
		}

		if ($to = always_set($data, 'to', ''))
		{
			$to = Libs_Validators::getDateFormatValidator()
				->setDate($to)
				->setFormat('Y-m-d')
				->check() ? $to : '';
		}

		return array(
			'from' => $from,
			'to' => $to,
			'keyword' => always_set($data, 'keyword', '')
		);
	}

	/**
	 * @return Db
	 */
	private function _buildQuery()
	{
		$table = new Db_Logs();

		if ($this->_params['from'])
		{
			$table->where('insert_date >= ', $this->_params['from']);
		}

		if ($this->_params['to'])
		{
			$table->where('insert_date <= ', $this->_params['to']);
		}

		if ($this->_params['keyword'])
		{
			$table->match('title', $this->_params['keyword']);
		}

		return $table;
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