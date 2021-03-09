import {List, Card, Layout, Page} from '@shopify/polaris';
import Step from "../components/checklist/Step";
import gql from "graphql-tag";
import ShopIdExtractor from "../components/ShopIdExtractor";
import React from "react";

const GET_SHOP_INFO = gql`
    {
        shop {
            id
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

const GET_METAFIELDS = gql`
    query GET_METAFIELDS($shopId: ID!){
      privateMetafields(first:10, owner: $shopId) {
        edges {
          node {
            id
            key
            value
          }
        }
      }
    }
`;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.apolloClient = props.apolloClient;
        this.apiHost = props.apiHost;
        this.state = {
            error: null,
            isLoaded: false,
            notActivated: false,
            items: [],
            shortId: null,
            shopOrigin: props.shopOrigin
        };
    }

    loadChecklist() {
        if (localStorage.getItem('seobuddyProjectId' + this.state.shortId) === null) {
            this.setState({
                notActivated: true
            });
        }
        fetch(
            this.apiHost + "/api/seo-checklist/steps/" + localStorage.getItem('seobuddyProjectId' + this.state.shortId),
            {
                method: 'get',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('seobuddyAccessToken' + this.state.shortId)
                })
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items,
                        categories: result.categories
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
            this.apolloClient.query({
                    query: GET_SHOP_INFO
                })
                .then((result) => {

                    let shopId = result.data.shop.id;
                    let shortId = ShopIdExtractor.extract(result.data.shop.id);
                    this.setState({shortId: shortId});
                    if (localStorage.getItem('seobuddyProjectId' + shortId) === null) {
                        this.apolloClient.query({
                            query: GET_METAFIELDS,
                            variables: {
                                shopId: shopId
                            }
                        }).then((result) => {
                            for(let i in result.data.privateMetafields.edges) {
                                let edge = result.data.privateMetafields.edges[i];
                                localStorage.setItem(edge.node.key + shortId, edge.node.value);
                            }
                            this.loadChecklist();
                        });
                    } else {
                        this.loadChecklist();
                    }
                });
    }

    render() {
        let { error, isLoaded, notActivated, items, categories } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading checklist...</div>;
        } else if (notActivated) {
            return (
                <Page>
                    <Card
                        title="Checklist not activated properly"
                        primaryFooterAction={{
                            content: 'Restart activation',
                            url: '/auth?shop=' + this.state.shopOrigin
                        }}
                    >
                        <Card.Section title="">You need to complete payment to activate SEO Checklist.</Card.Section>
                    </Card>
                </Page>
            )
        } else {
            return (
                <Page fullWidth>
                    <Layout>
                        <Layout.Section>
                            <Card title="Welcome to The SEO Checklist by SEOBUDDY" sectioned>
                                <p className='seobuddy'>You can use this link to <a href='https://docs.google.com/spreadsheets/d/1NNtc9LjOSnEeNoGd2LjgQX3EL9te5qp8IpO6oOcAaEs/edit?usp=sharing' target="_blank">Grab your copy of The SEO Checklist as a Google Sheet</a>.</p>
                                <p className='seobuddy'>
                                    This will open the Google Sheet (go to “File” and “Make a copy” to get your version).
                                    You’ll see every step you need to take. Plus a process document assigned to each step (this is The SOP Collection).
                                </p>
                                <p className='seobuddy'>Here are links to the other resources in your bundle:</p>
                                <List type="bullet">
                                    <List.Item><a href='https://drive.google.com/file/d/1ewxUcwoEWRMXny0r0AbNbmyC6d1fVh4L/view?usp=sharing' target="_blank">The SEO Checklist eBook</a> (PDF)</List.Item>
                                    <List.Item><a href='https://trello.com/b/E0CErN0p' target="_blank">The SEO Checklist Trello Board</a></List.Item>
                                    <List.Item><a href='https://drive.google.com/file/d/1wLySuXr0cDMVGhtsOJFvycFizIejP65q/view?usp=sharing' target="_blank">The 52 Weeks Content Strategy eBook</a> (PDF)</List.Item>
                                    <List.Item><a href='https://trello.com/b/djG8sCWP' target="_blank">The 52 Weeks Content Strategy Trello Board</a></List.Item>
                                    <List.Item><a href='https://docs.google.com/spreadsheets/d/1LnYKzfuCdd6pm01F6cpBkkPhSN3URzN8kyp7PG8b3n4/edit?usp=sharing' target="_blank">Content Calendar Checklist</a></List.Item>
                                </List>
                                <p className='seobuddy'>P.S. You’re now part of an amazing tribe of people working to improve their businesses and their lives. Come and join the community in our private Facebook group: <a href='https://www.facebook.com/groups/seobuddy.mastermind/' target="_blank">SEO Buddy Mastermind</a>.</p>
                            </Card>
                        </Layout.Section>
                        <Layout.Section>
                            {Object.entries(categories).map(([key, category]) => (
                                <Card sectioned title={category.name} key={category.id}>
                                    <div className="titles">
                                        <div className="title col-title">Title</div>
                                        <div className="title col-status">Status</div>
                                        <div className="title col-difficulty">Difficulty</div>
                                        <div className="title col-impact">Impact</div>
                                        <div className="title col-cost">Cost</div>
                                        <div className="title col-tools">Tools</div>
                                        <div className="title col-sop">SOP</div>
                                        <div className="title col-extra">Extra</div>
                                    </div>
                                    {Object.entries(items[category.id]).map(([key, item]) => (
                                        <Step key={item.id} data={item} shortId={this.state.shortId} apiHost={this.apiHost}/>
                                    ))}
                                </Card>
                            ))}
                        </Layout.Section>
                    </Layout>
                </Page>
            );
        }
    }
}

export default Index;