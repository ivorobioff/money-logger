<?php
class Models_Auth
{
	/**
	 * @var Db
	 */
	private $_table;

	public function __construct()
	{
		$this->_table = Db_Users::create();
	}

	public function addUser($data)
	{
		$data = array(
			'email' => $data['email'],
			'pass' => md5($data['pass']),
			'fio' => $data['fio'],
			'active' => 1,
		);

		return $this->_table->insert($data);
	}

	public function getUserByCredentials($email, $password)
	{
		return $this->_table
			->where('pass', md5($password))
			->where('email', $email)
			->where('active', 1)
			->fetchOne();
	}

	public function checkEmail($email)
	{
		return $this->_table->where('email', $email)->check();
	}

	public function getUserByHashedId($id)
	{
		return $this->_table->where('MD5(id)', $id)->fetchOne();
	}

	public function getUserById($id)
	{
		return $this->_table
			->where('id', $id)
			->where('active', 1)
			->fetchOne();
	}
}