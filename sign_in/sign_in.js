var BOSH_SERVICE = 'https://nikhilism.com/http-bind/';

var xmppConnect = function(jid, password, callback) {
  var connection = new Strophe.Connection(BOSH_SERVICE);
  connection.connect(jid, password, function(status, error) {
    callback(connection, status, error);
  });
}

$(function() {
  $("#login-form").submit(function() {
    xmppConnect($("#jid-entry").val(), $("#password-entry").val(), function(connection, status, error) {
      console.log("onConnect ", arguments);
      if (status == Strophe.Status.CONNECTING) {
        console.log("Connecting");
      } else if (status == Strophe.Status.CONNFAIL) {
        console.log('Strophe failed to connect.');
      } else if (status == Strophe.Status.CONNECTED) {
        console.log("Connected! " );
        sessionStorage.setItem("jid", connection.jid);
        sessionStorage.setItem("sid", connection.sid);
        sessionStorage.setItem("rid", connection.rid);
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
