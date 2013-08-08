<?php
class Controllers_ArchiveProcessor extends Libs_Controllers
{
	public function closeMonth()
	{
		$event = new Models_Archive_Event();

		$event
			->add(new Models_Budgets())
			->add(new Models_Categories())
			->add(new Models_Groups())
			->closeMonth();
	}
}