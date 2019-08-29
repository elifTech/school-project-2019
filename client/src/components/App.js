import React from 'react';
import PropTypes from 'prop-types';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.object,
  // eslint-disable-next-line
  store: PropTypes.any,
  // eslint-disable-next-line
  storeSubscription: PropTypes.any,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
    // eslint-disable-next-line
    store: PropTypes.any,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    const { context } = this.props;
    return context;
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    const { children } = this.props;
    return React.Children.only(children);
  }
}

export default App;
