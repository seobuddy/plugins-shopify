import App from 'next/app';
import Head from 'next/head';
import {AppProvider} from '@shopify/polaris';
import {Provider} from '@shopify/app-bridge-react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import ApolloClient from "apollo-client";
import {ApolloProvider} from 'react-apollo';
import ClientRouter from '../components/ClientRouter';
import RoutePropagator from "../components/RoutePropagator";
import '../style.css';
import {authenticatedFetch} from "@shopify/app-bridge-utils";
import {createApp} from "@shopify/app-bridge";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";


class SeobuddyShopifyPlugin extends App {
    render() {
        const { Component, pageProps, shopOrigin, seobuddyApiKey, seobuddyApiHost } = this.props;

        const appDef = createApp({
            apiKey: seobuddyApiKey,
            shopOrigin: shopOrigin
        });

        const client = new ApolloClient({
            link: new HttpLink({
                credentials: 'same-origin',
                fetch: authenticatedFetch(appDef)
            }),
            cache: new InMemoryCache()
        });

        const config = { apiKey: seobuddyApiKey, shopOrigin, forceRedirect: true };
        return (
            <React.Fragment>
                <Head>
                    <title>
                        SEO Buddy's SEO Checklist
                    </title>
                    <meta charSet="utf-8" />
                </Head>
                <Provider config={config}>
                    <ClientRouter />
                    <AppProvider i18n={translations}>
                        <RoutePropagator />
                        <ApolloProvider client={client}>
                            <Component {...pageProps} shopOrigin={shopOrigin} apolloClient={client} apiHost={seobuddyApiHost}/>
                        </ApolloProvider>
                    </AppProvider>
                </Provider>
            </React.Fragment>
        );
    }
}

SeobuddyShopifyPlugin.getInitialProps = async ({ ctx }) => {
    return {
        shopOrigin: ctx.query.shop,
        seobuddyApiKey: process.env.SHOPIFY_API_KEY,
        seobuddyApiHost: process.env.API_HOST,
    }
}

export default SeobuddyShopifyPlugin;