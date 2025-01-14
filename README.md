![image](https://github.com/perceptronbd/treatme-server/assets/53243993/c0ffefe3-0fa0-4a23-a913-d5ab5499e3c6)

## $\color{#FFE338}\textsf{\kern{0.2cm}\normalsize POSTMAN LINK}$

[Click Here](https://crimson-meadow-173206.postman.co/workspace/Perceptron~829ae60e-bae6-46a2-88a7-160c203ffb0d/collection/24092891-9f414422-6192-4508-9b4b-97e903bcb3d1?action=share&creator=24092891&active-environment=24092891-2165f0ee-20b0-4400-be50-cb2b2ce80d23)

## Postman Environment Variable

```json
Variable: treatMe-v1,
Type: default,
initial_value:"localhost:5001/api/v1",
current_value:"localhost:5001/api/v1"
```

2. Extract the Access Token:

- In the `Tests/Scripts` tab of the `super-admin/login`,`refresh` & `restaurant/login` request, add the following script to extract the access token from the response headers and save it to an environment variable:

```javascript
// Extract the access token from the response headers
const accessToken = pm.response.headers.get("Authorization");

// Save the access token to an environment variable
pm.environment.set("accessToken", accessToken);
```

3. Set the Access Token for Subsequent Requests:

- For each subsequent request, go to the Headers tab and add a new header:
- - Key: Authorization
- - Value: {{accessToken}}
- This will automatically use the access token stored in the environment variable for all subsequent requests.

4. Remove AccessToken from Postman env

- In the `Tests/Scripts` tab of the `super-admin/logout` & `restaurant/logout` request, add the following script to remove the access token from the environment variable:

```javascript
// Check if the response status is 200 (OK)
if (pm.response.code === 200) {
  // Remove the access token from the environment variable
  pm.environment.unset("accessToken");
}
```
