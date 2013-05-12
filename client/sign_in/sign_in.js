var xmppConnect = function(jid, password, callback) {
  var connection = new Strophe.Connection(BrowserID_XMPP_Config.bosh_service);
  connection.connect(jid, password, function(status, error) {
    callback(connection, status, error);
  });
}

$(function() {
  $("#login-form").submit(function() {
    xmppConnect($("#jid-entry").val(), $("#password-entry").val(), function(connection, status, error) {
      if (status == Strophe.Status.CONNECTING) {
        console.log("Connecting");
      } else if (status == Strophe.Status.CONNFAIL) {
        console.log('Strophe failed to connect.');
      } else if (status == Strophe.Status.CONNECTED) {
        console.log("Connected! " );
        sessionStorage.setItem("browserid-xmpp:jid", Strophe.getBareJidFromJid(connection.jid));
        sessionStorage.setItem("browserid-xmpp:sid", connection.sid);
        sessionStorage.setItem("browserid-xmpp:rid", connection.rid);
        console.log("Completing auth");
        navigator.id.completeAuthentication();
      } else if (status == Strophe.Status.ERROR) {
        console.log("Strophe Error ");
      } else if (status == Strophe.Status.AUTHENTICATING) {
        console.log("Strophe authenticating");
      } else if (status == Strophe.Status.AUTHFAIL) {
        console.log("Strophe Auth fail!");
      }
    });

    return false;
  });
});
