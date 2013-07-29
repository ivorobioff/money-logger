<?php
class Controllers_FrontI18n
{
	public function load($params = array())
	{
		$layout = Libs_Views::create('front_i18n/index.phtml');

		if (always_set($params, 1) == 'index') unset($params[1]);

		if ($template_name = strtolower(implode('_', $params)))
		{
			if (file_exists(APP_DIR.'/views/front_i18n/'.$template_name.'.phtml'))
			{
				$layout->assign('view', Libs_Views::create('front_i18n/'.$template_name.'.phtml'));
			}
		}

		$layout->render();
	}
}