import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bubble from './Bubble';
import Image from './Image';
import ImageContainer from './ImageContainer';
import Loading from '../common/Loading';
import TextStepContainer from './TextStepContainer';
import Option from '../options/Option';
import OptionElement from '../options/OptionElement';
import PencilIcon from '../../icons/PencilIcon';
import XCircleIcon from '../../icons/XCircleIcon';
import CheckCircleIcon from '../../icons/CheckCircleIcon';

class TextStep extends Component {
  /* istanbul ignore next */
  state = {
    loading: true,
    isEditing: false,
    editingMessage: this.props.step.message
      ? this.props.step.message.replace(/{previousValue}/g, this.props.previousValue)
      : ''
  };

  componentDidMount() {
    const { step, speak, previousValue, triggerNextStep } = this.props;
    const { component, delay, waitAction } = step;
    const isComponentWatingUser = component && waitAction;

    setTimeout(() => {
      this.setState({ loading: false }, () => {
        if (!isComponentWatingUser && !step.rendered) {
          if (step.triggerConfig) {
            triggerNextStep({ triggerConfig: step.triggerConfig });
          } else {
            triggerNextStep();
          }
        }
        speak(step, previousValue);
      });
    }, delay);
  }

  get options() {
    const { step } = this.props;
    return step.stepOptions;
  }

  getMessage = () => {
    const { previousValue, step } = this.props;
    const { message } = step;

    return message ? message.replace(/{previousValue}/g, previousValue) : '';
  };

  renderMessage = () => {
    const { isEditing, editingMessage } = this.state;
    const { step, steps, previousStep, triggerNextStep } = this.props;
    const { component } = step;

    if (component) {
      return React.cloneElement(component, {
        step,
        steps,
        previousStep,
        triggerNextStep
      });
    }

    if (isEditing) {
      return (
        <input
          type="text"
          onChange={e => this.setState({ editingMessage: e.target.value })}
          value={editingMessage}
          className="edit-input"
          style={{
            width: '100px',
            display: 'flex',
          }}
        />
      );
    }

    return this.getMessage();
  };

  renderOption = option => {
    const { bubbleOptionStyle, step, updateStep } = this.props;
    const { user } = step;
    const { value, label } = option;

    return (
      <Option key={value} className="rsc-os-option">
        <OptionElement
          className="rsc-os-option-element"
          style={bubbleOptionStyle}
          user={user}
          onClick={() => {
            updateStep(step.id, ['label', 'message', 'value'], [label, label, value]);
            this.setState({
              isEditing: false
            });
          }}
        >
          {label}
        </OptionElement>
      </Option>
    );
  };

  renderButton = () => {
    const { updateStep, step, previousValue } = this.props;
    const { isEditing, editingMessage } = this.state;

    if (isEditing && this.options) {
      return Object.keys(this.options)
        .map(key => this.options[key])
        .map(this.renderOption);
    }

    if (isEditing) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <XCircleIcon
            color="#474747"
            size={26}
            style={{ cursor: 'pointer', marginRight: '4px' }}
            onClick={() => {
              this.setState({
                isEditing: false,
                editingMessage: step.message
                  ? step.message.replace(/{previousValue}/g, previousValue)
                  : ''
              });
            }}
          />

          <CheckCircleIcon
            color="#474747"
            size={26}
            style={{ cursor: 'pointer', marginRight: '8px' }}
            onClick={() => {
              updateStep(step.id, ['message', 'value'], [editingMessage, editingMessage]);
              this.setState({
                isEditing: false
              });
            }}
          />
        </div>
      );
    }

    return (
      <PencilIcon
        style={{
          cursor: 'pointer',
          marginRight: '8px'
        }}
        color="#474747"
        onClick={() => this.setState({ isEditing: true })}
      />
    );
  };

  render() {
    const {
      step,
      isFirst,
      isLast,
      avatarStyle,
      bubbleStyle,
      hideBotAvatar,
      hideUserAvatar
    } = this.props;
    const { loading, isEditing } = this.state;
    const { avatar, user, botName } = step;

    const showAvatar = user ? !hideUserAvatar : !hideBotAvatar;

    const imageAltText = user ? 'Your avatar' : `${botName}'s avatar`;

    return (
      <TextStepContainer className={`rsc-ts ${user ? 'rsc-ts-user' : 'rsc-ts-bot'}`} user={user}>
        <ImageContainer className="rsc-ts-image-container" user={user}>
          {isFirst && showAvatar && (
            <Image
              className="rsc-ts-image"
              style={avatarStyle}
              showAvatar={showAvatar}
              user={user}
              src={avatar}
              alt={imageAltText}
            />
          )}
        </ImageContainer>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            height: '61px'
          }}
        >
          {user && !loading ? this.renderButton() : false}
        </div>
        {isEditing && this.options ? null : (
          <Bubble
            className="rsc-ts-bubble"
            style={bubbleStyle}
            user={user}
            showAvatar={showAvatar}
            isFirst={isFirst}
            isLast={isLast}
          >
            {loading ? <Loading /> : this.renderMessage()}
          </Bubble>
        )}
      </TextStepContainer>
    );
  }
}

TextStep.propTypes = {
  avatarStyle: PropTypes.objectOf(PropTypes.any).isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  bubbleStyle: PropTypes.objectOf(PropTypes.any).isRequired,
  hideBotAvatar: PropTypes.bool.isRequired,
  hideUserAvatar: PropTypes.bool.isRequired,
  previousStep: PropTypes.objectOf(PropTypes.any),
  previousValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ]),
  speak: PropTypes.func,
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  steps: PropTypes.objectOf(PropTypes.any),
  triggerNextStep: PropTypes.func.isRequired,
  bubbleOptionStyle: PropTypes.objectOf(PropTypes.any).isRequired,
  updateStep: PropTypes.func.isRequired,
};

TextStep.defaultProps = {
  previousStep: {},
  previousValue: '',
  speak: () => {},
  steps: {}
};

export default TextStep;
