$(document).ready(function () {
  $("#login-button").click(function(){
    var request = new XMLHttpRequest();
    request.open("GET", "src/json/users.json", false);
    request.send(null);
    var my_JSON_object = JSON.parse(request.responseText);

    var username = document.getElementById("username-form").value;
    var password = document.getElementById("password-form").value;
     
    for (var i = 0; i < my_JSON_object.users.length; i++) {
      if(my_JSON_object.users[i].username == username && my_JSON_object.users[i].password == password) {
        localStorage.setItem("username", username);
         window.location.replace("game.html");
      }
    }
  });
});