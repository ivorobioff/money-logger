<?php
class Libs_Exceptions_Error404 extends Libs_Exceptions
{
	public function __construct()
	{
		parent::__construct('error_404');
	}
};