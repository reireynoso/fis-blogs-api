# FIS Blogs Management App

# ToDo
- Store key user information in your database
- Remove the code from the URL
- Work out sessions and cookies to persist connection
- Test with react

# Setting Up Github OAuth
- Register app on github Oauth to grab client id and secret
- Follow instructions: https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps
- Bonus: https://www.graphql.college/implementing-github-oauth-flow/
- General flow is to get the code from github authorize, providing the client id and redirect_uri in the URL.
- Once the code is returned and redirected back, make request to backend getting the token and using the token to pull up in the github information. 