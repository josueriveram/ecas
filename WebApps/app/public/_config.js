const _CONFIG = {
    api_base_url: 'https://axis.curn.edu.co/apiecas/api',
    error_reporting_url: "https://axis.curn.edu.co/apildap/api/log/errorwrite",
    ldap_search_user: 'https://axis.curn.edu.co/apildap/api/ldap/account/',
    google_client_id: '489784104983-0aj59m5r7qkmqntur44j5st3dg5ror9t.apps.googleusercontent.com',
    microsoft_client_id: '', 
    logo_login: '/logologin.svg',
    app_url: 'https://activa.curn.edu.co', //App public link
    maintenance_url: "https://axis.curn.edu.co/apiaxis/api/mantenimiento/activauninunez", //OPTIONAL TO VERIFY IF APP IS IN MAINTENANCE
    wallet_url: 'https://wallet.curn.edu.co/', //OPTIONAL FOR WALLET
}

window._NGconfig = _CONFIG;
