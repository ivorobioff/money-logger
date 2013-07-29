<?php
/**
 * Контроллер для запуска тестовой среды
 * @author Igor Vorobioff<i_am_vib@yahoo.com>
 */
class Controllers_Test
{
	public function run($class_name)
	{
		if (!class_exists($class_name)) return ;

		$suite = new PHPUnit_Framework_TestSuite();
		$suite->setName($class_name);

		$suite->addTestSuite($class_name);

		$listener = new PHPUnit_Util_Log_TAP();

		$test_result = new PHPUnit_Framework_TestResult();
		$test_result->convertErrorsToExceptions(true);

		$test_result->addListener($listener);

		echo '<pre>';
		$suite->run($test_result);
		echo '</pre>';
	}
}