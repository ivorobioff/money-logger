<?php
class Libs_Views
{
	private $_template;
	private $_vars = array();

	public function __construct($template)
	{
		$this->_template = trim($template, '/');
	}

	/**
	 * @param string $template
	 * @return Libs_Views
	 */
	static public function create($template)
	{
		return new static($template);
	}

	public function assign($var_name, $value)
	{
		$this->_vars[$var_name] = $value;
		return $this;
	}

	public function render($show_now = true)
	{
		ob_start();
		include APP_DIR.'/views/'.$this->_template;
		$output = ob_get_clean();

		if (!$show_now)
		{
			return $output;
		}

		echo $output;
	}

	public function escape($string)
	{
		return htmlspecialchars($string);
	}

	public function __get($var_name)
	{
		return $this->_vars[$var_name];
	}
}