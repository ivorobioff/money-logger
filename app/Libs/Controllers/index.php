<?php
abstract class Libs_Controllers
{
	protected $_require_auth = true;
	protected $_auth_exceptions = array();

	public function __construct()
	{
		//
	}

	protected function _checkAuth()
	{
		$auth_exceptions = $this->_auth_exceptions;

		foreach ($auth_exceptions as &$value)
		{
			$value = strtolower($value);
		}

		if ($this->_require_auth)
		{
			if (!in_array(strtolower($_GET['action']), $auth_exceptions) && !is_auth())
			{
				return false;
			}
		}
		else
		{
			if (in_array(strtolower($_GET['action']), $auth_exceptions) && !is_auth())
			{
				return false;
			}
		}

		return true;
	}
}