<?php
class Libs_Validators_Plugins_Password extends Libs_Validators_Plugins
{
	private $_pass;
	private $_confirm_pass;

	private $_pass_length = 4;

	public function checkLength()
	{
		return strlen($this->_pass) >= $this->_pass_length;
	}

	public function checkIfEqual()
	{
		return $this->_pass == $this->_confirm_pass;
	}

	public function setPass($pass)
	{
		$this->_pass = $pass;
		return $this;
	}

	public function setConfirmPass($pass)
	{
		$this->_confirm_pass = $pass;
		return $this;
	}
}