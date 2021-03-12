import {Button, Card, Form, FormLayout, Page, TextField} from '@shopify/polaris';
import gql from 'graphql-tag';
import React from "react";
import ShopIdExtractor from "../components/ShopIdExtractor";

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

class AutoActivateChecklist extends React.Component {

    constructor(props) {
        super(props);
        this.apiHost = props.apiHost;
        this.apolloClient = props.apolloClient;

        this.state = {
            email: '',
            password: '',
            url: '',
            originalUrl: '',
            projectName: '',
            success: false,
            error: false,
            accountExists: false,
            loginError: false,
            showProjects: false,
            projectList: null,
            shopId: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectProject = this.selectProject.bind(this);
    }

    componentDidMount() {
        if ( window.self === window.top )
        {
            return;
        }

        this.apolloClient.query({
            query: GET_SHOP_INFO
        }).then((result) => {
            this.setState({shopId: result.data.shop.id});
            let shortIdentifier = ShopIdExtractor.extract(this.state.shopId);
            if (localStorage.getItem('seobuddyProjectId' + shortIdentifier) === null || localStorage.getItem('seobuddyProjectId' + shortIdentifier) === 'undefined') {
                let data = new FormData();
                data.append('sign_up[firstName]', 'John');
                data.append('sign_up[lastName]', 'Doe');
                data.append('sign_up[password]', Math.random().toString(36).substring(2));
                data.append('sign_up[email]', result.data.shop.email);
                data.append('sign_up[projectName]', result.data.shop.name);
                data.append('sign_up[projectUrl]', result.data.shop.primaryDomain.url);
                data.append('sign_up[remoteSystem]', 'shopify');
                data.append('sign_up[remoteId]', result.data.shop.id);
                this.state.originalUrl = result.data.shop.primaryDomain.host;

                fetch(this.apiHost + "/sign-up-full", {
                    body: data,
                    method: "post"
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data.hasOwnProperty('success') && data.success) {
                        localStorage.setItem('seobuddyAccessToken' + shortIdentifier, data.accessToken);
                        localStorage.setItem('seobuddyRefreshToken' + shortIdentifier, data.refreshToken);
                        localStorage.setItem('seobuddyProjectId' + shortIdentifier, data.projectId);
                        localStorage.setItem('activatedShortId', shortIdentifier);
                        document.location.href = '/checkout-complete?shop=' + this.state.originalUrl;
                    } else {
                        this.setState({accountExists: true})
                    }
                });
            }
        });
    }

    handleChange = (field) => {
        return (value) => this.setState({ [field]: value });
    };

    selectProject = (event) => {
        let data = new FormData();
        data.append('activate_remote[email]', this.state.email);
        data.append('activate_remote[password]', this.state.password);
        data.append('activate_remote[projectId]', event.currentTarget.id);
        data.append('activate_remote[remoteSystem]', 'shopify');
        data.append('activate_remote[remoteId]', this.state.shopId);

        fetch(this.apiHost + "/activate-remote", {
            body: data,
            method: "post"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            let shortIdentifier = ShopIdExtractor.extract(this.state.shopId);

            if (data.hasOwnProperty('success') && data.success) {
                localStorage.setItem('seobuddyAccessToken' + shortIdentifier, data.accessToken);
                localStorage.setItem('seobuddyRefreshToken' + shortIdentifier, data.refreshToken);
                localStorage.setItem('seobuddyProjectId' + shortIdentifier, data.projectId);
                localStorage.setItem('activatedShortId', shortIdentifier);
                document.location.href = '/checkout-complete?shop=' + this.state.originalUrl;
            } else {
                this.setState({accountExists: true})
            }
        });
    };

    handleSubmit(event) {
        let data = new FormData();
        data.append('login[email]', this.state.email);
        data.append('login[password]', this.state.password);

        fetch(this.apiHost + "/management-api/project/get-list-for-user",{
            body: data,
            method: "post"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.success) {
                this.setState({projectList: data.projects});
                this.setState({loginError: false});
                this.setState({showProjects: true});
            } else {
                this.setState({loginError: true});
            }
        });

        event.preventDefault();
    }

    render() {
        return this.state.success ? (
            <Page>
                <Card
                    title="Checkout complete"
                    primaryFooterAction={{
                        content: 'Go to the SEO Checklist',
                        url: '/?shop=' + props.shopOrigin
                    }}
                >
                    <Card.Section title="">SEO Checklist has been successfully activated</Card.Section>
                </Card>
            </Page>
        ) : (this.state.error ? (
                <Page>
                    <Card
                        title="Error occured"
                    >
                        <Card.Section title="">Sorry, there was error activating SEO Checklist</Card.Section>
                    </Card>
                </Page>
            )
          : (this.state.accountExists ? (this.state.showProjects ?
                (
                    <Page>
                        <Card
                            title="Select project to link to"
                        >
                            <Card.Section title="">Please select one of existing projects to use</Card.Section>
                            <Card.Section title="">
                                {Object.entries(this.state.projectList).map(([key, project]) => (
                                    <Card sectioned
                                          title={project.name}
                                          key={project.id}
                                          primaryFooterAction={
                                              {
                                                  content: 'Select',
                                                  id: project.id,
                                                  onAction: this.selectProject
                                              }
                                          }
                                    >
                                        {project.domain}
                                    </Card>
                                ))}
                            </Card.Section>
                        </Card>
                    </Page>
                ) :
                (
                    <Page>
                        <Card
                            title="You need to login"
                        >
                            <Card.Section title="">You need to login to your SEO Buddy account</Card.Section>
                            <Card.Section title="">
                                <Form onSubmit={this.handleSubmit}>
                                    <FormLayout>
                                        <div className={'error ' + (this.state.loginError ? '' : 'hidden')}>
                                            Invalid credentials
                                        </div>
                                        <TextField
                                            value={this.state.email}
                                            onChange={this.handleChange('email')}
                                            label="Email"
                                            type="email"
                                            helpText={
                                                <span>
                                                          Enter your SEO Buddy login
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
                                                          Enter your SEO Buddy password.
                                                        </span>
                                            }
                                        />
                                        <Button submit>Login</Button>
                                    </FormLayout>
                                </Form>
                            </Card.Section>
                        </Card>
                    </Page>
                ) )
            : 'Loading'));
    }
}

export default AutoActivateChecklist;

