<?php
chdir(dirname(__DIR__, 2));

// Load composer autoloader & bootstrap app
require __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';

// Initiate Kernel Console
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;

// Run artisan command
Artisan::call('queue:work', [
    'connection' => 'database',
    '--queue' => 'default',
    '--tries' => 3,
    '--max-jobs' => 10,
    '--stop-when-empty' => true,
    '-v' => true,
]);

// Write log to file
$output = Artisan::output();
$logFile = base_path('/storage/logs/queue-cron.log');
$timestamp = date('Y-m-d H:i:s');

if (!file_exists($logFile)) {
    touch($logFile);
}

if (!empty($output)) {
    $message = "[" . $timestamp . "]\n" . trim($output) . "\n----------------------------------------\n";
    file_put_contents($logFile, $message, FILE_APPEND);
}
