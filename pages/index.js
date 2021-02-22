import {Card, Layout, Page} from '@shopify/polaris';
import Step from "../components/checklist/Step";
import gql from "graphql-tag";

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
            items: []
        };
    }

    loadChecklist() {
        fetch(
            this.apiHost + "/api/seo-checklist/steps/" + localStorage.getItem('seobuddyProjectId'),
            {
                method: 'get',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('seobuddyAccessToken')
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
        if (localStorage.getItem('seobuddyProjectId') === null) {
            console.log('Loading into cache');
            this.apolloClient.query({
                    query: GET_SHOP_INFO
                })
                .then((result) => {

                    let shopId = result.data.shop.id;
                    this.apolloClient.query({
                        query: GET_METAFIELDS,
                        variables: {
                            shopId: shopId
                        }
                    })
                        .then((result) => {
                            for(let i in result.data.privateMetafields.edges) {
                                let edge = result.data.privateMetafields.edges[i];
                                localStorage.setItem(edge.node.key, edge.node.value);
                            }
                            this.loadChecklist();
                        });
                });
        } else {
            this.loadChecklist();
        }

    }

    render() {
        let { error, isLoaded, items, categories } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading checklist...</div>;
        } else {
            return (
                <Page fullWidth>
                    <Layout>
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
                                        <Step key={item.id} data={item} apiHost={this.apiHost}/>
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