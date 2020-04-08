module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest": true
    },
    "extends": ["eslint-config-airbnb", "airbnb/hooks"],
    "rules": {
        "indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
        "no-tabs": 0,
        "react/no-did-update-set-state": 0,
        "react/static-property-placement": 0, // maybe re-enable?
        "react/prop-types": 0,
        "react/jsx-indent": [2, "tab"],
        "react/jsx-indent-props": [2, "tab"],
        "comma-dangle": 0, // WTF air-bnb?!
        "import/no-unresolved": [2, {
            ignore: [
                "^style/*",
                "^components/*",
                "^common/*",
                "^actions/*",
                "^reducers/*",
                "^containers/*",
                "^entry-points/*",
                "^restapi/*",
                "^sagas/*",
                "^store/*",
                "^theme/*",
                "^vpop/*"
            ]}],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "no-console": "off",
        "curly": [2, "all"],
        "brace-style": [2, "stroustrup"],
		"semi": ["error", "always"],
		"react/jsx-props-no-spreading": [2, {
			"custom": "ignore"
		}],
		"react/jsx-fragments": [2, "syntax"]
    },
    "parserOptions": {
        "sourceType": "module"
	},
	"parser": "babel-eslint"
};