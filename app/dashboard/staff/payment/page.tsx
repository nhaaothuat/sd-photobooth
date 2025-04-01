
import PaymentCard from '@/components/component/PaymentCard'
import PaymentMoney from '@/components/component/PaymentMoney'
import { Title } from '@mantine/core'
import React from 'react'

const Payment = () => {
     return (
          <div className="flex flex-col gap-4">
               {/* Tiêu đề */}
               <div >
                    <Title>Payment</Title>
               </div>

              
               <div className="flex justify-center gap-x-5">
                    <PaymentCard />
                    <PaymentMoney />
               </div>
          </div>

     )
}

export default Payment
