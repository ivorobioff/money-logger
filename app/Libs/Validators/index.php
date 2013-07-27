<?php
class Libs_Validators
{
	/**
	 * @return Libs_Validators_Plugins_Email
	 */
	static public function getEmailValidator()
	{
		return new Libs_Validators_Plugins_Email();
	}

	/**
	 * @return Libs_Validators_Plugins_Password
	 */
	static public function getPasswordValidator()
	{
		return new Libs_Validators_Plugins_Password();
	}

	/**
	 * @return Libs_Validators_Plugins_Setness
	 */
	static public function getSetnessValidator()
	{
		return new Libs_Validators_Plugins_Setness();
	}
}