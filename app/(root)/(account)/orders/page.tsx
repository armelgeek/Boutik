import OrdersList from "@/features/orders/molecules/order-list";
import Heading from "@/shared/components/atoms/heading";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Generated by create next app',
};

const Page = () => {
 
  return (
    <>
     <Heading text1="Orders" className="text-left"/>
     <OrdersList/>
    </>
  );
}
export default Page;