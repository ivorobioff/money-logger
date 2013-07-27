<?php
class Controllers_Error404 extends Libs_Controllers_Page
{
	protected $_require_auth = false;

	public function show()
	{
		echo 'error404';
	}
}