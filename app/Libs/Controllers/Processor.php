<?php
abstract class Libs_Controllers_Processor extends Libs_Controllers
{
	protected $_require_ajax = true;
	protected $_ajax_exceptions = array();

	public function __construct()
	{
		parent::__construct();

		if (!$this->_checkAuth())
		{
			return ;
		}

		if (!$this->_checkAjax())
		{
			throw new Libs_Exceptions_Error404();
		}
	}

	protected function isAjax()
	{
		return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
			&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	}

	protected function ajaxSuccess(array $data = array())
	{
		echo json_encode(array('status' => 'success', 'data' => $data));
	}

	protected function ajaxError(array $data = array())
	{
		echo json_encode(array('status' => 'error', 'data' => $data));
	}

	private function _checkAjax()
	{
		$ajax_exceptions = $this->_ajax_exceptions;

		foreach ($ajax_exceptions as &$value)
		{
			$value = strtolower($value);
		}

		if ($this->_require_ajax)
		{
			if (!in_array(strtolower($_GET['action']), $ajax_exceptions) && !$this->isAjax())
			{
				return false;
			}
		}
		else
		{
			if (in_array(strtolower($_GET['action']), $ajax_exceptions) && !$this->isAjax())
			{
				return false;
			}

		}

		return true;
	}
}
