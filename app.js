var MenuItems = document.getElementById("MenuItems");
console.log(MenuItems);
MenuItems.style.maxHeight = "0px";
function menutoggle() {
  if (MenuItems.style.maxHeight == "0px") {
    MenuItems.style.maxHeight = "200px";
  } else {
    MenuItems.style.maxHeight = "0px";
  }
}

function generateStringFromArray(arr) {
  let str = "";
  arr.forEach((a) => {
    str += `${a.S} `;
  });
  return str;
}

var data = {
  UserPoolId: _config.cognito.userPoolId,
  ClientId: _config.cognito.clientId,
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

var cognitoUser = userPool.getCurrentUser();

window.onload = function () {

  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err);
        return;
      }
      console.log("session valididty: " + session.isValid());

      cognitoUser.getUserAttributes(function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);
        let loginButton = document.getElementById("loginButton");
        loginButton.style.display = "none";
        let logoutButton = document.getElementById("logoutButton");
        logoutButton.innerHTML =
          '<button onclick="signOut()" > Logout</button>';
      });
    });
  }
};

function signOut() {
  if (cognitoUser != null) {
    window.localStorage.removeItem("email");
    cognitoUser.signOut();
    window.location.href = '/account.html';
  }
}

var LoginForm = document.getElementById("LoginForm");
var RegisterForm = document.getElementById("RegisterForm");
var Indicator = document.getElementById("Indicator");

function register() {
  RegisterForm.style.transform = "translateX(0px)";
  LoginForm.style.transform = "translateX(0px)";
  Indicator.style.transform = "translateX(100px)";
}
function login() {
  RegisterForm.style.transform = "translateX(300px)";
  LoginForm.style.transform = "translateX(300px)";
  Indicator.style.transform = "translateX(0px)";
}

var username;
var personalname;
var password;
var poolData;

function registerButton() {
  personalnamename = document.getElementById("personalnameRegister").value;
  username = document.getElementById("emailInputRegister").value;

  if (
    document.getElementById("passwordInputRegister").value !=
    document.getElementById("password2InputRegister").value
  ) {
    alert("Passwords do no match!");
    throw "Passwords do no match!";
  } else {
    password = document.getElementById("passwordInputRegister").value;
  }

  poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.clientId,
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var attributeList = [];

  var dataEmail = {
    Name: "email",
    Value: username,
  };

  var dataPersonalName = {
    Name: "name",
    Value: personalname,
  };

  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataEmail
  );
  var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataPersonalName
  );

  attributeList.push(attributeEmail);
  attributeList.push(attributePersonalName);

  userPool.signUp(
    username,
    password,
    attributeList,
    null,
    function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      cognitoUser = result.user;
      console.log("user name is " + cognitoUser.getUsername());
      document.getElementById("titleheader").innerHTML =
        "Check email for Verification";
    }
  );
}

function signInButton() {
  var authenticationData = {
    Username: document.getElementById("inputUsername").value,
    Password: document.getElementById("inputPassword").value,
  };
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );

  var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.clientId,
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var userData = {
    Username: document.getElementById("inputUsername").value,
    Pool: userPool,
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      console.log(accessToken);
      window.localStorage.setItem(
        "email",
        document.getElementById("inputUsername").value
      );
      window.location.href = "/index.html";
    },
    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
  });
}

// profile

var data = {
  UserPoolId: _config.cognito.userPoolId,
  ClientId: _config.cognito.clientId,
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

var cognitoUser = userPool.getCurrentUser();

// search
async function fetchData() {
  console.log("Fetch Data executed");
  let query = document.getElementById("searchInput").value;
  let url = `<add here>?q=${query}`; // add the url of search api resource
  axios(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response);

      let data = response.data.hits.hits;
      console.log(data);
      let productDiv = document.getElementById("productList");
      let ht = ``;
      data.forEach((product) => {
        console.log("product", product);
        console.log(product._source.Name.S);
        ht += ` <div class="col-4">
            <img src=${product._source.Image_url.S} alt="" />
                    <h4>${
                      product._source.Name.S
                        ? product._source.Name.S
                        : "Not Available"
                    }</h4>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                <p>${
                  product._source.Color.S
                    ? product._source.Color.S
                    : product._source.Color.L
                    ? generateStringFromArray(product._source.Color.L)
                    : "Not Available"
                }</p>
            </div>`;
      });
      productDiv.innerHTML = ht;
    })
    .catch((error) => {
      console.log(error);
      console.log("This is the error block");
    });
}

