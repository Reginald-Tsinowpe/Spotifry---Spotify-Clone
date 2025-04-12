<?php

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../../config/database-credentials.php';

// require dirname(__DIR__) . '/src/chat.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;


class Chat implements MessageComponentInterface {
    protected $clients;
    protected $users;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->users = []; // connection => userID
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection: ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        if (isset($data['type']) && $data['type'] === 'init') {
            // Register user
            $this->users[$from->resourceId] = [
                'conn' => $from,
                'user_id' => $data['user_id']
            ];
            return;
        }

        $fromUserId = $this->users[$from->resourceId]['user_id'];
        $toUserId = $data['to'];
        $message = $data['message'];

        // Save message to database
        $this->saveMessage($fromUserId, $toUserId, $message);

        // Send to intended receiver
        foreach ($this->clients as $client) {
            if ($client !== $from && isset($this->users[$client->resourceId])) {
                if ($this->users[$client->resourceId]['user_id'] == $toUserId) {
                    $client->send(json_encode([
                        'from' => $fromUserId,
                        'message' => $message
                    ]));
                }
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        unset($this->users[$conn->resourceId]);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    protected function saveMessage($from, $to, $message) {
        $pdo = new PDO(    "mysql:host=" . constant("DB_HOSTNAME") . ";dbname=" . constant("DB_NAME"), constant("DB_USERNAME"), constant("DB_PASSWORD"));
        $stmt = $pdo->prepare("INSERT INTO tbl_messages (`sender_id`, `receiver_id`, `message_text`) VALUES (?, ?, ?)");
        $stmt->execute([$from, $to, $message]);
    }
}

// Run server
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080
);

$server->run();

?>