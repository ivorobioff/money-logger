<?php
class Models_CurrentUser extends Libs_Singleton
{
	/**
	 * @return Models_CurrentUser
	 */
	static public function getInstance()
	{
		return parent::getInstance();
	}

	public function isAuth()
	{
		return isset($_SESSION[$this->_getSessionNamespace()]['id']);
	}

	public function login($data, $remember_me = false)
	{
		if ($remember_me)
		{
			$domain = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : null;
			setcookie('remember_me', md5($data['id']), time() + (86400 * 31), '/', $domain);
		}

		$_SESSION[$this->_getSessionNamespace()] = $data;
	}

	public function logout()
	{
		unset($_SESSION[$this->_getSessionNamespace()]);

		$domain = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : null;
		setcookie('remember_me', '', time()-3600, '/', $domain);
	}

	public function __get($key)
	{
		return $_SESSION[$this->_getSessionNamespace()][$key];
	}

	/**
	 * Когда будет админка надо будет доработать,
	 * чтобы пользователь брался в зависимости от внешней среды.
	 * @return string
	 */
	private function _getSessionNamespace()
	{
		return 'user_data';
	}
}