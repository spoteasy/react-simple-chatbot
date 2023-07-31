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

class TextStep extends Component {
  /* istanbul ignore next */
  state = {
    loading: true,
    isEditing: false
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

    return this.getMessage();
  };

  renderOption = option => {
    const { bubbleOptionStyle, step, updateStep } = this.props;
    const { user } = step;
    const { value, label } = option;

    return (
      <Option key={value} className="rsc-os-option ignore-auto-scroll">
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
    const { step, setEditingStepId, editingStepId } = this.props;
    const { isEditing } = this.state;

    if (isEditing && this.options) {
      return Object.keys(this.options)
        .map(key => this.options[key])
        .map(this.renderOption);
    }

    if (editingStepId && editingStepId === step.id) {
      return (
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '6px 0 6px 0' }}
          className="ignore-auto-scroll"
        >
          <XCircleIcon
            color="#474747"
            size={28}
            style={{ cursor: 'pointer', marginRight: '4px' }}
            onClick={() => {
              setEditingStepId('');
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={{ display: 'flex', alignItems: 'center', padding: '6px 0 6px 0' }}
        className="ignore-auto-scroll"
      >
        <PencilIcon
          className="ignore-auto-scroll"
          style={{
            cursor: 'pointer',
            marginRight: '8px'
          }}
          color="#474747"
          onClick={() => {
            if (this.options) {
              return this.setState({ isEditing: true });
            }

            return setEditingStepId(step.id);
          }}
        />
      </div>
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
    const { avatar, user, botName, editable = true } = step;

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
        {user && editable && !loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flex: 1,
              height: '61px'
            }}
          >
            {this.renderButton()}
          </div>
        ) : (
          false
        )}
        {isEditing && this.options ? null : (
          <Bubble
            className="rsc-ts-bubble ignore-auto-scroll"
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
  setEditingStepId: PropTypes.func.isRequired,
  editingStepId: PropTypes.string.isRequired
};

TextStep.defaultProps = {
  previousStep: {},
  previousValue: '',
  speak: () => {},
  steps: {}
};

export default TextStep;
