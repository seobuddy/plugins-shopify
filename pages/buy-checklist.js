import {Button, Card, Form, FormLayout, Page, TextField} from '@shopify/polaris';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Cookies, withCookies} from "react-cookie";
import {instanceOf} from "prop-types";
import ShopIdExtractor from "../components/ShopIdExtractor";

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
            id
        }
    }
`;

class BuyChecklist extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.apiHost = props.apiHost;

        this.state = {
            email: '',
            password: '',
            url: '',
            originalUrl: '',
            projectName: '',
            fetched: false,
            shortId: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        let data = new FormData();
        data.append('sign_up[firstName]', 'John');
        data.append('sign_up[lastName]', 'Doe');
        data.append('sign_up[password]', this.state.password);
        data.append('sign_up[email]', this.state.email);
        data.append('sign_up[projectName]', this.state.projectName);
        data.append('sign_up[projectUrl]', this.state.url);

        fetch(this.apiHost + "/sign-up-full",{
            body: data,
            method: "post"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            localStorage.setItem('seobuddyAccessToken' + this.state.shortId, data.accessToken);
            localStorage.setItem('seobuddyRefreshToken' + this.state.shortId, data.refreshToken);
            localStorage.setItem('seobuddyProjectId' + this.state.shortId, data.projectId);
            document.location.href = '/checkout-complete?shop=' + this.state.originalUrl
        });

        event.preventDefault();
    }

    handleChange = (field) => {
        return (value) => this.setState({ [field]: value });
    };

    render() {
        return (
            <Query query={GET_SHOP_INFO}>
                {({ data, loading, error }) => {
                    if (loading) return <div>Loading…</div>;
                    if (error) return <div>{error.message}</div>;

                    if (!this.state.fetched) {
                        this.state.email = data.shop.email;
                        this.state.url = data.shop.primaryDomain.url;
                        this.state.originalUrl = data.shop.primaryDomain.host;
                        this.state.projectName = data.shop.name;
                        this.state.password = '';
                        this.state.fetched = true;
                        this.state.shortId = ShopIdExtractor.extract(data.shop.id);
                    }

                    return (

                        <Page
                            title="Activate SEO Checklist"
                        >
                            <Card sectioned>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormLayout>
                                        <TextField
                                            value={this.state.email}
                                            onChange={this.handleChange('email')}
                                            label="Email"
                                            type="email"
                                            helpText={
                                                <span>
                                                  We’ll use this email address as your login to SEO Buddy app.
                                                </span>
                                            }
                                        />

                                        <TextField
                                            value={this.state.password}
                                            onChange={this.handleChange('password')}
                                            label="Password"
                                            type="password"
                                            helpText={
                                                <span>
                                                  Please provide password that you will use to login to SEO Buddy application.
                                                </span>
                                            }
                                        />

                                        <TextField
                                            value={this.state.url}
                                            onChange={this.handleChange('url')}
                                            label="Website URL"
                                            type="url"
                                            helpText={
                                                <span>
                                                  This is your website's URL address
                                                </span>
                                            }
                                        />

                                        <TextField
                                            value={this.state.projectName}
                                            onChange={this.handleChange('projectName')}
                                            label="Project name"
                                            type="text"
                                            helpText={
                                                <span>
                                                  This will be your project's name in SEO Buddy app.
                                                </span>
                                            }
                                        />

                                        <Button submit>Activate now</Button>
                                    </FormLayout>
                                </Form>
                            </Card>
                        </Page>
                    );
                }}
            </Query>
        );
    }
}

export default withCookies(BuyChecklist);

