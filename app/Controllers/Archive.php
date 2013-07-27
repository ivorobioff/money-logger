<?php
class Controllers_Archive extends Libs_Controllers_Page
{
	public function index()
	{
		$view = Libs_Views::create('/archive/index.phtml');
		$this->render($view);
	}
}
