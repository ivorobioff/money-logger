<?php
/**
 * Класс для логирование опираций и состояние бюджета/категории до и после совершонной операции.
 * @author Игорь Воробьев<vib@avantajprim.com>
 */
class Libs_Logger
{
	const AC_BUDGET_WITHDRAWAL = 'budget_withdrawal';
	const AC_BUDGET_DEPOSIT = 'budget_deposit';
	const AC_CATEGORY_WITHDRAWAL = 'category_withdrawal';
	const AC_CHANGE_AMOUNT = 'change_amount';
	const AC_REQUEST_AMOUNT = 'request_amount';
	const AC_RETURN_AMOUNT = 'return_amount';
	const AC_DELETE_CATEGORY = 'delete_category';
	const AC_CREATE_CATEGORY = 'create_category';

	private $_item_id;
	private $_title = '-';
	private $_action;
	private $_amount;
	private $_comment = '';

	/**
	 * @var array
	 */
	private $_fixed_before;

	/**
	 * @var array
	 */
	private $_fixed_after;

	public function setItemId($id)
	{
		$this->_item_id = $id;
		return $this;
	}

	public function unsetItemId()
	{
		unset($this->_item_id);
		return $this;
	}

	public function fixBefore()
	{
		$this->_fixed_before = $this->_fix();
		return $this;
	}

	public function fixAfter()
	{
		$this->_fixed_after = $this->_fix();

		return $this;
	}

	public function setTitle($title)
	{
		$this->_title = $title;
		return $this;
	}

	public function setAction($type)
	{
		$this->_action = $type;
		return $this;
	}

	public function setAmount($amount)
	{
		$this->_amount = $amount;
		return $this;
	}

	public function setComment($comment)
	{
		$this->_comment = $comment;
		return $this;
	}

	public function save()
	{
		$table = new Db_Logs();
		$table->insert($this->_prepareData());
	}

	private function _prepareData()
	{
		return array(
			'user_id' => user_id(),
			'title' => $this->_title,
			'action' => $this->_action,
			'fixation' => $this->_prepareFixation(),
			'amount' => $this->_amount,
			'comment' => $this->_comment
		);
	}

	private function _prepareFixation()
	{
		return json_encode(array(
			'before' => $this->_fixed_before,
			'after' => $this->_fixed_after
		));
	}

	private function _fix()
	{
		$model_budget = new Models_Budgets();
		$model_category = new Models_Categories();

		$data['budget'] = $model_budget->getSummary();

		if ($this->_item_id)
		{
			$data['category'] = $model_category->getById($this->_item_id);
		}

		return $data;
	}
}