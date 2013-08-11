<?php
class Libs_Config
{
	static public function getCustom($var, $default = null)
	{
		require APP_DIR.'/config/custom.php';

		if (isset(${$var}))
		{
			return ${$var};
		}

		return $default;
	}

	static public function isProduction()
	{
		return static::getCustom('is_production');
	}
}