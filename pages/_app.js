import App from 'next/app';
import Head from 'next/head';
import {AppProvider} from '@shopify/polaris';
import {Provider} from '@shopify/app-bridge-react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import ClientRouter from '../components/ClientRouter';
import RoutePropagator from "../components/RoutePropagator";
import '../style.css';

const client = new ApolloClient({
    fetchOptions: {
        credentials: 'include'
    },
});

class SeobuddyShopifyPlugin extends App {
    render() {
        const { Component, pageProps, shopOrigin } = this.props;

        const config = { apiKey: API_KEY, shopOrigin, forceRedirect: true };
        return (
            <React.Fragment>
                <Head>
                    <title>SeoBuddy SEO Checklist</title>
                    <meta charSet="utf-8" />
                </Head>
                <Provider config={config}>
                    <ClientRouter />
                    <AppProvider i18n={translations}>
                        <RoutePropagator />
                        <ApolloProvider client={client}>
                            <Component {...pageProps} shopOrigin={shopOrigin} apolloClient={client} apiHost="https://seobuddy.com"/>
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
    }
}

export default SeobuddyShopifyPlugin;