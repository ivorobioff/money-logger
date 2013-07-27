<?php
class Libs_Validators_Plugins_Email extends Libs_Validators_Plugins
{
	private $_email;

	public function setEmail($email)
	{
		$this->_email = $email;
		return $this;
	}

	public function verify()
	{
		return preg_match('/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/', $this->_email);
	}
}