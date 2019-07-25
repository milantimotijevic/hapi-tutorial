const Hapi = require('hapi');
const server = new Hapi.Server({
    port: '3000',
    host: 'localhost'
});

const fakeRepo = {
    findUserBySessionId: sessionId => {
        switch(sessionId) {
            case 'omglol': return { id: 'zomgmuhahah123', name: 'Harry Potter', role: 'ADMIN' };
            case 'hahayoumad': return { id: 'holycowwoofwoof', name:'Ron Weasley', role: 'USER' };
            default: return null;
        }

    },
};

module.exports = {
    start: async () => {
        server.auth.scheme('custom-scheme', function(server, options) {
            return {
                authenticate: async (request, h) => {
                    // throw new Error('OMG LOL');
                    // return h.unauthenticated(new Error('omg lol wtf haha?')); // this one passes the request to the next middleware, but marks it as unauthenticated apparently...
                    // return h.authenticated({credentials: {}}); //this one passes the request to the next 'middleware'; see how you can read these credentials
                    // return h.response({name: 'pera'}).code(200).takeover(); // this one finalizes the request
                    // return h.response({errMessage: 'La gente esta muy loca!'}).code(403).takeover(); //I guess this is a good way to handle 403...
                    const { session_id } = request.headers;
                    const user = fakeRepo.findUserBySessionId(session_id);

                    if (!user) {
                        return h.response({errMessage: 'You must log in'}).code(403).takeover();
                    }

                    return h.authenticated({credentials: {
                            user_id: user.id,
                            scope: [user.role] //refers to the scope set for this route; scope basically means role
                        }});
                }
            }
        });

        server.auth.strategy('custom-strategy', 'custom-scheme');
        server.auth.default('custom-strategy');

        // server.ext('onPostAuth', (request, h, error) => {
        //     console.log('onPostAuth triggered');
        //     return h.continue
        // });

        const routes = require('../routes');
        routes.forEach(route => {
            server.route(route);
        });

        server.start();
    }
};
