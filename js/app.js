// const _config = require ('./js/config.js')

var MenuItems = document.getElementById("MenuItems");
console.log(MenuItems)
MenuItems.style.maxHeight = "0px";
function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px"
    }
    else {
        MenuItems.style.maxHeight = "0px"
    }
}

function generateStringFromArray(arr) {
    let str = ''
    arr.forEach((a) => {
        str += `${a.S} `
    })
    return str
}

var data = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.clientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

var cognitoUser = userPool.getCurrentUser();

window.onload = function() {
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session){
            if (err) {
                alert(err);
                return;
            }
            console.log('session valididty: ' + session.isValid());

            cognitoUser.getUserAttributes(function(err,result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(result);
                let loginButton = document.getElementById('loginButton')
                loginButton.style.display = 'none'
                let logoutButton = document.getElementById('logoutButton')
                logoutButton.innerHTML = '<button onclick="signOut()" > Logout</button>'

            });
        });
    }
}

function signOut(){
    if (cognitoUser != null) 
    {
        window.localStorage.removeItem('email')
        cognitoUser.signOut();
        window.location.reload();
    }
}


// cognito
// import * as AWS from 'aws-sdk/global'
// import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

// var accessToken 
// var authenticationData = {Username: 'username', Password: 'password',};
// var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
// var poolData = {
//     UserPoolId: 'us-west-2_yrPaBPNDN', // Your user pool id here
//     ClientId: '1jd2iiedv41jo7dnad8cs8hj40', // Your client id here
// };
// var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
// var userData = {
//     Username: 'username',
//     Pool: userPool,
// };
// var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
// cognitoUser.authenticateUser(authenticationDetails, {
//     onSuccess: function (result) {
//         accessToken = result.getAccessToken().getJwtToken();

//         //POTENTIAL: Region needs to be set if not already set previously elsewhere.
//         AWS.config.region = '<us-west-2>';

//         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//             IdentityPoolId: 'us-west-2:a443c490-8663-4379-ae34-9f84ea4db8dd', // your identity pool id here
//             Logins: {
//                 // Change the key below according to the specific region your user pool is in.
//                 'cognito-idp.<us-west-2>.amazonaws.com/<us-west-2_yrPaBPNDN>': result
//                     .getIdToken()
//                     .getJwtToken(),
//             },
//         });

//         //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
//         AWS.config.credentials.refresh(error => {
//             if (error) {
//                 console.error(error)
//             } else {
//             }
//             // Instantiate aws sdk service objects now that the credentials have been updated.
//             // example: var s3 = new AWS.S3();
//             console.log('Successfully logged!');
//         })
//     },

//     onFailure: function (err) {
//         alert(err.message || JSON.stringify(err));
//     },
// })
// Initialize the Amazon Cognito credentials provider
// AWSCognito.config.region = 'us-west-2';
// // AWS.config.region = 'us-west-2'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-west-2:be1bf5c7-3116-4b59-abb9-d9d6eab5c870',
//     // Logins: {
//     //     'cognito-idp.us-west-2.amazonaws.com/us-west-2_yrPaBPNDN': 
//     //     result.getIdToken().getJwtToken()
//     // }
// });

// const getCurrentUser=() =>{
//     const userPool = new CognitoUserPool({
//      UserPoolId: 'us-west-2_yrPaBPNDN',
//      ClientId: '1jd2iiedv41jo7dnad8cs8hj40'
//     });
//     return userPool.getCurrentUser();
// }
// getCurrentUser()

// search
async function fetchData() {
    console.log("Fetch Data executed")
    let query = document.getElementById('searchInput').value
    let url = ` https://yszluxm1vb.execute-api.us-west-2.amazonaws.com/dev/search?q=${query}`
    axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`

        },
    })
        .then(response => {
            console.log(response);

            let data = response.data.hits.hits
            console.log(data);
            let productDiv = document.getElementById('productList')
            let ht = ``
            data.forEach((product) => {
                console.log("product", product)
                console.log(product._source.Name.S)
                ht +=
                    ` <div class="col-4">
            <img src=${product._source.Image_url.S} alt="" />
                    <h4>${product._source.Name.S ? product._source.Name.S : "Not Available"}</h4>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                <p>${product._source.Color.S ? product._source.Color.S : (product._source.Color.L ? (generateStringFromArray(product._source.Color.L)) : 'Not Available')}</p>
            </div>`
            })
            productDiv.innerHTML = ht
        }).catch(error => {
            console.log(error)
            console.log("This is the error block")
        })
}

