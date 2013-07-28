<?php
class Controllers_FrontI18n
{
	public function index()
	{
		Libs_Views::create('front_i18n.phtml')->render();
	}
}