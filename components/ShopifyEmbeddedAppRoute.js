import {History} from '@shopify/app-bridge/actions'
import {Route} from 'react-router-dom'

function withShopifyEmbeddedAppPushState (WrappedComponent) {
    return class extends React.Component {
        static contextTypes = {
            polaris: PropTypes.object
        };

        componentWillReceiveProps (nextProps) {
            const app = this.context.polaris.appBridge
            const history = History.create(app)
            history.dispatch(History.Action.PUSH, nextProps.computedMatch.url)
        }

        render () {
            return <WrappedComponent {...this.props} />
        }
    }
}

const ShopifyEmbeddedAppRoute = withShopifyEmbeddedAppPushState(Route);

export default ShopifyEmbeddedAppRoute;