<?php
abstract class Db extends Libs_ActiveRecord
{
	protected function _getConfig()
	{
		return Libs_Config::getCustom('db_config');
	}
}