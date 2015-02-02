<?
	// set up the database, yo
	try {
		$db = new PDO("sqlite:story_js.sqlite");
		$db->exec("CREATE TABLE IF NOT EXISTS stories (id INTEGER PRIMARY KEY, story_id INTEGER, data TEXT)");
	} catch (PDOException $e) {
		echo "Exception: {$e->getMessage()}";
	}