import {Card, Page} from '@shopify/polaris';
import gql from 'graphql-tag';

const GET_SHOP_INFO = gql`
    {
        shop {
            name
            email
            primaryDomain {
              host
              url
            }
            url
            myshopifyDomain
        }
    }
`;

const GET_SHOP_INFO2 = gql`
    {
        shop {
            name
            email
            primaryDomain {
              host
              url
            }
        }
    }
`;

const UPDATE_PROJECT_ID = gql`
  mutation privateMetafieldUpsert($input: PrivateMetafieldInput!) {
      privateMetafieldUpsert(input: $input) {
        privateMetafield {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
`;

class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            shopOrigin: props.shopOrigin
        };
    }

    render() {
        return (
            <Page
                title="SETUP"
            >
                <Card
                    title="No subscription"
                    primaryFooterAction={{
                        content: 'Activate SEO Checklist',
                        url: '/buy-checklist?shop=' + this.state.shopOrigin
                    }}
                >
                    <Card.Section title="">
                        Use this option if you have not bought SEO Checklist before and don't have SEOBUDDY account.
                    </Card.Section>
                </Card>

                <Card
                    title="I have subscription"
                    primaryFooterAction={{content: 'Link SEOBUDDY account'}}
                >
                    <Card.Section title="">
                        Use this option if you have bought SEO Checklist access before and want to use it inside Shopify.
                    </Card.Section>
                </Card>
            </Page>
        );
    }
}
// class Setup extends React.Component {
//
//     render() {
//         return (
//             <Query query={GET_SHOP_INFO}>
//                 {({ data, loading, error }) => {
//                     if (loading) return <div>Loading…</div>;
//                     if (error) return <div>{error.message}</div>;
//                     console.log(data);
//                     return (
//                         <Query query={GET_SHOP_INFO2}>
//                             {({ data, loading, error }) => {
//                                 if (loading) return <div>Loading…</div>;
//                                 if (error) return <div>{error.message}</div>;
//                                 console.log(data);
//                                 return (
//                                     <Card>
//                                         <p>Email 3: {data.shop.email}</p>
//                                     </Card>
//                                 );
//                             }}
//                         </Query>
//                     );
//                 }}
//             </Query>
//         );
//     }
// }

export default Setup;