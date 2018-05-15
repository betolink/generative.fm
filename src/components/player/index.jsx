import React, { Component } from 'react';
import Tone from 'tone';
import startAudioContext from 'startaudiocontext';
import {
  VolumeSlider,
  PlayButton,
  SoundOnButton,
  SoundOffButton,
  ControlDirection,
} from 'react-player-controls';
import StayScrolled from 'react-stay-scrolled';
import FontAwesome from '@fortawesome/react-fontawesome';
import faEllipsisH from '@fortawesome/fontawesome-free-solid/faEllipsisH';
import faEllipsisV from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import PropTypes from 'prop-types';
import Log from '../log';
import './styles.scss';

const DEFAULT_VOLUME_PCT = 0.75;
const MAX_VOLUME = -15;
const MIN_VOLUME = -75;

const convertPctToDb = pct => pct * (MAX_VOLUME - MIN_VOLUME) + MIN_VOLUME;

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      volume: DEFAULT_VOLUME_PCT,
      sliderVolume: DEFAULT_VOLUME_PCT,
      isMuted: false,
      logs: [],
      showLogs: false,
      showInfo: false,
      masterVolumeNode: new Tone.Volume(
        convertPctToDb(DEFAULT_VOLUME_PCT)
      ).toMaster(),
    };
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleMuteClick = this.handleMuteClick.bind(this);
    this.handleUnmuteClick = this.handleUnmuteClick.bind(this);
    this.storeScrolledControllers = this.storeScrolledControllers.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handleLogsClick = this.handleLogsClick.bind(this);
  }
  storeScrolledControllers({ scrollBottom }) {
    this.scrollBottom = scrollBottom;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.logs.length < this.state.logs.length && this.state.showLogs) {
      this.scrollBottom();
    }
  }
  render() {
    return (
      <div className="player">
        {this.state.showInfo && (
          <div className="player__info">Theres nothing here</div>
        )}
        <div className="player__center">
          <div className="player__center__button">
            {!this.state.isPlaying && (
              <PlayButton onClick={this.handlePlayClick} isEnabled />
            )}
            {this.state.isPlaying &&
              !this.state.isMuted && (
                <SoundOffButton onClick={this.handleMuteClick} isEnabled />
              )}
            {this.state.isPlaying &&
              this.state.isMuted && (
                <SoundOnButton onClick={this.handleUnmuteClick} isEnabled />
              )}
          </div>
          <div className="player__center__slider">
            <VolumeSlider
              direction={ControlDirection.Vertical}
              volume={this.state.sliderVolume}
              onVolumeChange={this.handleSliderChange}
              isEnabled
            />
          </div>
        </div>

        {this.state.showLogs && (
          <StayScrolled
            className="player__logs"
            provideControllers={this.storeScrolledControllers}
          >
            {this.state.logs.map((message, i) => (
              <Log key={i} message={message} />
            ))}
          </StayScrolled>
        )}

        <button
          type="button"
          className="side-button side-button--left"
          onClick={this.handleInfoClick}
        >
          <FontAwesome icon={faEllipsisH} />
        </button>
        <button
          type="button"
          className="side-button side-button--right"
          onClick={this.handleLogsClick}
        >
          <FontAwesome icon={faEllipsisV} />
        </button>
      </div>
    );
  }
  componentDidMount() {
    this.props.piece(this.state.masterVolumeNode, this.log.bind(this));
    startAudioContext(Tone.context);
  }
  handlePlayClick() {
    Tone.Transport.start('+1');
    this.setState({ isPlaying: true });
  }
  handleMuteClick() {
    this.setState({
      isMuted: true,
    });
    this.updateVolume(0);
  }
  handleUnmuteClick() {
    this.setState({
      isMuted: false,
    });
    this.updateVolume(this.state.sliderVolume);
  }
  log(message) {
    this.setState({
      logs: this.state.logs.concat(message),
    });
  }
  handleSliderChange(volume) {
    this.setState({ sliderVolume: volume });
    if (!this.state.isMuted) {
      this.updateVolume(volume);
    }
  }
  updateVolume(volume) {
    this.setState({ volume });
    this.state.masterVolumeNode.set({ volume: convertPctToDb(volume) });
  }
  handleInfoClick() {
    this.setState({ showInfo: true, showLogs: false });
  }
  handleLogsClick() {
    this.setState({ showLogs: true, showInfo: false });
  }
}

Player.propTypes = {
  piece: PropTypes.func,
};

export default Player;
