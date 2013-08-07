<?php
class Libs_Paginator
{
	/**
	 * @var Libs_Views
	 */
	private $_view;

	private $_total;
	private $_on_page;
	private $_page;

	private $_prefix = '?';

	public function __construct($total, $page = 1, $on_page = 10)
	{
		$this->_view = Libs_Views::create('/elements/paginator.phtml');
		$this->_total = $total;
		$this->_page = $page;
		$this->_on_page = $on_page;
	}

	public function render()
	{
		$this->_view
			->assign('total', $this->_calcTotalPages())
			->assign('page', $this->_page)
			->assign('prefix', $this->_prefix)
			->render();
	}

	public function getLimit()
	{
		return $this->_on_page;
	}

	public function getOffset()
	{
		return ($this->_page * $this->_on_page) - $this->_on_page;
	}

	private function _calcTotalPages()
	{
		if ($this->_total == 0) return 1;
		if ($this->_total <= $this->_on_page) return 1;

		return ceil($this->_total / $this->_on_page);
	}

	public function setLinkPrefix($prefix)
	{
		$this->_prefix = $prefix;
	}
}