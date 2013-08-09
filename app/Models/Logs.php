<?php
class Models_Logs implements Models_Archive_Interfaces_Resetable
{
	public function reset()
	{
		Db_Logs::create()->where('user_id', user_id())->delete();
	}
}