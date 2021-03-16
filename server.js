require('isomorphic-fetch');
const dotenv = require('dotenv');
const next = require('next');
const { createShopifyAuth, verifyToken, getQueryKey, redirectQueryString } = require('koa-shopify-auth-cookieless');
const { verifyRequest } = require('koa-shopify-auth-cookieless');
const session = require('koa-session');
const Koa = require('koa');
const Router = require('koa-router');

dotenv.config();
const { graphQLProxy, ApiVersion } = require('koa-shopify-graphql-proxy-cookieless');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const getShopInfo = require('./server/getShopInfo');
const getSeobuddyShopInfo = require('./server/getSeobuddyShopInfo');
const Shopify = require("@shopify/shopify-api");
const {toBase64} = require("next/dist/next-server/lib/to-base-64");
const jwt = require("jsonwebtoken");

const port = parseInt(process.env.PORT, 10) || 3001;
const ip = process.env.BIND_IP ||  '127.0.0.1';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST, APP_URL_PART } = process.env;

let buffer_1 = require("buffer");
let crypto = require("crypto");
// Utils
let atob = function (a) {
    if (a === void 0) { a = ''; }
    return buffer_1.Buffer.from(a, 'base64').toString('binary');
};
let base64UrlEncode = function (buffer) { return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); };
// is Verified and not expired
let isVerified = function (authorization, secret, cb) {
    // Early return for missing params
    if (!authorization || !secret) {
        return false;
    }
    // probably could be cleaned up this is dirty, straight string replace to remove the stragglers and split it. 
    let auth = authorization.replace('Bearer ', '').split('.');
    // will be passed to the optional call back
    let authObject = {
        header: atob(auth[0]),
        payload: atob(auth[1]),
        signature: auth[2]
    };
    let headerPayload = [auth[0], auth[1]].join('.');
    let signedBuffer = crypto.createHmac('sha256', secret).update(headerPayload).digest();
    let isVerified = authObject.signature === base64UrlEncode(signedBuffer);
    if (!isVerified) {
        return false;
    }
    // validate not expired
    let payload = JSON.parse(authObject.payload);
    let time = new Date().getTime() / 1000;
    let isExpired = payload.exp <= time;
    if (isExpired) {
        return false;
    }
    // call the optional callback with the authObject
    if (cb) {
        cb(authObject);
    }
    // return valid
    return true;
};

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    let persistedToken = null;
    server.use(session({ secure: true, sameSite: 'none' }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_locales'],
            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.state.shopify;
                persistedToken = accessToken;
                let redirectUrl;

                const returnUrl = 'https://' + shop + '/admin/apps/' + APP_URL_PART + `/auto-activate-checklist?shop=${shop}`;
                const shopInfo = await getShopInfo(accessToken, shop, returnUrl);
                const credentials = await getSeobuddyShopInfo(shopInfo.data.shop.id);
                if (credentials.success === false) {
                    redirectUrl = await getSubscriptionUrl(accessToken, shop, returnUrl);
                } else {
                    let credentialsHash = toBase64(JSON.stringify(credentials)).split("").reverse().join("");
                    redirectUrl = 'https://' + shop + '/admin/apps/' + APP_URL_PART + '/restore-checklist?parameters=' + credentialsHash + '&shop=' + shop;
                }
                ctx.redirect(redirectUrl);
            },
        }),
    );

    router.post("/graphql", async (ctx, next) => {
        const bearer = ctx.request.header.authorization;
        const secret = process.env.SHOPIFY_API_SECRET_KEY;
        const valid = isVerified(bearer, secret);
        if (valid) {
            const token = bearer.split(" ")[1];
            const decoded = jwt.decode(token);
            const shop = new URL(decoded.dest).host;

            const proxy = graphQLProxy({
                shop: shop,
                password: persistedToken,
                version: ApiVersion.October20,
            });
            await proxy(ctx, next);
        }
    });
    router.get("/", async (ctx, next) => {
        const shop = getQueryKey(ctx, "shop");
        // Retrieve token here
        // We are setting the state here explicity
        // for uniformity with ctx.state in createShopifyAuth method
        // State with this shape is used in
        // koa-shopify-auth-cookieless/utilites/getShopCredentials
        ctx.state = { shopify: { shop: shop, accessToken: persistedToken } };
        await verifyToken(ctx, next);
    });
    router.get("*", async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    });
    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(port, ip,() => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});