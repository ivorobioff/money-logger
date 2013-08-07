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
			->assign('total', $this->_total)
			->assign('page', $this->_page)
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

	public function getTotal()
	{
		return $this->_total;
	}
}