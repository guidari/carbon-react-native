import React from 'react';
import {ActionSheetIOS, Platform, Pressable, ScrollView, StyleSheet, View, Modal, SafeAreaView} from 'react-native';
import { modalPresentations } from '../../constants/constants';
import { getColor } from '../../styles/colors';
import { Text } from '../Text';

export type ActionSheetItem = {
  /** Name for button */
  text: string;
  /** Indicate if hidden (won't show) */
  hidden?: boolean;
  /** Press event (this will also automatically close the ActionSheet as well) */
  onPress: () => void;
};

export type ActionSheetProps = {
  /** Title to show */
  title: string;
  /** Body to show */
  body?: string;
  /** Items to render */
  items: ActionSheetItem[];
  /** Cancel button index (index of where cancel button lives) */
  cancelButtonIndex: number;
  /** Indicate if should open (can only open post render; must render then set state) */
  open: boolean;
  /** Force use of the custom action sheet (even if System is supported) */
  forceCustomActionSheet?: boolean;
};

const styles = StyleSheet.create({
  safeAreaWrapper: {
    position: 'relative',
    flexGrow: 1,
    flexDirection: 'row-reverse',
  },
  blurBackground: {
    zIndex: -1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: getColor('background'),
    opacity: 0.4,
  },
  wrapper: {
    backgroundColor: getColor('layer01'),
    alignSelf: 'flex-end',
    width: '100%',
  },
  textArea: {
    padding: 16,
    paddingBottom: 0,
    paddingTop: 23,
    borderBottomColor: getColor('layerAccentActive03'),
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: 8,
  },
  body: {
    marginBottom: 8,
  },
  optionsWrapper: {
    maxHeight: '50%',
  },
  options: {
    flexGrow: 0,
  },
  option: {
    padding: 12,
    paddingLeft: 16,
  },
  cancelButton: {
    backgroundColor: getColor('buttonSecondary'),
    padding: 12,
    paddingLeft: 16,
  },
});

/**
 * Render a popup (from bottom) to show menu options for when non Yes/No questions are needed.
 * Uses the OS ActionSheet if supported. Otherwise renders a custom one with similar styling.
 */
export class ActionSheet extends React.Component<ActionSheetProps> {
  private handleSystemTrigger = () => {
    const {open, title, body, items, cancelButtonIndex} = this.props;

    const options = items.filter(item => !item.hidden);

    if (open) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: options.map(item => item.text),
          title: title,
          message: body,
          cancelButtonIndex: cancelButtonIndex,
        },
        index => {
          const action = options[index];

          if (action) {
            action.onPress();
          }
        },
      );
    }
  };

  private get useSystemActionSheet(): boolean {
    const {forceCustomActionSheet} = this.props;

    return Platform.OS === 'ios' && !forceCustomActionSheet;
  }

  private get customActionSheet(): React.ReactNode {
    const {open, title, body, items, cancelButtonIndex} = this.props;

    const options = items.filter(item => !item.hidden);
    const cancel = options.splice(cancelButtonIndex, 1)[0] || {text: '', onPress: () => {}};

    if (!open) {
      return null;
    }

    return (
      <Modal supportedOrientations={modalPresentations} transparent={true} onRequestClose={() => this.setState({open: false})} animationType="slide">
        <SafeAreaView style={styles.safeAreaWrapper}>
          <View style={styles.blurBackground} />
          <View style={styles.wrapper}>
            <View style={styles.textArea}>
              <Text style={styles.title} type="heading-01" text={title} />
              {!!body && <Text style={styles.body} type="helper-text-01" text={body} />}
            </View>
            <View style={styles.optionsWrapper}>
              <ScrollView bounces={false} style={styles.options}>
                {options.map((item, index) => {
                  return (
                    <Pressable
                      style={styles.option}
                      accessibilityLabel={item.text}
                      key={index}
                      onPress={() => {
                        item.onPress();
                      }}
                    >
                      <Text text={item.text} />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
            <Pressable
              style={styles.cancelButton}
              accessibilityLabel={cancel.text}
              onPress={() => {
                cancel.onPress();
              }}
            >
              <Text text={cancel.text} />
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  componentDidUpdate(previousProps: ActionSheetProps): void {
    const {open} = this.props;

    if (previousProps.open !== open) {
      if (this.useSystemActionSheet) {
        this.handleSystemTrigger();
      }
    }
  }

  componentDidMount(): void {
    if (this.useSystemActionSheet) {
      this.handleSystemTrigger();
    }
  }

  render(): React.ReactNode {
    if (!this.useSystemActionSheet) {
      return this.customActionSheet;
    }

    return null;
  }
}