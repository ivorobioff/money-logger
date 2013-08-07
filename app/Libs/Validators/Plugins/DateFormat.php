<?php
class Libs_Validators_Plugins_DateFormat extends Libs_Validators_Plugins
{
	/**
	 * Формат даты
	 * @var string
	 */
	private $_format;
	/**
	 * Дата которая проверяется на нужный формат
	 * @var string
	 */
	private $_date;

	/**
	 * Задать формат по которому будет идти проверка
	 * @param string $format
	 * @return Libs_Validators_Plugins_DateFormat
	 */
	public function setFormat($format)
	{
		$this->_format = $format;
		return $this;
	}

	/**
	 * Задать дату которая будет проверяться
	 * @param string $date
	 * @return Libs_Validators_Plugins_DateFormat
	 */
	public function setDate($date)
	{
		$this->_date = $date;
		return $this;
	}

	/**
	 * Проверить если дата в нужном формате
	 * @return boolean
	 */
	public function check()
	{
		$date_object = new DateTime();

		$formated_date = $date_object->createFromFormat($this->_format, $this->_date);

		if (!$formated_date || $formated_date->format($this->_format) != $this->_date)
		{
			return false;
		}

		return true;
	}

}