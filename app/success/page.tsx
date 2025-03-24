
import { Button, Container, Group, Text, Title } from '@mantine/core';
const SuccessPage = () => {
     return (
          <Container className="py-20 text-center">
               <div className="text-4xl font-extrabold text-green-500 mb-6 sm:text-3xl">🎉 Success!</div>
               <Title className="text-3xl font-extrabold text-green-700">Your payment was successful!</Title>
               <Text c="dimmed" size="lg" ta="center" className="max-w-lg mx-auto mt-4 text-gray-500">
                    Thank you for your purchase. Your order has been successfully processed. You can now return to the homepage.
               </Text>
               <Group  justify="center" className="mt-6">
                    <Button variant="filled" size="md" color="green" >
                         Go to Home Page
                    </Button>
               </Group>
          </Container>
     )
}

export default SuccessPage
