<?php
$i18n = array(
	'/auth/title' => 'Регистрация/Авторизация',
	'/auth/email' => 'E-mail',
	'/auth/pass' => 'Пароль',
	'/auth/enter' => 'Войти',
	'/auth/exit' => 'Выйти',
	'/auth/remember_me' => 'Запомнить меня',
	'/auth/registration' => 'Регистрация',
	'/auth/fio' => 'ФИО',
	'/auth/conf_pass' => 'Подтвердить пароль',
	'/auth/register' => 'Зарегистрировать',
	'/auth/validator/wrong_email_format' => 'Не верный формат e-mail',
	'/auth/validator/wrong_pass_length' => 'Не верная длина пароля',
	'/auth/validator/no_user' => 'Пользователь не найден',
	'/auth/validator/diff_passes' => 'Пароли разные',
	'/auth/validator/user_exists' => 'Пользователь уже зарегестрирован',
	'/auth/validator/cannot_register' => 'Не удалось зарегестрироваться',
	'/auth/validator/missing_field' => 'Не задано поле',

	'/sections/money_flow' => 'Денежный поток',
	'/sections/planner' => 'Планировщик',
	'/sections/logs' => 'Логи',
	'/sections/archive' => 'Архив',
	'/sections/settings' => 'Настройки',

	'/money_flow/sum' => 'Сумма',
	'/money_flow/validator/missing_field' => 'Не задано поле',
	'/money_flow/validator/wrong_amount' => 'Сумма должно быть больше 0.00',
	'/money_flow/validator/refund_too_big' => 'Сумма для восстановления слишком большая',
	'/money_flow/validator/remainder_zero' => 'Невозможно вернуть остаток. Остаток равен нулю',
	'/money_flow/validator/is_sync' => 'Невозможно вернуть остаток. Остаток должен быть меньше запланированой суммы',

	'/context_menu/withdrawal' => 'Снять сумму',
	'/context_menu/return_remainder' => 'Вернуть остаток',
	'/context_menu/refund' => 'Восстановить сумму',
	'/context_menu/edit' => 'Редактировать',
	'/context_menu/delete' => 'Удалить',
	'/context_menu/add_category' => 'Добавить категорию',

	'/planner/validator/missing_field' => 'Не задано поле',
	'/planner/validator/wrong_amount' => 'Сумма должно быть больше 0.00',
	'/planner/validator/group_not_empty' => 'Группа содержит категории',
	'/planner/validator/group_one_left' => 'Последнюю группу нельзя удалить',
	'/planner/validator/not_sync' => 'Категория уже задействована в операциях',
	'/planner/validator/amount_too_small' => 'Запланированая суммма меньше потраченной суммы',
	'/planner/add_group' => 'Добавить группу',

	'/dialogs/add_categories/title' => 'Название',
	'/dialogs/add_categories/sum' => 'Сумма',
	'/dialogs/add_categories/group' => 'Группа',
	'/dialogs/add_categories/pin' => 'Прикрепить',
	'/dialogs/budget/amount' => 'Сумма',
	'/dialogs/money_flow/amount' => 'Сумма',
	'/dialogs/money_flow/comments' => 'Коммен-<br/>тарий',

	'/dialogs/add_group/name' => 'Название',

	'/budget/menu/deposit' => 'Внести сумму',
	'/budget/menu/withdrawal' => 'Забрать сумму',
	'/budget/menu/close_month' => 'Закрыть месяц',
	'/budget/remainder' => 'Остаток',
	'/budget/expenses' => 'Расходы',
	'/budget/budget' => 'Бюджет',
	'/budget/validator/small_amount' => 'Сумма не должна быть меньше 0.01',
	'/budget/validator/not_enough_money' => 'Не хватает средств для снятия',

	'/js/dialogs/submit' => 'Применить',
	'/js/dialogs/cancel' => 'Отмена',
	'/js/dialogs/yes' => 'Да',
	'/js/dialogs/no' => 'Нет',
	'/js/dialogs/titles/add_category' => 'Создать новую категорию',
	'/js/dialogs/titles/edit_category' => 'Редактировать категорию',
	'/js/dialogs/titles/add_group' => 'Создать новую группу',
	'/js/dialogs/titles/edit_group' => 'Редактировать группу',
	'/js/dialogs/titles/warning' => 'Внимание!',
	'/js/dialogs/titles/deposit' => 'Внести сумму',
	'/js/dialogs/titles/withdrawal' => 'Забрать сумму',
	'/js/dialogs/titles/money_flow_withdrawal' => 'Снять сумму',
	'/js/dialogs/titles/refund' => 'Восстановить сумму',

	'/js/dialogs/text/delete_group' => 'Вы уверены, что хотите удалить данную группу?',
	'/js/dialogs/text/delete_category' => 'Вы уверены что хотите удалить данную категорию?',
	'/js/dialogs/text/request_amount' => 'У вас не хватает средств для снятия. Запросить недостающую сумму?',
	'/js/dialogs/text/return_remainder' => 'Вы уверены, что хотите вернуть оставшуюся сумму?',
);