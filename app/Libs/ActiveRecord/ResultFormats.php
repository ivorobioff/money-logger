<?php
/**
 * Преобразует полученый результат из бд в нужный формат
 * @author Igor Vorobioff<i_am_vib@yahoo.com>
 */
class Libs_ActiveRecord_ResultFormats
{
	/**
	 * @var Libs_ActiveRecord
	 */
	private $_query;

	public function __construct(Libs_ActiveRecord $query)
	{
		$this->_query = $query;
	}

	/**
	 * Получить результат в виде хэша.
	 *
	 * Данно:
	 * array(
	 * 		array(
	 * 			'id' => 10,
	 * 			'name' => 'Dude',
	 * 			'dob' => '2012-09-29'
	 * 		),
	 * 		array(
	 * 			'id' => 11,
	 * 			'name' => 'Dude2',
	 * 			'dob' => '2012-09-27'
	 * 		),
	 * )
	 *
	 * Пример 1, если key = 'id' и value 'dob', результат будет:
	 * array(
	 * 		array(10 => '2012-09-29', 11 => '2012-09-27')
	 * )
	 *
	 * Пример 2, если key = 'name', value = null, результат будет:
	 * array(
	 * 		array(
	 * 			'Dude' => array(
	 * 				'id' => 10,
	 * 				'name' => 'Dude',
	 * 				'dob' => '2012-09-29'
	 * 			),
	 * 			'Dude2' => array(
	 * 				'id' => 11,
	 * 				'name' => 'Dude2',
	 * 				'dob' => '2012-09-27'
	 * 			),
	 * 		)
	 * )
	 *
	 * @param string $key
	 * @param string $value
	 * @param mixed $default
	 */
	public function getHash($key = 'id', $value = null, $default = array())
	{
		if (!$data = $this->_query->fetchAll()) return $default;

		$return = array();

		foreach ($data as $values)
		{
			$return[$values[$key]] = is_null($value) ? $values : $values[$value];
		}

		return $return;
	}

	/**
	 * Получить значения заданного поля в виде одномерного массива
	 * @param string $field
	 * @param int $offset
	 * @param mixed $default
	 */
	public function getVector($field, $default = array())
	{
		if (!$data = $this->_query->fetchAll()) return $default;

		$return = array();

		foreach ($data as $value)
		{
			$return[] = $value[$field];
		}

		return $return;
	}

	public function getValue($key, $default = false)
	{
		if (!$data = $this->_query->fetchOne()) return $default;

		return always_set($data, $key, $default);
	}

	public function groupItemsBy($key)
	{
		if (!$data = $this->_query->fetchAll()) return array();

		$return = array();

		foreach ($data as $item)
		{
			$return[$item[$key]][] = $item;
		}

		return $return;
	}
}