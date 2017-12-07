<?php
    require(__DIR__ . "/includes/config.php");
    // numerically indexed array of places
    $places = [];

    // search database for places matching $_GET["geo"]
    $param = array_map('trim' , explode("," , $_GET["geo"]));
    $result = [];
    foreach($param as $chunk)
    {
        $result = array_merge($result , explode(" ",$chunk));
    }
    $param = $result;


    $sql = "SELECT * FROM places WHERE (";
     for ($i = 0, $count = count($param); $i < $count; $i++)
     {
        $sql.="place_name_rus LIKE '".htmlspecialchars($param[$i])."%'";

        if($i == $count-1)
        {
            $sql.=");";
        }
        else
        {
            $sql.=")AND (";
        }

    }

    $query = query($sql);
    if($query === false)
    {
        echo("something went wrong");
        return -1;
    }

    $places = $query;

    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));
?>
