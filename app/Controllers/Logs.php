<?php
class Controllers_Logs extends Libs_Controllers_Page
{
	public function index()
	{
		$view = Libs_Views::create('/logs/index.phtml');
		$this->render($view);
	}
}
