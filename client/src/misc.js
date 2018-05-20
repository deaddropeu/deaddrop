function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(response => response.json());
}

const misc = { postData };
export default  misc;