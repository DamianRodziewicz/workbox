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

  getInitialState: function() {
    return {
      show: "welcome",
      items: [
        {icon: "google", name:"Google Apps", isActive:true, url: "https://mail.google.com"},
        {icon: "slack", name:"Slack", isActive:true,  url: "https://slack.com/signin"},
        {icon: "github", name:"Github", isActive:true,  url: "https://www.github.com"},
        {icon: "hacker news", name:"Hacker News", isActive:true, url: "https://news.ycombinator.com/news"},
        {icon: "hacker news", name:"test", isActive:false, url: "https://news.ycombinator.com/news"}
      ]
    }
  },

  componentDidMount() {
    var ipc = window.require('ipc');
    ipc.on('transitionTo', function(routeName) {
      this.transitionTo(routeName);
    }.bind(this));
  },

  setSrcTo(url) {
    var newState = this.state;
    newState.show = url;
    this.setState(newState);
  },
  setIsActive(val, index) {
    var newState = this.state;
    newState.items[index].isActive = val;
    this.setState(newState);
  },

  render() {
    var links = _navbar.map(function (r) {
      return (
        <NavItemLink key={r.route} to={r.route}>{r.text}</NavItemLink>
      );
    });
    $(document).ready(function() {
      $('.popup').popup({
          position: "bottom left"
      });
    });
    var menu = this.state.items
      .filter((menuItem) => menuItem.isActive)
      .map((menuItem, index) => {
        var classString = menuItem.icon + " large icon popup";
        return <a key={index} href="#" className="item" onClick={()=>this.setSrcTo(menuItem.url)}>
          <i className={classString} data-content={menuItem.url}></i>
        </a>;
      });
    var webview = <webview
        src={this.state.show}
        id="pageFrame"
        sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
        width="100%"
        height="100%">
    </webview>;

    var quotes=[
      "Live life to the fullest, and focus on the positive.",
      "For me the greatest beauty always lies in the greatest clarity.",
      "You can't depend on your eyes when your imagination is out of focus.",
      "I don't focus on what I'm up against. I focus on my goals and I try to ignore the rest.",
      "I focus on one thing and one thing only.",
    ];
    var quote = quotes[Math.floor(Math.random()*5)%5];
    var welcome = <div style={{height:"100%", width:"100%"}}>
      <div style={{height:"30%", width:"100%"}}></div>
      <h3 className="ui center aligned header">
        <div className="ui info message">
            <div className="header">{quote}</div>
        </div>
      </h3>
    </div>;



    var settingsItems = this.state.items.map((menuItem, index) => {
      var activeClasses = menuItem.isActive ? "active " : "";
      activeClasses += "ui basic green button";
      var nonactiveClasses = menuItem.isActive ? "": "active ";
      nonactiveClasses += "ui basic red button";
      return <div className="column">
          <div className="ui segment card">
            <div className="content">
              <i className="google large icon right floated "></i>
              <div className="header">
                {menuItem.name}
              </div>
              <div className="meta">
                {menuItem.name}
              </div>
              <div className="description">
                {menuItem.url}
              </div>
            </div>
            <div className="extra content">
              <div className="ui two buttons">
                <div className={activeClasses} onClick={()=>this.setIsActive(true, index)}>Active</div>
                <div className={nonactiveClasses} onClick={()=>this.setIsActive(false, index)}>Non active</div>
              </div>
            </div>
          </div>
        </div>
    });
    var settings = <div>
      <h3 className="ui center aligned header">Pick your focus zone.</h3>
      <div className="ui three column doubling stackable grid container">
        {settingsItems}
      </div>
    </div>
    ;
    var content = (this.state.show === "welcome") ? welcome :
                  (this.state.show === "settings") ? settings : webview;

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
            {menu}
            <a href="#" className="ui right floated item" onClick={()=>this.setSrcTo("settings")}>
              <i className="settings large icon popup"></i> Settings
            </a>
          </div>
        </div>

        <div style={{
          width:"100%",
          height: "100%"
        }}>
        {content}
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
