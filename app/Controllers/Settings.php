<?php
class Controllers_Settings extends Libs_Controllers_Page
{
	public function index()
	{
		$view = Libs_Views::create('/settings/index.phtml');
		$this->render($view);
	}
}
