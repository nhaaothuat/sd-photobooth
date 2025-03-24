
import { Card, Group, Switch, Text } from '@mantine/core';
import { data2 } from '@/providers/data';
const Setting = () => {
     const items = data2.map((item) => (
          <Group justify="space-between" className="py-2 border-t first:border-0 border-gray-200 dark:border-gray-700" wrap="nowrap" gap="xl" key={item.title}>
               <div>
                    <Text className="text-base font-medium">{item.title}</Text>
                    <Text size="xs" className="text-gray-500 dark:text-gray-400">
                         {item.description}
                    </Text>
               </div>
               <Switch onLabel="ON" offLabel="OFF" className="cursor-pointer" size="lg" />
          </Group>
     ));
     return (
          <div className='pl-4'>
               <Card withBorder radius="md" p="sm" className=" bg-white dark:bg-gray-900 shadow-md rounded-md">
                    {/* <Text fz="lg" className="text-lg font-semibold" fw={500}>
                    Configure notifications
               </Text>
               <Text fz="xs" className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                    Choose what notifications you want to receive
               </Text> */}
                    {items}
               </Card>
          </div>
     )
}

export default Setting
