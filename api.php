<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow specific methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

include "db.php";

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "GET":
        if (isset($_GET["id"])) {
            // Fetch user by ID
            $id = intval($_GET["id"]); // Prevent SQL Injection
            $sql = "SELECT * FROM users WHERE id = $id";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                echo json_encode($result->fetch_assoc());
            } else {
                http_response_code(404);
                echo json_encode(["error" => "User not found"]);
            }
        } else {
            // Fetch all users
            $sql = "SELECT * FROM users ORDER BY id DESC";
            $result = $conn->query($sql);
            $users = [];
            
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            echo json_encode($users);
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        $name = $data["name"];
        $email = $data["email"];
        $sql = "INSERT INTO users (name, email) VALUES ('$name', '$email')";
        if ($conn->query($sql)) {
            echo json_encode(["message" => "User created successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
        break;

    case "PUT":
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data["id"];
        $name = $data["name"];
        $email = $data["email"];
        $sql = "UPDATE users SET name='$name', email='$email' WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
        break;

    case "DELETE":
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data["id"];
        $sql = "DELETE FROM users WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

$conn->close();
?>
