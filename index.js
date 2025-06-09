console.log(environment);

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = environment.CLIENT_ID;
//const API_KEY = environment.API_KEY;
const CALLBACK = environment.CALLBACK;
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';// https://www.googleapis.com/auth/gmail.metadata';

let tokenClient;
let gapiInited = false;
let gisInited = false;

localStorage.removeItem('nextPageToken');

/**
    * Callback after api.js is loaded.
*/
function loadGoogleAPI() {
    console.log("loadGoogleAPI()")
    gapi.load('client:auth', function () {
        console.log("Init GAPI Client")
        gapi.client.init({
            clientId: CLIENT_ID,
            discoveryDocs: [DISCOVERY_DOC]
        }).then(function () {
            gapiInited = true;
            // Set google credentials automatically if there is a current session (credentials saved on localStorage)
            let credentials = localStorage.getItem('credentials');
            if (credentials) {
                credentials = JSON.parse(credentials);
                gapi.client.setToken(credentials);
                sessionInit();
            } else {
                if (gapiInited && gisInited) {
                    sessionInit();
                }
            }
        }, function (error) {
            console.log(error);
            throw error;
        });
    });
}


/**
 * Callback after Google Identity Services are loaded.
 */
function loadGoogleTokenClient() {
    console.log("loadGoogleTokenClient()")
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (credentials) => {
            gisInited = true;
            if (credentials.error !== undefined) {
                throw (credentials);
            }
            // DON'T SAVE THE CREDENTIALS ON LOCAL STORAGE!!!
            localStorage.setItem('credentials', JSON.stringify(credentials));
            if (gapiInited && gisInited) {
                sessionInit();
            }
        },
        error_callback: (error) => {
            console.error(error);
            throw (error)
        }
    });
}


function sessionInit() {
    console.log("sessionInit()");
    enableSessionButtons();
    mapMessages({}, true);
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function enableSessionButtons() {
    console.log("enableSessionButtons()")
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('search').style.visibility = 'visible';
    document.getElementById('paginator').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    document.getElementById('refresh_button').style.visibility = 'visible';
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    console.log("handleAuthClick()")
    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function getMessages(queryParams) {
    let response;
    try {
        response = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
            ...queryParams
        });
    } catch (error) {
        handleError(error);
    }
    const parsedResponse = JSON.parse(response.body);
    const messages = parsedResponse.messages;
    if (!messages || messages.length == 0) {
        document.getElementById('content').innerText = 'No messages found.';
        return [];
    }
    return parsedResponse;
}

async function getMessageMetadata(messageId) {
    let response;
    try {
        response = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'metadata',
            metadataHeaders: ['Subject', 'Date']
        });
    } catch (error) {
        handleError(error);
    }
    const headers = JSON.parse(response.body).payload.headers;
    if (!headers) {
        handleError('No headers found.');
    }
    const output = headers.reduce((output, header) => {
        output[header.name] = header.value;
        return output;
    }, {});
    return output;
}

let messagesList = [];

async function mapMessages(queryParams, nextPage = false) {

    // Save queryParams to use it on "refresh" flow
    localStorage.setItem('queryParams', JSON.stringify(queryParams));

    let response = await getMessages(queryParams);

    // Save nextPageToken on response
    if (nextPage) {
        if (localStorage.getItem('nextPageToken')) {
            let currentPages = localStorage.getItem('nextPageToken').split(",");
            currentPages.push(response.nextPageToken);
            localStorage.setItem('nextPageToken', currentPages.join(","));
        } else {
            localStorage.setItem('nextPageToken', [response.nextPageToken]);
        }
    }

    let batches = [];
    let chunkedMessages = splitArrayIntoChunks(response.messages, 100);
    messagesList = [];

    for (const [key, chunk] of chunkedMessages.entries()) {

        // You're limited to 100 calls in a single batch request. If you must make more calls than that, use multiple batch requests.
        batches[key] = gapi.client.newBatch();

        chunk.map((message) => {
            const request = gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'metadata',
                metadataHeaders: ['Subject', 'Date']
            });
            batches[key].add(request);
        });

        await new Promise((resolve, reject) => {

            batches[key].execute(function (responseMap, rawBatchResponse) {
                if (responseMap.result?.error) {
                    reject(responseMap.result.error);
                    throw responseMap.result.error;
                }

                // REVISAR!!! Algunos mensajer retornan error ".filter((message) => (message.result))."
                let mappedMessages = JSON.parse(rawBatchResponse).filter((message) => (message.result)).map((message) => {
                    let result = message.result;
                    let payload = result.payload;
                    let headers = payload.headers;
                    console.log(headers)
                    return {
                        Subject: headers.find(header => header.name == "Subject")?.value || "",
                        Date: headers.find(header => header.name == "Date")?.value || "",
                        id: message.id,
                        threadId: result.threadId
                    }
                })

                messagesList.push(...mappedMessages);
                resolve();

            });

        })

    }

    // Sort messages list by date
    messagesList.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    console.log(messagesList.length)
    updateRenderMessagesList(messagesList.map((message) => `${message.Date} ${message.Subject} ${message.id} ${message.threadId} \n`))

}

function updateRenderMessagesList(output) {
    document.getElementById('content').innerText = output;
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('paginator').style.visibility = 'hidden';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
        document.getElementById('search').style.visibility = 'hidden';
        document.getElementById('refresh_button').style.visibility = 'hidden';

        localStorage.removeItem('credentials');
        localStorage.removeItem('nextPageToken');
    }
}

async function handleError(error) {
    if (error.status === 401) {
        // UNAUTHENTICATED
        // There is not a way to get and use a "refresh_token" using this logic on javascript https://stackoverflow.com/a/24468307/6774579
        document.getElementById("authorize_button").click();
    } else {
        throw error;
    }
}

function requestMessages(searchParams, nextPage) {
    let queryParams = localStorage.getItem('queryParams');
    queryParams = JSON.parse(queryParams);
    mapMessages({ ...queryParams, ...searchParams }, nextPage);
}

function getNewerMessages() {
    let currentPages = localStorage.getItem('nextPageToken').split(",");
    if (currentPages.length > 1) {
        // Get messages for the previous page
        currentPages = currentPages.slice(0, -1);
        localStorage.setItem('nextPageToken', currentPages.join(","));
        let pageToken = currentPages[currentPages.length - 1];
        requestMessages({ pageToken });
    } else if (currentPages.length === 1) {
        // Get messages from the first page
        localStorage.setItem('nextPageToken', []);
        requestMessages({}, true);
    }
}

function getOlderMessages() {
    let currentPages = localStorage.getItem('nextPageToken').split(",");
    let pageToken = currentPages[currentPages.length - 1];
    requestMessages({ pageToken }, true);
}

function filterMessages(q) {
    requestMessages({ q });
}

function handleRefreshClick() {
    requestMessages({});
}

function setPage(pageLength) {
    requestMessages({ maxResults: pageLength });
}

function splitArrayIntoChunks(arr, chunkSize) {
    let result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}