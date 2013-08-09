<?php
class Models_Categories implements Models_Archive_Interfaces_Resetable, Models_Archive_Interfaces_Savable
{
	private $_table;

	public function __construct()
	{
		$this->_table = new Db_Categories();
	}

	public function getAll()
	{
		return $this->_table
			->where('user_id', user_id())
			->orderBy('id', 'ASC')
			->fetchAll();
	}

	public function add(array $data)
	{
		$data = array(
			'title' => $data['title'],
			'amount' => $data['amount'],
			'current_amount' => $data['amount'],
			'group_id' => $data['group'],
			'user_id' => user_id(),
			'pin' => isset($data['pin']) ? 1 : 0,
		);
		return $this->_table->insert($data);
	}

	public function edit(array $data)
	{
		$id = $data['id'];

		unset($data['id']);
		$data = array(
			'title' => $data['title'],
			'amount' => $data['amount'],
			'current_amount' => $data['current_amount'],
			'group_id' => $data['group'],
			'pin' => isset($data['pin']) ? 1 : 0,
		);

		$this->_table
			->where('user_id', user_id())
			->where('id', $id)
			->update($data);
	}

	public function delete($id)
	{
		$this->_table
			->where('user_id', user_id())
			->where('id', $id)
			->delete();
	}

	public function getById($id)
	{
		return $this->_table->where('id', $id)->fetchOne();
	}

	public function isSync($id)
	{
		return $this->_table
			->whereQuery('amount=current_amount')
			->where('id', $id)
			->check();
	}

	public function withdrawal($id, $amount)
	{
		$this->_table
			->where('user_id', user_id())
			->where('id', $id)
			->update('current_amount = current_amount-', $amount);
	}

	public function requestAmount($id, $amount)
	{
		$this->_table
			->where('user_id', user_id())
			->where('id', $id)
			->update(array(
				'current_amount = current_amount +' => $amount,
				'amount = amount +' => $amount
			));
	}

	public function refund($id, $amount)
	{
		$this->_table
			->where('user_id', user_id())
			->where('id', $id)
			->update('current_amount = current_amount +', $amount);
	}

	public function returnRemainder($id, $amount)
	{
		$this->_table
			->where('user_id', user_id())
			->where('id', $id)
			->update(array(
				'current_amount' => 0,
				'amount = amount - ' => $amount
			));
	}

	public function getArchiveAlias()
	{
		return 'categories';
	}

	public function buildArchiveData()
	{
		return $this->getAll();
	}

	public function reset()
	{
		$this->_table
			->where('user_id', user_id())
			->where('pin', 0)
			->delete();

		$this->_table
			->where('user_id', user_id())
			->update('current_amount = amount');
	}

	public function hasRemainders()
	{
		return $this->_table
			->where('user_id', user_id())
			->where('current_amount >', 0)
			->check();
	}
}