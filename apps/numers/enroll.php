<?php
declare(strict_types=1);

const DATA_FILE = __DIR__ . '/data/udids.json';
const MAIL_TO = 'contact@picaza.fr';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: enroll.mobileconfig', true, 302);
    exit;
}

@ini_set('zlib.output_compression', '0');
ignore_user_abort(true);

$raw = file_get_contents('php://input') ?: '';
if ($raw === '') {
    http_response_code(400);
    header('Content-Type: text/plain');
    exit('empty');
}

$xml = extract_plist($raw);
$udid = plist_string($xml, 'UDID');
$product = plist_string($xml, 'PRODUCT');
$version = plist_string($xml, 'VERSION');
if ($udid === '') {
    $udid = plist_string($raw, 'UDID');
    $product = plist_string($raw, 'PRODUCT');
    $version = plist_string($raw, 'VERSION');
}

$saved = false;
if ($udid !== '') {
    $saved = save_udid($udid, $product, $version);
}

$profile = enrollment_profile($udid);
header('Content-Type: application/x-apple-aspen-config');
header('Content-Length: ' . (string) strlen($profile));
echo $profile;

if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} else {
    if (function_exists('ob_get_level')) {
        while (ob_get_level() > 0) {
            ob_end_flush();
        }
    }
    flush();
}

if ($saved) {
    $subject = '[NUMERS] iPhone enregistré ' . $udid;
    $body = "UDID : $udid\nModèle : $product\nVersion : $version\nDate : " . gmdate('c') . "\n";
    $headers = "From: NUMERS <noreply@picaza.fr>\r\nContent-Type: text/plain; charset=UTF-8";
    @mail(MAIL_TO, $subject, $body, $headers);
}

function save_udid(string $udid, string $product, string $version): bool
{
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        return false;
    }

    $entries = [];
    if (is_file(DATA_FILE)) {
        $decoded = json_decode((string) file_get_contents(DATA_FILE), true);
        if (is_array($decoded)) {
            $entries = $decoded;
        }
    }

    foreach ($entries as $entry) {
        if (($entry['udid'] ?? '') === $udid) {
            return false;
        }
    }

    $entries[] = [
        'udid' => $udid,
        'product' => $product,
        'version' => $version,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'at' => gmdate('c'),
    ];
    return file_put_contents(
        DATA_FILE,
        json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    ) !== false;
}

function enrollment_profile(string $udid): string
{
    $title = $udid === '' ? 'NUMERS — iPhone enregistré' : 'NUMERS — ' . $udid;
    $outer = guid();
    $inner = guid();
    $udidXml = htmlspecialchars($udid, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    $titleXml = htmlspecialchars($title, ENT_XML1 | ENT_QUOTES, 'UTF-8');

    return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>FullScreen</key>
			<true/>
			<key>IsRemovable</key>
			<true/>
			<key>Label</key>
			<string>NUMERS</string>
			<key>PayloadDescription</key>
			<string>Raccourci NUMERS. Vous pouvez supprimer ce profil après l’enregistrement.</string>
			<key>PayloadDisplayName</key>
			<string>NUMERS</string>
			<key>PayloadIdentifier</key>
			<string>fr.picaza.numers.enrolled.webclip.v3</string>
			<key>PayloadType</key>
			<string>com.apple.webClip.managed</string>
			<key>PayloadUUID</key>
			<string>{$inner}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>Precomposed</key>
			<true/>
			<key>URL</key>
			<string>https://picaza.fr/apps/numers.html</string>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>Cet iPhone est enregistré pour NUMERS. Identifiant : {$udidXml}. Vous pouvez supprimer ce profil ensuite.</string>
	<key>PayloadDisplayName</key>
	<string>{$titleXml}</string>
	<key>PayloadIdentifier</key>
	<string>fr.picaza.numers.enrolled.v3</string>
	<key>PayloadOrganization</key>
	<string>Picaza</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>{$outer}</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>
XML;
}

function guid(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function extract_plist(string $raw): string
{
    if (preg_match('/<\?xml[\s\S]*<\/plist>/', $raw, $matches)) {
        return $matches[0];
    }
    $in = tempnam(sys_get_temp_dir(), 'cms');
    $out = tempnam(sys_get_temp_dir(), 'pl');
    if ($in === false || $out === false) {
        return $raw;
    }
    file_put_contents($in, $raw);
    @exec(
        'openssl cms -verify -inform DER -in ' . escapeshellarg($in) . ' -noverify -out ' . escapeshellarg($out) . ' 2>/dev/null',
        $_,
        $code
    );
    $decoded = is_file($out) ? (string) file_get_contents($out) : '';
    @unlink($in);
    @unlink($out);
    if ($code === 0 && $decoded !== '') {
        return $decoded;
    }
    return $raw;
}

function plist_string(string $xml, string $key): string
{
    if (!preg_match('#<key>' . preg_quote($key, '#') . '</key>\s*<string>([^<]*)</string>#', $xml, $match)) {
        return '';
    }
    return trim($match[1]);
}
