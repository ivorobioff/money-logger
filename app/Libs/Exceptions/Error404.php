<?php
class Libs_Exceptions_Error404 extends Libs_Exceptions
{
	/**
	 * @var Controllers_Error404
	 */
	private $_controller;

	public function __construct(Controllers_Error404 $controller)
	{
		parent::__construct('error_404');
		$this->_controller = $controller;
	}

	/**
	 * @return Controllers_Error404
	 */
	public function show()
	{
		return $this->_controller->show();
	}
};