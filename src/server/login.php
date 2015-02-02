<?php
	/**
	 * Created by PhpStorm.
	 * User: Deathnerd
	 * Date: 1/25/2015
	 * Time: 11:21 PM
	 */

	require("database_init.php");
	header("Content-type: application/x-javascript");

	//check if the story exists
	$statement = $db->prepare("SELECT * FROM stories WHERE story_id=?");
	/**
	 * @param $return_json
	 */
	function return_jsonp($return_json) {
		exit("{$_GET['callback']}(" . $return_json . ")");
	}

	if ($statement->execute([$_GET['story_id']]) !== false) {
		$row = $statement->fetch(PDO::FETCH_ASSOC);

		return_jsonp(json_encode($row));
	} else {
		$return_json = null;
		try {
			$statement = $db->prepare("INSERT INTO stories (story_id, data) VALUES(?,?)");
			$statement->bindParam(1, $story_id);
			$story_id = $_GET['story_id'];
			$statement->execute();
		} catch (PDOException $e) {
			$return_json = json_encode([
				[
					"success" => false,
					"reason"  => "Server error",
					"message" => "There was an error on the server while trying to create a new story id",
					"error"   => "Exception: {$e->getMessage()}"
				]
			]);
		}
		$return_json = is_null($return_json) ? json_encode([
			[
				"success" => false,
				"reason"  => "No such story id",
				"message" => "That story id was not found. A new game has been created with that id"
			]
		]) : $return_json;

		return_jsonp($return_json);
	}