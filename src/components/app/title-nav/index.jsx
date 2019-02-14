import React from 'react';
import propTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './title-nav.scss';

const TitleNavLink = ({ text, linkTo, exact = false }) => (
  <li className="title-nav__tab-list__item">
    <NavLink
      className="title-nav__tab-list__item__link"
      activeClassName="title-nav__tab-list__item__link--is-active"
      to={linkTo}
      exact={exact}
    >
      {text}
      <div className="title-nav__tab-list__item__active-indicator" />
    </NavLink>
  </li>
);

TitleNavLink.propTypes = {
  text: propTypes.string,
  linkTo: propTypes.string,
  exact: propTypes.bool,
};

const TitleNavComponent = () => (
  <div className="title-nav">
    <h1 className="title-nav__title title-nav__title--primary">
      Generative.fm
    </h1>
    <h2 className="title-nav__title title-nav__title--secondary">
      Endlessly unique ambient music
    </h2>
    <ul className="title-nav__tab-list">
      <TitleNavLink text="MUSIC" linkTo="/" exact={true} />
      <TitleNavLink text="ABOUT" linkTo="/about" />
    </ul>
  </div>
);

export default TitleNavComponent;
