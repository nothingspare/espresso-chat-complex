// A very simple authentication provider for Espresso Logic
//
// A JavaScript authentication provider must be a function returning an object
// with four functions, as shown here.
// See http://docs.espressologic.com/docs/logic-designer/security/authentication/custom-authentication-provider
// for a lot more details.

function AppAuthenticationProviderCreate() {

	// Default values for the configuration parameters
	var dbUrl = '';
	var database = '';
	var user = '';
	var password = '';

	// This gets called with the user-specified values for the parameters described by getConfigInfo
	function configure(myConfig) {
		dbUrl = myConfig.dbUrl || '';
		database = myConfig.database || '';
		user = myConfig.user || '';
		password = myConfig.password || '';
	}
	
	// This is the method called to do the authentication
	// The payload is an object with properties as defined by the getLoginInfo() call
	function authenticate(payload) {
		if (payload.unregistered) {
			return {
				errorMessage: null,
				roleNames: ['unregistered']
			};
		}
		var scriptRunner = new com.kahuna.logic.lib.sql.ScriptRunner(dbUrl + '/' + database, database, user, password);
		var result = scriptRunner.query('SELECT * FROM users WHERE username = "' + payload.username + '" AND password = md5("' + payload.password + '")');
		if (result) {
			try {
				var json = JSON.parse(result);
				return {
					errorMessage: null,
					roleNames: ['user'],
					userData: {
						username: json[0].username
					},
					userInfo: {
						id: json[0].id,
						username: json[0].username,
						email: json[0].email
					}
				};
			} catch (e) {
				return {
					errorMessage: 'No user found.'
				};
			}
		}
	}

	// This gets called when a client needs to know what information is required to authenticate.
	// The information returned by this will be provided to the client, who can then make a call
	// with values for the parameters declared here.
	function getLoginInfo() {
		//@login_info
		return {
			fields: [
				{
					name: 'password',
					display: password,
					description: 'Enter "' + password + '" without quotes',
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
				user: user,
				password: password,
				dbUrl: dbUrl,
				database: database
			},

			// The specification for our configuration parameters.
			// In this example, we want a phrase to greet the user, and
			// a secret word you must know to get in.
			fields: [
				{
					name: 'dbUrl',
					display: 'Database URL',
					description: 'Database URL',
					length: 64,
					helpURL: ''
				},
				{
					name: 'database',
					display: 'Database Name',
					description: 'Database Name',
					length: 64,
					helpURL: ''
				},
				{
					name: 'user',
					display: 'Database User',
					description: 'Database User',
					length: 64,
					helpURL: ''
				},
				{
					name: 'password',
					display: 'User Password',
					description: 'User Password',
					length: 64,
					helpURL: ''
				},
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
