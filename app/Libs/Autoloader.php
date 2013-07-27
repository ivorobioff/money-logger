<?php
class Libs_Autoloader
{
	private $_reserved_prefixes = array('Libs', 'Controllers', 'Models', 'Db', 'Tests');

	public function parse($class)
	{
		$vendor = '/vendor/';
		$prefix = $this->_getClassPrefix($class);
		if (in_array($prefix, $this->_reserved_prefixes)) $vendor = '/';

		$file = APP_DIR.$vendor.str_replace('_', '/', $class.'.php');

		if (!file_exists($file))
		{
			$file = rtrim($file, '.php').'/index.php';
		}

		if (file_exists($file))
		{
			require_once  $file;
		}
	}

	private function _getClassPrefix($class)
	{
		$class_array = explode('_', $class);
		return $class_array[0];
	}
}