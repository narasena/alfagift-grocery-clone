'use client'

import AdminTable from '@/features/admin/components/AdminTable';
import { useAdminDiscount } from '@/features/admin/discounts/hooks/useAdminDiscount';
import { IDiscountResponseTable } from '@/types/discounts/discount.type';
import * as React from 'react';


export default function AdminDiscountPage() {
  const { discounts,discountsTitle,renderDiscountsCell } = useAdminDiscount()
  console.log(discounts)
    
  return (
    <div>
      <AdminTable 
        columns={discountsTitle}
        data={discounts as IDiscountResponseTable[]}
        renderCell={renderDiscountsCell}
      />
    </div>
  );
}
