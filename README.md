# browserid-xmpp

browserid-xmpp is a BrowserID Identity Provider for XMPP servers. It allows
Jabber IDs to be used as identities to authenticate with Mozilla Persona.

A Work In Progress.

Dependencies
------------

* gmp.h - on Ubuntu this is the libgmp3-dev package
* C++ compiler
* make

This program also includes the [strophejs](http://strophe.im/strophejs/)
library and the
[strophe.rpc.js](https://github.com/strophe/strophejs-plugins/tree/master/rpc),
both distributed under the terms of the MIT license.

Installation
------------

Either npm or git should work:

    npm install git@github.com:nikhilm/browserid-certifier-xmpp.git

or

    git clone git://github.com/nikhilm/browserid-certifier-xmpp.git

You must install the dependencies:

    cd browserid-certifier
    npm install

You must create a config file. Example ``config/local.json``

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
    ./scripts/gen_well_known_browserid.py var/key.publickey > /some/path/www/.well-known/browserid

Configuring the XMPP Server
---------------------------

Your XMPP server should support [external
components](http://xmpp.org/extensions/xep-0114.html). This component has been
tested with [Prosody](http://prosody.im/doc/components) and
[ejabberd](https://git.process-one.net/ejabberd/mainline/blobs/raw/v2.1.11/doc/guide.html)
(use `ejabberd_service`). The component address should be the `jid` in the
configuration file. `browserid.yourdomain.com` is a good name. The config file
`password` should be the shared secret.

Running Certifier
-----------------

    CONFIG_FILES=config/local.json npm start

XMPP API
--------

The Certifier webservice provides an API over
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

