/* eslint indent: ["error", 4] */
/* eslint no-useless-escape: "off" */

function httpSection() {
    return `
    listen 80;
    listen [::]:80`
}

function sslSection(sslCertPath, sslKeyPath) {
    return `
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate ${sslCertPath};
    ssl_certificate_key ${sslKeyPath};`
}

function generalSection(domain) {
    return `
    server_name ${domain};

    access_log /var/log/nginx/${domain}.log;
    error_log /var/log/nginx/${domain}.error.log;`
}

function rootPathSection(rootPath, phpSupport) {
    return `
    root ${rootPath};

    index index.html${phpSupport ? ' index.php' : ''};`
}

const rootTypes = (location, proxyUrl) => ({
    regular: `
    location ${location} {
        try_files $uri $uri/ =404;
    }`,

    spa: `
    # rewrite SPA
    location ${location} {
        try_files $uri $uri/ ${location === '/' ? '' : location + '/'}index.html;
    }`,

    proxied: `
    location ${location} {
        proxy_pass ${proxyUrl};
    }`
})

function rootLocationSection(type, location = '/', proxyUrl) {
    return rootTypes(location, proxyUrl)[type]
}

function phpSection(phpVersion) {
    return `
    # pass PHP scripts to FastCGI server
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php${phpVersion}-fpm.sock;
    }`
}

function denyDotGitSection() {
    return `
    # block .git
    location ~ /\.git {
        return 404;
    }`
}

module.exports = function generateNginxConfig(opts) {
    const {
        domain,
        phpSupport,
        phpVersion,
        rootType,
        rootPath,
        proxyUrl,
        sslCertPath,
        sslKeyPath
    } = opts

    const template = [
        sslCertPath && sslKeyPath ? sslSection(sslCertPath, sslKeyPath) : httpSection(),
        generalSection(domain),
        rootType !== 'proxied' ? rootPathSection(rootPath, phpSupport) : '',
        rootLocationSection(rootType, '/', proxyUrl),
        phpSupport ? phpSection(phpVersion) : '',
        denyDotGitSection()
    ].filter(x => x)

    return `server {${template.join('\n')}\n}`
}
