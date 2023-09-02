const {Router} = require("express");
const routes = Router();
const searchGoogleControllers = require("./controllers/search_google");

routes.get("/search_google",searchGoogleControllers.getSearchGoogle);

module.exports = routes;