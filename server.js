require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const getShopInfo = require('./server/getShopInfo');
const getSeobuddyShopInfo = require('./server/getSeobuddyShopInfo');
const {toBase64} = require("next/dist/next-server/lib/to-base-64");

const port = parseInt(process.env.PORT, 10) || 3001;
const ip = process.env.BIND_IP ||  '127.0.0.1';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env;
app.prepare().then(() => {
    const server = new Koa();
    server.use(session({ secure: true, sameSite: 'none' }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_locales'],
            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.state.shopify;
                let redirectUrl;

                const returnUrl = HOST + `/auto-activate-checklist?shop=${shop}`;
                const shopInfo = await getShopInfo(accessToken, shop, returnUrl);
                const credentials = await getSeobuddyShopInfo(shopInfo.data.shop.id);
                if (credentials.success === false) {
                    redirectUrl = await getSubscriptionUrl(accessToken, shop, returnUrl);
                } else {
                    let credentialsHash = toBase64(JSON.stringify(credentials)).split("").reverse().join("");
                    redirectUrl = HOST + '/restore-checklist?parameters=' + credentialsHash + '&shop=' + shop;
                }
                ctx.redirect(redirectUrl);
            },
        }),
    );

    server.use(graphQLProxy({version: ApiVersion.October19}));
    server.use(verifyRequest());
    server.use(async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return
    });

    server.listen(port, ip,() => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});