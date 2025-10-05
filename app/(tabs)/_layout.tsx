
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FloatingTabBar from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabs = [
    {
      name: '(home)',
      title: 'Quest Board',
      icon: 'map',
      route: '/(home)',
    },
    {
      name: 'allies',
      title: 'Allies',
      icon: 'person.2.fill',
      route: '/allies',
    },
    {
      name: 'profile',
      title: 'Profile',
      icon: 'person.circle',
      route: '/profile',
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: 'transparent',
            },
            default: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Quest Board',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="map" color={color} />,
          }}
        />
        <Tabs.Screen
          name="allies"
          options={{
            title: 'Allies',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle" color={color} />,
          }}
        />
      </Tabs>
      
      {Platform.OS === 'ios' && <FloatingTabBar tabs={tabs} />}
    </>
  );
}
