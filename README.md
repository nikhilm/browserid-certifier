# browserid-xmpp

browserid-xmpp is a BrowserID Identity Provider for XMPP servers. It allows
Jabber IDs to be used as identities to authenticate with Mozilla Persona.

A Work In Progress.

Dependencies
------------

You'll need an XMPP server running on the same domain that hosts the files. The
XMPP server or a third party component like
[Punjab](https://github.com/twonds/punjab) should support BOSH.

Your XMPP server should support [external
components](http://xmpp.org/extensions/xep-0114.html). This component has been
tested with [Prosody](http://prosody.im/doc/components) and
[ejabberd](https://git.process-one.net/ejabberd/mainline/blobs/raw/v2.1.11/doc/guide.html)
(use `ejabberd_service`).

The XMPP component is written in [node](http://nodejs.org). ``npm`` should
automatically install required dependencies.

This program also includes the [strophejs](http://strophe.im/strophejs/)
library and the
[strophe.rpc.js](https://github.com/strophe/strophejs-plugins/tree/master/rpc),
both distributed under the terms of the MIT license.

Installation
------------

    git clone git://github.com/nikhilm/browserid-xmpp.git

You must install the dependencies:

    cd browserid-xmpp
    npm install

Create a config file. Example ``config/local.json``

    {
      "jid": "Persona component JID as setup on the XMPP server",
      "password": "Component shared secret",
      "host": "XMPP server (usually 127.0.0.1)",
      "port": XMPP component connect port number,
      "issuer_hostname": "Your domain name",
      "pub_key_path": "var/key.publickey",
      "priv_key_path": "var/key.secretkey"
    }

Generating the Keypar
---------------------

Both your IdP service and the Certifier must share a public key.
The Certifier, requires both a private and public keypair.

Do the following:

    mkdir var
    cd var/
    ../node_modules/.bin/generate-keypair
    ls

You should now see a ``key.publickey`` and ``key.secretkey``
in the directory. This matches your local.json config.

You'll also want to import or re-use this ``key.publickey`` in
your IdP's ``/.well-known/browserid`` file.

    cd ..
    mkdir client/.well-known
    ./scripts/gen_well_known_browserid.py var/key.publickey > client/.well-known/browserid

Configuring the client
----------------------

Your HTTP server will need to serve the files in ``client/``.

``client/.well-known/browserid`` should be served at the top level --
``https://example.com/.well-known/browserid``. Move it to a different location
if that makes sense for your setup.

The URL at which ``client/`` is served must match the entries in the
``browserid`` file. Use [CheckMyIdP](https://checkmyidp.org) to verify that
everything is working.

Copy ``client/js/config.js-dist`` to ``client/js/config.js``.

Set ``bosh_service`` to the endpoint of your BOSH service. NOTE: Due to Cross
Origin restrictions, the BOSH service should be accessible on
``https://example.com`` and not ``https://example.com:5280``. If your website
is fronted by nginx, the easiest way is to add a location entry:

    location /http-bind/ {
        proxy_pass  https://example.com:5280/http-bind/;
        proxy_buffering off;
        tcp_nodelay on;
    }

Configuring the XMPP Server
---------------------------

The component address should be the `jid` in the configuration file.
`browserid.yourdomain.com` is a good name. The config file `password` should be
the shared secret.

Running Certifier
-----------------

    CONFIG_FILES=config/local.json npm start

XMPP API
--------

The Certifier component provides an API over
[Jabber-RPC](http://xmpp.org/extensions/xep-0009.html).

The XMPP client should send a Jabber-RPC method call after authentication.
persona-xmpp-client does this by resuming a BOSH session in the provisioning
page to get a signed certificate on behalf of the authenticated user.

### getSignedCertificate

Arguments (in order):

* email - The email address for this certificate
* pubkey - Object [compatible with JWT](https://github.com/mozilla/jwcrypto) public keys.
* duration - How long until the certificate expires, in seconds. (Optional)

The response will be:
  * certificate - string - A certificate compatible with
     `navigator.id.registerCertificate` from the [BrowserID Provisioning
    Protocol](https://developer.mozilla.org/en/BrowserID/Guide_to_Implementing_a_Persona_IdP)

