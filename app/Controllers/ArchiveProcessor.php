<?php
class Controllers_ArchiveProcessor extends Libs_Controllers_Processor
{
	public function closeMonth()
	{
		$categories = new Models_Categories();

		if ($categories->hasRemainders())
		{
			return $this->ajaxError(array(_t('/archive/validator/has_remainders')));
		}

		$event = new Models_Archive_Event();

		$event
			->add(new Models_Budgets())
			->add(new Models_Categories())
			->add(new Models_Groups())
			->add(new Models_Logs())
			->closeMonth();

		$this->ajaxSuccess();
	}
}