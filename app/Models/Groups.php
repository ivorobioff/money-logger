<?php
class Models_Groups
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Groups();
	}

	public function addDefault($user_id)
	{
		$data = array(
			'user_id' => $user_id,
			'name' => 'Default',
			'is_default' => 1
		);

		$this->_table->insert($data);
	}

	public function getGroupsByUserId($user_id)
	{
		return $this->_table
			->where('user_id', $user_id)
			->fetchAll();
	}

	public function add(array $data)
	{
		$data = array(
			'user_id' => Models_CurrentUser::getInstance()->id,
			'name' => $data['name'],
			'is_default' => 0
		);

		return $this->_table->insert($data);
	}

	public function edit(array $data)
	{
		return $this->_table
			->where('id', $data['id'])
			->where('user_id', Models_CurrentUser::getInstance()->id)
			->update('name', $data['name']);
	}

	public function delete($id)
	{
		$this->_table
			->where('id', $id)
			->where('user_id', Models_CurrentUser::getInstance()->id)
			->delete();
	}

	public function getById($id)
	{
		return $this->_table->where('id', $id)->fetchOne();
	}

	public function hasCategories($group_id)
	{
		return Db_Categories::create()
			->where('group_id', $group_id)
			->check();
	}
}
