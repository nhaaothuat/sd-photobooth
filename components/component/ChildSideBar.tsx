import { Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import Profile from './Profile';
import Setting from './Setting';



const ChildSideBar = () => {
  return (
    <Tabs color="indigo" variant="pills" radius="md" orientation="vertical" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery" leftSection={<IconPhoto size={12} />}>
          Profile
        </Tabs.Tab>
        <Tabs.Tab value="messages" leftSection={<IconMessageCircle size={12} />}>
          Messages
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Settings
        </Tabs.Tab>
        
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <Profile />
      </Tabs.Panel>

      <Tabs.Panel value="messages">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings">
        <Setting />
      </Tabs.Panel>
    </Tabs>
    
  )
}

export default ChildSideBar
