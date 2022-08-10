import React from 'react';
import { NativeSyntheticEvent, StyleProp, StyleSheet, TextInputFocusEventData, View, ViewStyle, TextInput as ReactTextInput, TextInputProps as ReactTextInputProps, Pressable } from 'react-native';
import { createIcon, styleReferenceBreaker } from '../../helpers';
import { getColor } from '../../styles/colors';
import { Button } from '../Button';
import { Text } from '../Text';
import ViewIcon from '@carbon/icons/es/view/20';
import ViewOffIcon from '@carbon/icons/es/view--off/20';
import SubtractIcon from '@carbon/icons/es/subtract/20';
import AddIcon from '@carbon/icons/es/add/20';
import { defaultText } from '../../constants/defaultText';

/** Shared props for Text, Password and TextArea */
export type TextInputProps = {
  /** Value of text (Controlled component) */
  value: string;
  /** Label string to use */
  label?: string;
  /** Helper string to use */
  helperText?: string;
  /** Check is invalid */
  isInvalid?: (value: string) => boolean;
  /** Error string to use. Set custom rules or return required text */
  getErrorText?: (value: string) => string;
  /** Placeholder text to use */
  placeholder?: string;
  /** Indicate if required */
  required?: boolean;
  /** Indicate if disabled */
  disabled?: boolean;
  /** Change event when text changed */
  onChangeText: (value: string) => void;
  /** Blur event when focus is lost */
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Focus event when focus is gained */
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Indicate if autoCorrect should be used (default is true) */
  autoCorrect?: boolean;
  /** Define auto cap rule (default is normally sentences) */
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none';
  /** Trigger ENTER event (consumer should validate if form is valid and submit if this is called) */
  onSubmitEditing?: () => void;
  /** Indicate if should be secured (password) */
  secureTextEntry?: boolean;
  /** Max length of field */
  maxLength?: number;
  /** minHeight for text area */
  textAreaMinHeight?: number;
  /** @remarks password only. Text to use for toggle password button (accessibility). Defaults to ENGLISH "Show/hide password" */
  togglePasswordText?: string;
  /** @remarks number only. Min and Max for numbers. If not set any number (including negative is valid) */
  numberRules?: {
    min?: number;
    max?: number;
  }
  /** Style to set on the item */
  style?: StyleProp<ViewStyle>;
  /** Direct props to set on the React Native component (including iOS and Android specific props). Helpful for fully customizing text input behavior. */
  componentProps?: ReactTextInputProps;
}

const baseTextBox = {
  height: 48,
  backgroundColor: getColor('field01'),
  borderColor: getColor('field01'),
  color: getColor('textPrimary'),
  borderBottomColor: getColor('borderStrong02'),
  borderWidth: 1,
  paddingRight: 16,
  paddingLeft: 18,
};

export const textInputStyles = StyleSheet.create({
  wrapper: {
    paddingTop: 22,
  },
  label: {
    color: getColor('textSecondary'),
    marginBottom: 8,
  },
  helperText: {
    color: getColor('textHelper'),
    marginTop: 8,
  },
  errorText: {
    color: getColor('textError'),
    marginTop: 8,
  },
  textBox: baseTextBox,
  textBoxDisabled: {
    ...baseTextBox,
    color: getColor('textDisabled'),
    borderBottomColor: 'transparent',
  },
  textBoxActive: {
    ...baseTextBox,
    borderStyle: 'solid',
    borderColor: getColor('focus'),
    borderBottomColor: getColor('focus'),
    paddingRight: 14,
  },
  textBoxError: {
    ...baseTextBox,
    borderStyle: 'solid',
    borderColor: getColor('supportError'),
    borderBottomColor: getColor('supportError'),
    paddingRight: 14,
  },
  textBoxWrapper: {
    position: 'relative',
  },
  passwordRevealButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  numberActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
  },
  numberActionsDivider: {
    backgroundColor: getColor('layer02'),
    width: 1,
    height: 20,
    marginTop: 14,

  },
  numberActionsButton: {
    padding: 13,

  },
});

/**
 * This is the base system for text input.
 * This allows a shared code base for all text input systems and validation rules
 * This component is not exported. It is used by `TextInput`, `TextArea` and `PasswordInput`.
 */
export class BaseTextInput extends React.Component<{type: 'text'|'text-area'|'password'|'number'}&TextInputProps> {
  state = {
    dirty: false,
    hasFocus: false,
    revealPassword: false,
  }

  private onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    const {onFocus} = this.props;

    if (typeof onFocus === 'function') {
      onFocus(event);
    }
    this.setState({hasFocus: true});
  }

  private onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    const {onBlur} = this.props;

    if (typeof onBlur === 'function') {
      onBlur(event);
    }
    this.setState({hasFocus: false});
  }

  private onChange = (value: string): void => {
    const {onChangeText, type, numberRules} = this.props;

    if (type === 'number' && value) {
      if (Number.isNaN(Number(value))) {
        value = String(numberRules?.min || 0);
      }

      const invalidMin = (typeof numberRules?.min === 'number') ? numberRules.min >= Number(value) : false;
      const invalidMax = (typeof numberRules?.max === 'number') ? numberRules.max <= Number(value) : false;

      if (invalidMin) {
        value = String(numberRules?.min || 0);
      }

      if (invalidMax) {
        value = String(numberRules?.max || 0);
      }
    }

    if (typeof onChangeText === 'function') {
      onChangeText(value);
    }

    this.setState({dirty: true});
  }

  private get passwordReveal(): React.ReactNode {
    const {revealPassword} = this.state;
    const {togglePasswordText, disabled} = this.props;

    return <Button overrideColor={disabled ? getColor('iconDisabled') : getColor('iconSecondary')} disabled={disabled} style={textInputStyles.passwordRevealButton} iconOnlyMode={true} kind="ghost" icon={revealPassword ? ViewOffIcon : ViewIcon} text={togglePasswordText || defaultText.passwordRevealButton} onPress={() => this.setState({revealPassword: !revealPassword})} />;
  }

  private incrementNumber = (): void => {
    const {value} = this.props;

    const valueNumber = Number.isNaN(Number(value)) ? 0 : Number(value);

    this.onChange(String(valueNumber + 1));
  };

  private decrementNumber = (): void => {
    const {value} = this.props;

    const valueNumber = Number.isNaN(Number(value)) ? 0 : Number(value);

    this.onChange(String(valueNumber - 1));
  };

  private get numberActions(): React.ReactNode {
    const {numberRules, value, disabled} = this.props;

    const valueNumber = Number.isNaN(Number(value)) ? 0 : Number(value);
    const disableMin = (typeof numberRules?.min === 'number') ? numberRules.min >= valueNumber : false;
    const disableMax = (typeof numberRules?.max === 'number') ? numberRules.max <= valueNumber : false;


    const getPressable = (onPress: () => void, pressableDisabled: boolean, icon: unknown): React.ReactNode => {
      const finalDisabled = pressableDisabled || disabled || false;
      return <Pressable style={textInputStyles.numberActionsButton} onPress={onPress} disabled={finalDisabled}>{createIcon(icon, 22, 22, finalDisabled ? getColor('iconDisabled') : getColor('iconPrimary'))}</Pressable>
    };

    return (
      <View style={textInputStyles.numberActions}>
        {getPressable(this.decrementNumber, disableMin, SubtractIcon)}
        <View style={textInputStyles.numberActionsDivider} />
        {getPressable(this.incrementNumber, disableMax, AddIcon)}
      </View>
    )
  }

  render(): React.ReactNode {
    const {label, helperText, getErrorText, value, autoCorrect, autoCapitalize, placeholder, maxLength, onSubmitEditing, componentProps, style, required, disabled, isInvalid, type, textAreaMinHeight} = this.props;
    const {hasFocus, dirty, revealPassword} = this.state;
    const password = type === 'password';
    const number = type === 'number';
    let textBoxStyle = styleReferenceBreaker(textInputStyles.textBox);
    const error = !!(required && dirty && !value) || (dirty && typeof isInvalid === 'function' && isInvalid(value));

    if (disabled) {
      textBoxStyle = styleReferenceBreaker(textInputStyles.textBoxDisabled);
    } else if (error) {
      textBoxStyle = styleReferenceBreaker(textInputStyles.textBoxError);
    } else if (hasFocus) {
      textBoxStyle = styleReferenceBreaker(textInputStyles.textBoxActive);
    }

    if (type === 'text-area') {
      textBoxStyle.height = textAreaMinHeight || 96;
    } else if (type === 'password') {
      textBoxStyle.paddingRight = 50;
    } else if (type === 'number') {
      textBoxStyle.paddingRight = 100;
    }

    return (
      <View style={styleReferenceBreaker(style || {}, textInputStyles.wrapper)} accessible={!password} accessibilityLabel={label} accessibilityHint={helperText}>
        {!!label && <Text style={textInputStyles.label} type="label-02" text={label} />}
        <View style={textInputStyles.textBoxWrapper} accessible={password} accessibilityLabel={label} accessibilityHint={helperText}>
          <ReactTextInput
            editable={!disabled}
            secureTextEntry={revealPassword ? false : password}
            autoCapitalize={autoCapitalize}
            style={textBoxStyle}
            value={value}
            onSubmitEditing={onSubmitEditing}
            onChangeText={this.onChange}
            autoCorrect={autoCorrect}
            placeholder={placeholder}
            placeholderTextColor={getColor('textPlaceholder')}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            maxLength={maxLength}
            textAlignVertical="top"
            multiline={type === 'text-area'}
            {...(componentProps || {})}
          />
          {password && this.passwordReveal}
          {number && this.numberActions}
        </View>
        {!!(helperText && !error) && <Text style={textInputStyles.helperText} type="helper-text-02" text={helperText} />}
        {!!(typeof getErrorText === 'function' && error) && <Text style={textInputStyles.errorText} type="helper-text-02" text={getErrorText(value)} />}
      </View>
    );
  }
}