//----------------------------------------------------------------------------------------------------------------------
/// AuthService
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import $http from 'axios';
import Promise from 'bluebird';

import errors from '../../components/errors/errors';
import routeSvc from '../../components/route/routeService';
import stateSvc from '../../components/state/stateService';

//----------------------------------------------------------------------------------------------------------------------

class AuthService {
    constructor()
    {
        // See if our session is still valid.
        this.loading = $http.get('/users')
            .then((response) =>
            {
                this.user = response.data;
            })
            .catch((response) =>
            {
                if(response.status != 403)
                {
                    console.error('Error getting current user', response);
                } // end if
            });
    } // end constructor
    
    get user(){ return stateSvc.user; }
    set user(val){ stateSvc.user = val; }

    //------------------------------------------------------------------------------------------------------------------
    // External
    //------------------------------------------------------------------------------------------------------------------
    
    login(data)
    {
        return $http.post('/auth/login', data)
            .then((response) =>
            {
                this.user = response.data;
                
                if(routeSvc.path == '/')
                {
                    routeSvc.go('/dashboard');
                } // end if
            })
            .catch((error) =>
            {
                if(error.status == 401)
                {
                    return Promise.reject(new errors.LoginFailure(data.email));
                }
                else
                {
                    console.error('error:', error);
                    return Promise.reject(error.data);
                } // end if
            });
    } // end login
    
    logout()
    {
        return $http.post('/auth/logout')
            .then(() =>
            {
                this.user = undefined;
                routeSvc.go('/');
            });
    } // end logout
    
    forgot(email)
    {
        return $http.post(`/users/${ email }/forgot`);
    } // end forgot

    reset(token, data)
    {
        console.log('data?', data);
        return $http.post(`/users/reset/${ token }`, data)
            .then(() =>
            {
                // We should be logged in now
                return $http.get('/users')
                    .then((response) =>
                    {
                        routeSvc.go('/dashboard');
                        this.user = response.data;
                    })
                    .catch(() => { routeSvc.go('/'); });
            })
            .catch((error) =>
            {
                if(error.status == 403)
                {
                    return Promise.reject(new errors.TokenValidation(token));
                }
                else if(error.status == 422)
                {
                    return Promise.reject(new errors.PasswordMismatch());
                }
                else
                {
                    console.error('error:', error);
                    return Promise.reject(error.data);
                } // end if
            });
    } // end reset

    register(data)
    {
        return $http.post('/users', data)
            .then(() =>
            {
                // We should be logged in now
                return $http.get('/users')
                    .then((response) =>
                    {
                        routeSvc.go('/dashboard');
                        this.user = response.data;
                    })
                    .catch(() => { routeSvc.go('/'); });
            })
            .catch((error) =>
            {
                if(error.status == 403)
                {
                    return Promise.reject(new errors.CaptchaValidation());
                }
                else if(error.status == 409)
                {
                    return Promise.reject(new errors.UserExists(data.email));
                }
                else if(error.status == 422)
                {
                    return Promise.reject(new errors.PasswordMismatch());
                }
                else
                {
                    console.error('error:', error);
                    return Promise.reject(error.data);
                } // end if
            });
    } // end register
} // end AuthService

//----------------------------------------------------------------------------------------------------------------------

export default new AuthService();

//----------------------------------------------------------------------------------------------------------------------