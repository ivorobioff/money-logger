<?php
class Controllers_Planner extends Libs_Controllers_Page
{
	public function index()
	{
		$view = Libs_Views::create('/planner/index.phtml');
		$this->render($view);
	}
}
