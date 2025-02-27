import BackButton from '@/components/component/BackButton'
import CustomerTable from '@/components/component/CustomerTable'
import Pagination1 from '@/components/component/Pagination'

import React from 'react'

const Code = () => {
     return (
          <div>
               <BackButton text='Go back' link='/dashboard/staff' />
               <CustomerTable />
               
          </div>
     )
}

export default Code
