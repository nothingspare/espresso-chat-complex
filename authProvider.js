// A very simple authentication provider for Espresso Logic
//
// A JavaScript authentication provider must be a function returning an object
// with four functions, as shown here.
// See http://docs.espressologic.com/docs/logic-designer/security/authentication/custom-authentication-provider
// for a lot more details.

function AppAuthenticationProviderCreate() {

	// Default values for the configuration parameters
	var username = '';

	// This gets called with the user-specified values for the parameters described by getConfigInfo
	function configure(myConfig) {
		username = myConfig.username || 'Username';
	}
	/*
	var restCaller = new com.kahuna.logic.lib.rest.RestCaller(this);
	var response = restCaller.get(
		"http://localhost:8080/KahunaService/rest/el-local/wajbj/v1/", 
		{},//{filter: 'email=\'' + sanitizedEmail + '\''}, 
		{headers:{Authorization: "Espresso " + RUfi7jfwVJ9wVGal745j + ":1"}}
	);
	var user = JSON.parse(response);
	*/
	
	
	// This is the method called to do the authentication
	// The payload is an object with properties as defined by the getLoginInfo() call
	function authenticate(payload) {
		if (payload.unregistered) {
				var restCaller = new com.kahuna.logic.lib.rest.RestCaller(this);
				var response = restCaller.get(
					"http://localhost:8080/KahunaService/rest/el-local/wajbj/v1/users", 
					{},//{filter: 'email=\'' + sanitizedEmail + '\''}, 
					{headers:{Authorization: "Espresso " + /*payload.apikey*/ 'RUfi7jfwVJ9wVGal745j' + ":1"}}
				);
			return {
				errorMessage: null,
				roleNames: ['unregistered'],
				userInfo: response,
			};
		}
		else {
			if (payload.username && payload.apikey && payload.password) {
				return {
					errorMessage: null,
					userData: {username: payload.username},
					roleNames: ['user'],
				};
				//*
				//*/
			}
		}
		return;
		if (secretWord !== payload.password) {
			// Authentication fails
			return {
				errorMessage: 'You must enter the value "' + secretWord + '" (without the quotes)'
			};
		}

		// Success: the password was indeed the secret word
		return {
			errorMessage: null, // must be null for 'success'
			roleNames: ['Full access'], // Must correspond to actual roles in your project
			// Optional: if users can be identified by a string, it's useful to include it here
			userIdentifier: payload.username,
			// userData properties will be added to the API key for use in security
			userData:  { employeeId: 'A123456', region: 'US-west' },
			// userInfo properties will be returned to the caller along with the API key
			userInfo: { hairColor: "blue", height: "tallish"},
			// How long the resulting API key should be valid for
			keyLifetimeSeconds: 3600,
			// Optionally, we can let the system know when the user's last login was
			lastLogin: new Date(1999, 11, 31),  // Caution: month 0 = January, 1 - Feb etc
			// Optionally, we can also let the system know what the last login's IP address was
			lastLoginIP: "12.34.56.78"
		};
	}

	// This gets called when a client needs to know what information is required to authenticate.
	// The information returned by this will be provided to the client, who can then make a call
	// with values for the parameters declared here.
	function getLoginInfo() {
		return {
			fields: [
				{
					name: 'password',
					display: helloPhrase,
					description: 'Enter "' + secretWord + '" without quotes',
					type: 'text',
					length: 30
				}
			],

			// You can optionally include up to two links here, which might describe how
			// to reset a password, or how to obtain a login.
			links: [
				{
					display: 'Forgot Password?',
					href : 'http://en.wikipedia.org/wiki/Password'
				},
				{
					display: 'Register for an account',
					href: 'http://en.wikipedia.org/wiki/Talk_like_a_pirate_day'
				}
			]
		};
	}

	// This gets called when the authentication provider is initialized.
	// It should return an object describing what parameters it needs to get configured.
	// The user will fill in these parameters in the Logic Designer, and when they save,
	// the configure function (above) will get called with values for these parameters.
	function getConfigInfo() {
		return {
			// The current values for the configuration parameters described below.
			// This allows the Logic Designer to show these values as already set by default.
			current: {
				username: '',
				password: ''
			},

			// The specification for our configuration parameters.
			// In this example, we want a phrase to greet the user, and
			// a secret word you must know to get in.
			fields: [
				{
					name: 'helloPhrase',
					display: 'Hello Phrase',
					description: 'The phrase to display to the user',
					length: 40,
					helpURL: 'http://www.acme.com/help1'
				},
				{
					name: 'secretWord',
					display: 'Secret Word',
					description: 'The word that the user must know',
					length: 40,
					helpURL: 'http://www.acme.com/help2'
				}
			]
		};
	}

	// This is the authentication object that Espresso Logic will call on your behalf.
	// getConfigInfo() is used by the Logic Designer
	// getLoginInfo() is invoked when the client calls
	// authenticate() is used when you post to @authentication Live Browser (and your own applications)
	return {
		configure: configure,
		authenticate: authenticate,
		getLoginInfo: getLoginInfo,
		getConfigInfo: getConfigInfo
	};
}
