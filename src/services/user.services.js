import {config} from '../config';
import {authHeader} from '../helpers';

export const userService={
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete:_delete
};
function login(username, password){
    const requestOptions={
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username,password})
    }
    return fetch(`${config.apiUrl}/auth/authenticate`,requestOptions)
            .then(handleResponse)
            .then(user=>{
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user',JSON.stringify(user));
                return user;
            });
}

function logout(){
     // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll(){
    const requestOptions={
        method:'GET',
        header:authHeader()
    };
    return fetch(`${config.apiUrl}/auth/`,requestOptions)
            .then (handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/auth/${id}`, requestOptions).then(handleResponse);
}

function register(user){
        const requestOptions={
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(user)
        }

        return fetch(`${config.apiUrl}/auth/register`,requestOptions)
                .then(handleResponse);
}

function update(user){
    const requestOptions={
        method:'PUT',
        headers:{...authHeader(),'Content-Type':'application/json'},
        body: JSON.stringify(user)
    }
    return fetch(`${config.apiUrl}/auth/${user.id}`,requestOptions)
            .then(handleResponse);
}
// prefixed function name with underscore because delete is a reserved word in javascript

function _delete(id){
    const requestOptions={
        method:'DELETE',
        headers:authHeader()
    }
    return fetch(`${config.apiUrl}/auth/${id}`,requestOptions)
        .then(handleResponse);
}

function handleResponse(response){
    return response.text().then(text=>{
        const data =text && JSON.parse(text);
        if(!response.ok){
            if(response.status===401){
                logout();
                //location.reload(true);
            }
            const error=(data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;

    });
}