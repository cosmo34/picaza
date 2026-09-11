<?php
declare(strict_types=1);

const DATA_FILE = __DIR__ . '/data/udids.json';
const MAIL_TO = 'contact@picaza.fr';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: enroll.mobileconfig', true, 302);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
if ($raw === '') {
    http_response_code(400);
    exit('empty');
}

$xml = $raw;
if (preg_match('/<\?xml[\s\S]*<\/plist>/', $raw, $matches)) {
    $xml = $matches[0];
}

$udid = plist_string($xml, 'UDID');
$product = plist_string($xml, 'PRODUCT');
$version = plist_string($xml, 'VERSION');

if ($udid === '') {
    http_response_code(400);
    exit('no-udid');
}

$dir = dirname(DATA_FILE);
if (!is_dir($dir)) {
    mkdir($dir, 0750, true);
}

$entries = [];
if (is_file(DATA_FILE)) {
    $decoded = json_decode((string) file_get_contents(DATA_FILE), true);
    if (is_array($decoded)) {
        $entries = $decoded;
    }
}

$already = false;
foreach ($entries as $entry) {
    if (($entry['udid'] ?? '') === $udid) {
        $already = true;
        break;
    }
}

if (!$already) {
    $entries[] = [
        'udid' => $udid,
        'product' => $product,
        'version' => $version,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'at' => gmdate('c'),
    ];
    file_put_contents(DATA_FILE, json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

    $subject = '[NUMERS] iPhone enregistré ' . $udid;
    $body = "UDID : $udid\nModèle : $product\nVersion : $version\nDate : " . gmdate('c') . "\n";
    $headers = "From: NUMERS <noreply@picaza.fr>\r\nContent-Type: text/plain; charset=UTF-8";
    @mail(MAIL_TO, $subject, $body, $headers);
}

header('Content-Type: application/x-apple-aspen-config');
header('Content-Disposition: inline; filename="numers-enrolled.mobileconfig"');
$signed = __DIR__ . '/enrolled.mobileconfig';
if (is_file($signed)) {
    readfile($signed);
    exit;
}

echo <<<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array/>
	<key>PayloadDisplayName</key>
	<string>NUMERS — iPhone enregistré</string>
	<key>PayloadDescription</key>
	<string>Cet iPhone est enregistré pour NUMERS. Vous pouvez supprimer ce profil. L’app sera installable dès qu’elle sera mise à jour pour cet appareil.</string>
	<key>PayloadIdentifier</key>
	<string>fr.picaza.numers.enrolled</string>
	<key>PayloadOrganization</key>
	<string>Picaza</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>B4A9D2F1-8C65-4E02-B7D3-98E1A4C6B5D7</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>
PLIST;

function plist_string(string $xml, string $key): string
{
    if (!preg_match('#<key>' . preg_quote($key, '#') . '</key>\s*<string>([^<]*)</string>#', $xml, $match)) {
        return '';
    }
    return trim($match[1]);
}
