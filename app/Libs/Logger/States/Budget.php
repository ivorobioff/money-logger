<?php
class Libs_Logger_States_Budget extends Libs_Logger_States
{
	public function fix()
	{
		$model = new Models_Budgets();
		$this->_data = $model->getSummary();
	}
}