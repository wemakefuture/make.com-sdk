/* eslint-disable prefer-arrow/prefer-arrow-functions */
'use strict';
const { default: axios } = require('axios');

class Integromat {
  constructor(apiKey, rootEndpoint, teamId, organizationId) {
    // Set API's root endpoint
    this.loaded = false;
    this.vars = {};
    this.vars.rootEndpoint = rootEndpoint;
    this.vars.APIkey = apiKey;
    this.vars.teamId = teamId;
    this.vars.organizationId = organizationId;
  }

  load() {
    // ////////// Loads the API specification into functions
    return new Promise((resolve) => {
      // ////////// Import the specification
      this.vars.apiSpecs = require('./openapi.json');

      // ////////// Main loop goes thrue all the paths, creates the functions and puts it into the right path of the integromat object instance
      for (const [path, methods] of Object.entries(this.vars.apiSpecs.paths)) {
        for (const [method, values] of Object.entries(methods)) {
          if (!['get', 'post', 'delete', 'patch', 'put'].includes(method)) {
            // console.log(`Unknown method "${method}" will be ignored. `)
            continue;
          }
          // console.log(createKeyPath(path,method))
          const funct = produceFunction(path, method, this);
          createNestedObject(createKeyPath(path, method), funct, this);
        }
      }
      // ////////// Start of the helper functions
      // ////////// Returns a list of the path elments that will be used as keys for the javscript objects
      function createKeyPath(path, method) {
        const keyPath = [];
        const splittedPath = path.split('/');
        splittedPath.shift();
        for (let element of splittedPath) {
          if (element[0] == '{') {
            // ////////// Not a query string parameter
            element = 'for' + element[1].toUpperCase() + element.substring(2, element.length - 1);
            keyPath.push();
          }
          keyPath.push(dashToCamelCase(element));
        }
        keyPath.push(method);
        // console.log("- integromat."+keyPath.join(".")+"({object of params})")  //############## use this to pring the path
        return keyPath;
      }
      // ////////// Create an object that allows to go through the APIs path via using the . operator
      // ////////// The value (function in this case) is written in the object at the position of the path
      // ////////// Context shall be "this"
      function createNestedObject(keyPath, value, context) {
        let obj = context;
        // console.log("object: ",this.vars)
        const lastKeyIndex = keyPath.length - 1;
        let key;
        for (let i = 0; i < lastKeyIndex; ++i) {
          key = keyPath[i];
          if (!(key in obj)) {
            obj[key] = {};
          }
          obj = obj[key];
        }
        obj[keyPath[lastKeyIndex]] = value;
        return context[keyPath[0]];
      }
      // ////////// Insert values for path parameters  in curly brackets such as /data-stores/{dataStoreId}/data/{dataStoreKeyRecord}
      // ////////// Params is an object that which keys have to match the path parameters such as "dataStoreId"
      function insertPathParams(path, params) {
        const pathList = path.split('/');
        pathList.shift(); // ////////// get rid of first / in the path list
        for (let i = 0; i < pathList.length; i++) {
          if (pathList[i][0] == '{') {
            const parameterName = pathList[i].substring(1, pathList[i].length - 1);
            if (parameterName in params) {
              // ////////// Check if the parameter encountered in the path has also been set in the params object
              pathList[i] = params[parameterName];
              delete params[parameterName]; // ////////// Remove the params from the parameter list as the rest of the params will be written in the body for requests that are not get requests
            } else {
              // ////////// Throw error if the path parameter was not specified in params
              pathList[i] = 'unspecified';
              throw new Error('Error: Please specify the parameter "' + parameterName + '"!');
            }
          }
        }
        const result = {
          pathString: '/' + pathList.join('/'), // ////////// final string for the HTTP request
          remainingParams: params, // ////////// Remaining params that go into the body (post,put,update) or the query string (get)
        };
        return result;
      }
      // ////////// replaces for example "user-team-notifications" by "userTeamNotifications"
      function dashToCamelCase(input) {
        return input.replace(/-(.)/g, function (match, group1) {
          return group1.toUpperCase();
        });
      }
      // ////////// Function that creates the correct axios functions
      // ////////// Context needs to be "this" (the object)
      function produceFunction(path, method, context) {
        return async function (params) {
          // ////////// Prepare the path for the request and initialize some other variables
          const { pathString, remainingParams } = insertPathParams(path, params);
          let bodyParams = {};
          let queryParams = '';
          // ////////// Find out wheter params are to be put in path, query or body depending on HTTP request type
          if (method == 'get') {
            // ////////// Compose query string needed for get requests
            if (context.vars.teamId && context.vars.organizationId) {
              queryParams = `?teamId=${context.vars.teamId}&organizationId=${context.vars.organizationId}`;
            }
            else if (context.vars.teamId) {
              // automatically fill the team ID if desired
              queryParams = `?teamId=${context.vars.teamId}`;
            }
            else if (context.vars.organizationId) {
              // automatically fill the organization ID if desired
              queryParams = `?organizationId=${context.vars.organizationId}`;
            }
            for (const parameterName in remainingParams) {
              if (queryParams == '') {
                queryParams = `?${parameterName}=${remainingParams[parameterName]}`;
              } else {
                queryParams += `&${parameterName}=${remainingParams[parameterName]}`;
              }
            }
          }
          if (['post', 'patch', 'put'].includes(method)) {
            bodyParams = remainingParams;
            if (context.vars.teamId && context.vars.organizationId) {
              queryParams = `?teamId=${context.vars.teamId}&organizationId=${context.vars.organizationId}`;
            }
            else if (context.vars.teamId) {
              // automatically fill the team ID if desired
              // bodyParams.teamId = context.vars.teamId;  // apparently some endpoints do not like this
              queryParams = `?teamId=${context.vars.teamId}`; // also in the query params as connections post seems to need that
            }
            else if (context.vars.organizationId) {
              // automatically fill the organization ID if desired
              queryParams = `?organizationId=${context.vars.organizationId}`; // also in the query params as connections post seems to need that
            }
          }
          // ////////// Put together the request with the extracted parameters
          const requestConfig = {
            method: method,
            url: context.vars.rootEndpoint + pathString + queryParams,
            headers: {
              'content-type': 'application/json',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: 'Token ' + context.vars.APIkey,
            },
            data: bodyParams,
          };
          // /console.log("### Request Configuration: \n", requestConfig)

          // ////////// Error Handling for the request function
          // ////////// It is important to get the errors from the API because sometimes the documentation and what the API requests do not match...
          try {
            const response = await axios(requestConfig);
            return response.data;
          }
          catch (error) {
            console.log("Error while making the API Call", error)
            console.error("Error while making the API call !!!!!!!!!!!!")
            //console.log("Error while making the API Call", error)
            console.error(JSON.stringify(error.response.data, null, 4))
            //return "Error in call" + error.response
          }
        };
      }
      // ////////// Resolve the promis after everything is built :-)
      this.loaded = true;
      resolve(console.log('API loaded successfully!'));
    });
  }
}

// ////////// Some tests if the module is run directly
// ////////// Feel free to uncomment and test
if (typeof require !== 'undefined' && require.main === module) {
}
// ////////// So it can be imported ;-)
module.exports = Integromat;
