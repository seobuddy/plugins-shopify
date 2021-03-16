import {Card, Page} from '@shopify/polaris';
import gql from "graphql-tag";
import {graphql} from "react-apollo";
import React, {useEffect, useState} from "react";

const UPDATE_ACCESS_TOKEN = gql`
  mutation privateMetafieldUpsert($input: PrivateMetafieldInput!) {
      privateMetafieldUpsert(input: $input) {
        privateMetafield {
          id
          key
          namespace
        }
        userErrors {
          field
          message
        }
      }
    }
`;

function CheckoutComplete(props) {

    const [keySet, setKeySet] = useState();

    // useEffect(() => {
    //     props.mutate({
    //         variables: {
    //             "input": {
    //                 "namespace": "seobuddy",
    //                 "key": "seobuddyAccessToken",
    //                 "valueInput": {
    //                     "value": localStorage.getItem('seobuddyAccessToken' + localStorage.getItem('activatedShortId')),
    //                     "valueType": "STRING"
    //                 }
    //             }
    //         }
    //     }).then(() => {
    //         props.mutate({
    //             variables: {
    //                 "input": {
    //                     "namespace": "seobuddy",
    //                     "key": "seobuddyRefreshToken",
    //                     "valueInput": {
    //                         "value": localStorage.getItem('seobuddyRefreshToken' + localStorage.getItem('activatedShortId')),
    //                         "valueType": "STRING"
    //                     }
    //                 }
    //             }
    //         }).then(() => {
    //             props.mutate({
    //                 variables: {
    //                     "input": {
    //                         "namespace": "seobuddy",
    //                         "key": "seobuddyProjectId",
    //                         "valueInput": {
    //                             "value": localStorage.getItem('seobuddyProjectId' + localStorage.getItem('activatedShortId')),
    //                             "valueType": "STRING"
    //                         }
    //                     }
    //                 }
    //             }).then(() => {
    //                 setKeySet(true);
    //                 localStorage.removeItem('activatedShortId');
    //             });
    //         });
    //     });
    // }, []);

    return (
        <Page>
            <Card
                title="Checkout complete"
                primaryFooterAction={{
                    content: 'Go to the SEO Checklist',
                    url: '/steps?shop=' + props.shopOrigin
                }}
            >
                <Card.Section title="">SEO Checklist has been successfully activated</Card.Section>
            </Card>
        </Page>
    );
}

export default CheckoutComplete;