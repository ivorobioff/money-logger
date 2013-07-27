<?php
class Tests_ActiveRecord extends PHPUnit_Framework_TestCase
{
	private $_table;
	private $_table2;

	static public function setUpBeforeClass()
	{
		Tests_Db_Table1::create()
			->query('CREATE TABLE IF NOT EXISTS `activerecord1` (
					  `id` int(11) NOT NULL,
					  `first_name` varchar(255) DEFAULT NULL,
					  `last_name` varchar(255) DEFAULT NULL,
					  `number` int(11) DEFAULT NULL,
					  PRIMARY KEY (`id`)
					) ENGINE=MyISAM DEFAULT CHARSET=utf8;');

		Tests_Db_Table2::create()
			->query('CREATE TABLE IF NOT EXISTS `activerecord2` (
					  `id` int(11) NOT NULL,
					  `dob` datetime DEFAULT NULL,
					  PRIMARY KEY (`id`)
					) ENGINE=MyISAM DEFAULT CHARSET=utf8;');
	}

	static public function tearDownAfterClass()
	{
		Tests_Db_Table1::create()
			->query('DROP TABLE IF EXISTS `activerecord1`');

		Tests_Db_Table2::create()
		->query('DROP TABLE IF EXISTS `activerecord2`');
	}

	public function setUp()
	{
		try
		{
			$this->_table = new Tests_Db_Table1();
			$this->_table2 = new Tests_Db_Table2();
		}
		catch (Exception $ex)
		{
			pred($ex->getMessage());
		}

		$this->_table->query('TRUNCATE TABLE activerecord1');
		$this->_table2->query('TRUNCATE TABLE activerecord2');
	}

	public function testInsertAndDuplicate()
	{
		try
		{
			$this->_table
				->insert(
					array(
						'id' => 1,
						'first_name' => 'Igor',
						'last_name' => 'Vorobioff',
						'number' => 1
					)
				);

			$this->_table
				->duplicate('id=id+', 1)
				->insert(
					array(
						'id' => 1,
						'first_name' => 'Igor',
						'last_name' => 'Vorobioff',
						'number' => 1
					)
				);

			$res = $this->_table->query('SELECT * FROM activerecord1');

			$row = $res->fetch_assoc();

			$this->assertEquals($row['id'], 2);
			$this->assertEquals($row['first_name'], 'Igor');
			$this->assertEquals($row['last_name'], 'Vorobioff');
			$this->assertEquals($row['number'], 1);
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testInsertAll()
	{
		try
		{
			$data = array(
				array(
					'id' => 1,
					'first_name' => 'Igor',
					'last_name' => 'Vorobioff',
					'number' => 1
				),
				array(
					'id' => 2,
					'first_name' => 'Igor2',
					'last_name' => 'Vorobioff2',
					'number' => 1
				)
			);

			$this->_table->insertAll($data);

			$res = $this->_table->query('SELECT * FROM activerecord1');

			$row1 = $res->fetch_assoc();
			$row2 = $res->fetch_assoc();

			$this->assertTrue($row1['id'] + 1 == $row2['id']);
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testFetchOne()
	{
		try
		{
			$data = array(
				array(
					'id' => 1,
					'first_name' => 'Igor',
					'last_name' => 'Vorobioff',
					'number' => 1
				),
				array(
					'id' => 2,
					'first_name' => 'Igor2',
					'last_name' => 'Vorobioff2',
					'number' => 1
				)
			);

			$this->_table->insertAll($data);

			$res = $this->_table->select('id')->select('first_name')->fetchOne('id', 2);

			$this->assertTrue($res['id'] == 2);
			$this->assertTrue(count($res) == 2);
			$this->assertTrue(isset($res['first_name']));
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testOrderBy()
	{
		try
		{
			$data = array(
				array(
					'id' => 1,
					'first_name' => 'Igor',
					'last_name' => 'Vorobioff',
					'number' => 1
				),
				array(
					'id' => 2,
					'first_name' => 'Igor2',
					'last_name' => 'Vorobioff2',
					'number' => 1
				)
			);

			$this->_table->insertAll($data);

			$res = $this->_table
				->select('id')
				->orderBy('id')
				->fetchOne();

			$this->assertTrue($res['id'] == 2);
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testGroupBy()
	{
		try
		{
			$data = array(
				array(
					'id' => 1,
					'first_name' => 'Igor',
					'last_name' => 'Vorobioff',
					'number' =>123
				),
				array(
					'id' => 2,
					'first_name' => 'Igor',
					'last_name' => 'Vorobioff',
					'number' => 34
				)
			);

			$this->_table->insertAll($data);

			$res = $this->_table
				->select('first_name, last_name')
				->groupBy('last_name')
				->fetchAll();

			$this->assertTrue(count($res) == 1, 'Must be one row.');
			$this->assertTrue($res[0]['first_name'] == 'Igor');
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testLeftJoin()
	{
		try
		{
			$this->_table->insert(array('id' => 1, 'first_name' => 'Igor', 'last_name' => 'Vorobioff'));
			$this->_table2->insert(array('id' => 1, 'dob' => '2011-08-09 12:12:01'));

			$this->_table2->setAlias('t2');

			$row = $this->_table
				->setAlias('t1')
				->select('t2.dob, t1.id')
				->join($this->_table2, 't1.id = t2.id')
				->fetchOne();

			$this->assertTrue($row['dob'] == '2011-08-09 12:12:01');
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testLike()
	{
		try
		{
			$data = array(
				array(
					'id' => 1,
					'first_name' => 'Igor',
					'last_name' => 'Vorobiov',
					'number' =>123
				),
				array(
					'id' => 2,
					'first_name' => 'Igor',
					'last_name' => 'Vorobioff',
					'number' => 34
				)
			);

			$this->_table->insertAll($data);

			$res = $this->_table
				->select('last_name')
				->where('last_name LIKE', '%ioff')
				->fetchOne();

			$this->assertTrue($res['last_name'] == 'Vorobioff');
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testIn()
	{
		try
		{
			$data = array();

			for ($i = 0; $i <= 10; $i++)
			{
				$data[] = array(
					'id' => $i,
					'first_name' => 'Igor',
					'last_name' => 'Vorobiov',
					'number' =>123
				);
			}

			$this->_table->insertAll($data);

			$res = $this->_table->fetchAll('id', array(3, 9));

			foreach ($res as $v)
			{
				$this->assertTrue(in_array($v['id'], array(3, 9)));
			}
		}
		catch(Exception $er)
		{
			die($er->getMessage());
		}
	}

	public function testUpdate()
	{
		try
		{
			$this->_table->insert(
				array(
					'id' => 1,
					'first_name' => 'Igor',
					'last_name' => 'Vorobiov',
					'number' =>123
				)
			);

			$this->_table->insert(
				array(
					'id' => 2,
					'first_name' => 'Igor',
					'last_name' => 'Vorobiov',
					'number' =>123
				)
			);

			$ar = $this->_table->where('id', 2)->update(array('last_name' => 'Vorobio\'ff'));

			$this->assertTrue($ar == 1);

			$res = $this->_table->fetchAll();

			$this->assertTrue($res[0]['last_name'] == 'Vorobiov' && $res[0]['id'] == 1, 'n1');
			$this->assertTrue($res[1]['last_name'] == 'Vorobio\'ff' && $res[1]['id'] == 2, 'n2');
		}
		catch (Exception $ex)
		{
			die($ex->getMessage());
		}
	}

	public function testDelete()
	{
		$data = array();

		for ($i = 0; $i <= 10; $i++)
		{
			$data[] = array(
				'id' => $i,
				'first_name' => 'Igor',
				'last_name' => 'Vorobiov',
				'number' =>123
			);
		}

		$this->_table->insertAll($data);

		$this->_table
			->where('id', 2)
			->either('id', 5)
			->either('id', 8)
			->delete();

		$res = $this->_table->fetchAll('id', array(2, 5, 8));

		$this->assertFalse((bool) $res);
	}

	public function testGetValue()
	{
		try
		{
			$this->_table->insert(array('id' => 1, 'first_name' => 'Igor'));

			$name = $this->_table->where('id', 1)->createResultFormat()->getValue('first_name');
			$empty = $this->_table->where('id', 1)->createResultFormat()->getValue('no_field', 'empty');

			$this->assertTrue($name == 'Igor');
			$this->assertTrue($empty == 'empty');
		}
		catch(Exception $ex)
		{
			die($ex->getMessage());
		}
	}

	public function testFilter()
	{
		try
		{
			$data = array();

			for ($i = 0; $i < 10; $i ++)
			{
				$data[] = array('id' => $i, 'first_name' => 'John'.$i, 'number' => $i);
			}

			$this->_table->insertAll($data);

			//test1
			$data = array('number' => 4);
			$rules = array('number' => true);

			$this->_table->filter($data, $rules);

			$res = $this->_table->fetchAll();

			$this->assertTrue($res[0]['number'] == 4);

			//test2

			$data = array('name' => 4);
			$rules = array('name' => 'number');

			$this->_table->filter($data, $rules);

			$res = $this->_table->fetchAll();

			$this->assertTrue($res[0]['number'] == 4);

			//test3

			$data = array('name' => 7);
			$rules = array('name' => array('number', '>', '{value}'));

			$this->_table->filter($data, $rules);

			$res = $this->_table->fetchAll();

			$this->assertTrue(count($res) == 2);
		}
		catch(Exception $ex)
		{
			die($ex->getMessage());
		}
	}
}