import React from 'react';
import { ViewProps, StyleProp, ViewStyle, View } from 'react-native';
import { NavigationListItem, NavigationListItemProps } from '../NavigationListItem';

export type NavigationListProps = {
  /** Items to render in the navigation list */
  items: NavigationListItemProps[];
  /** Style to set on the item */
  style?: StyleProp<ViewStyle>;
  /** Direct props to set on the React Native component (including iOS and Android specific props). Most use cases should not need this. */
  componentProps?: ViewProps;
};

export class NavigationList extends React.Component<NavigationListProps> {
  render(): React.ReactNode {
    const { items, componentProps, style } = this.props;
    const allItems = items || [];

    return (
      <View style={style} {...(componentProps || {})}>
        {allItems.map((item, index) => (
          <NavigationListItem key={index} {...item} lastItem={index + 1 === allItems.length} />
        ))}
      </View>
    );
  }
}
