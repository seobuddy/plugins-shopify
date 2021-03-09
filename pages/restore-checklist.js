import {Card, Page} from '@shopify/polaris';
import gql from "graphql-tag";
import {graphql} from "react-apollo";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router'
import ShopIdExtractor from "../components/ShopIdExtractor";

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

function RestoreChecklist(props) {

    const [keySet, setKeySet] = useState();

    const router = useRouter();
    let buff = new Buffer(router.query.parameters.split("").reverse().join(""), 'base64');
    let text = buff.toString('ascii');
    let credentials = JSON.parse(text);

    useEffect(() => {
        props.mutate({
            variables: {
                "input": {
                    "namespace": "seobuddy",
                    "key": "seobuddyAccessToken",
                    "valueInput": {
                        "value": credentials.access_token,
                        "valueType": "STRING"
                    }
                }
            }
        }).then(() => {
            props.mutate({
                variables: {
                    "input": {
                        "namespace": "seobuddy",
                        "key": "seobuddyRefreshToken",
                        "valueInput": {
                            "value": credentials.refresh_token,
                            "valueType": "STRING"
                        }
                    }
                }
            }).then(() => {
                props.mutate({
                    variables: {
                        "input": {
                            "namespace": "seobuddy",
                            "key": "seobuddyProjectId",
                            "valueInput": {
                                "value": credentials.project_id,
                                "valueType": "STRING"
                            }
                        }
                    }
                }).then(() => {
                    setKeySet(true);
                    localStorage.removeItem('activatedShortId');
                });
            });
        });
    }, []);

    return keySet ? (
        <Page>
            <Card
                title="Restoration complete"
                primaryFooterAction={{
                    content: 'Go to the SEO Checklist',
                    url: '/?shop=' + props.shopOrigin
                }}
            >
                <Card.Section title="">SEO Checklist has been successfully restored</Card.Section>
            </Card>
        </Page>
    ) : 'Loading';
}

export default graphql(UPDATE_ACCESS_TOKEN)(RestoreChecklist);