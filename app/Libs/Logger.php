<?php
/**
 * Класс для логирование опираций и состояние бюджета и категории до и после совершонной операции.
 * @author Игорь Воробьев<vib@avantajprim.com>
 */
class Libs_Logger
{
	const AC_BUDGET_WITHDRAWAL = 'budget_withdrawal';
	const AC_BUDGET_DEPOSIT = 'budget_deposit';
	const AC_CATEGORY_WITHDRAWAL = 'category_withdrawal';
	const AC_CATEGORY_REFUND = 'category_refund';
	const AC_ADD_AMOUNT = 'add_amount';
	const AC_SUBTRACT_AMOUNT = 'subtract_amount';
	const AC_REQUEST_AMOUNT = 'request_amount';
	const AC_RETURN_REMAINDER = 'return_remainder';
	const AC_DELETE_CATEGORY = 'delete_category';
	const AC_CREATE_CATEGORY = 'create_category';

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

	public function fixBefore($id = null)
	{
		$this->_fixed_before = $this->_fix($id);
		return $this;
	}

	public function fixAfter($id = null)
	{
		$this->_fixed_after = $this->_fix($id);

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
			'comment' => $this->_comment,
			'insert_date' => date('Y-m-d H:s:i')
		);
	}

	private function _prepareFixation()
	{
		return json_encode(array(
			'before' => $this->_fixed_before,
			'after' => $this->_fixed_after
		));
	}

	private function _fix($id = null)
	{
		$model_budget = new Models_Budgets();

		$data['budget'] = $model_budget->getSummary();

		if ($id)
		{
			$model_category = new Models_Categories();
			$data['category'] = $model_category->getById($id);
		}

		return $data;
	}
}