import React from 'react';
import Router from 'react-router';
import { RouteHandler, Route, Navigation } from 'react-router';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink } from 'react-router-bootstrap';
import { HomePage, AboutPage, ContactPage } from './pages';

var remote = window.require('remote');
var runtime = remote.require('./core/runtime');

var _routes = runtime.routes.map(function (r) {
  var handler = window.require(r.handler);
  return <Route key={r.route} name={r.route} handler={handler}/>;
});

var _navbar = runtime.routes.filter(function (r) {
  return r.navbar;
});

const App = React.createClass({
  mixins: [ Navigation ],

  componentDidMount() {
    var ipc = window.require('ipc');
    ipc.on('transitionTo', function(routeName) {
      //this.transitionTo(routeName, { the: 'params' }, { the: 'query' });
      this.transitionTo(routeName);
    }.bind(this));
  },

  render() {
    var links = _navbar.map(function (r) {
      return (
        <NavItemLink key={r.route} to={r.route}>{r.text}</NavItemLink>
      );
    });
    function setSrcTo(url) {
      document.getElementById("pageFrame").src = url;
    }
    return (
      <div style={{
        width:"100%",
        height: "100%"
      }}>
        <div className="ui fixed menu">
          <div className="ui container">
            <div href="#" className="header item">
              <i className="cube large icon"></i> Workbox
            </div>

            <a href="#" className="item" onClick={()=>setSrcTo('https://www.gmail.com')}>
              <i className="google large icon popup" data-content="Gmail"></i>
            </a>
            <a href="#" className="item" onClick={()=>setSrcTo('https://slack.com/signin')}>
              <i className="slack large icon popup" data-content="Slack"></i>
            </a>
            <a href="#" className="item" onClick={()=>setSrcTo('https://www.github.com')}>
              <i className="github large icon popup" data-content="Github"></i>
            </a>
            <a href="#" className="item" onClick={()=>setSrcTo('https://news.ycombinator.com/news')}>
              <i className="hacker news large icon popup" data-content="Hacker news"></i>
            </a>

            <a href="#" className="ui right floated item" onClick={()=>setSrcTo('./settings.html')}>
              <i className="settings large icon popup"></i> Settings
            </a>
          </div>
        </div>

        <div style={{
          width:"100%",
          height: "100%"
        }}>
          <webview
              id="pageFrame"
              sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
              width="100%"
              height="100%">
          </webview>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="home" path="/" handler={HomePage} />
    <Route name="about" handler={AboutPage} />
    <Route name="contact" handler={ContactPage} />
    { _routes }
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.body);
});
