<?php
/**
 * Базовый котроллер для выполнения операций, которые не требуют отбражения страниц.
 * Обычно это AJAX или POST запросы.
 * @author Igor Vorobioff<i_am_vib@yahoo.com>
 */
abstract class Libs_Controllers_Processor extends Libs_Controllers
{
	/**
	 * Флаг определяющий требуется ли ajax проверка перед вызовом акшиона.
	 * Если true то любой запрос к данному контроллеру должен быть ajax-овым.
	 * @var bool
	 */
	protected $_require_ajax = true;
	/**
	 * Список акшионов, которые на потдаются общим правилам ajax проверки.
	 * Если $_require_ajax == true, то запросы на данные акшионы НЕ обязательно должны быть ajax.
	 * Если $_require_ajax == false, то запросы на данные акшионы обязательно должны быть ajax.
	 * @var array
	 */
	protected $_ajax_exceptions = array();

	public function __construct()
	{
		parent::__construct();

		if (!$this->_checkAuth())
		{
			return ;
		}

		if (!$this->_checkAjax())
		{
			throw new Libs_Exceptions_Error404();
		}
	}

	/**
	 * Проверить если это ajax запрос
	 * @return bool
	 */
	protected function isAjax()
	{
		return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
			&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	}

	/**
	 * Отправить ответ об успехе
	 * @param array $data
	 */
	protected function ajaxSuccess(array $data = array())
	{
		echo json_encode(array('status' => 'success', 'data' => $data));
	}

	/**
	 * Отправить ответ об ошибке
	 * @param array $data
	 */
	protected function ajaxError(array $data = array())
	{
		echo json_encode(array('status' => 'error', 'data' => $data));
	}

	private function _checkAjax()
	{
		$ajax_exceptions = $this->_ajax_exceptions;

		foreach ($ajax_exceptions as &$value)
		{
			$value = strtolower($value);
		}

		if ($this->_require_ajax)
		{
			if (!in_array(strtolower($_GET['action']), $ajax_exceptions) && !$this->isAjax())
			{
				return false;
			}
		}
		else
		{
			if (in_array(strtolower($_GET['action']), $ajax_exceptions) && !$this->isAjax())
			{
				return false;
			}

		}

		return true;
	}
}
