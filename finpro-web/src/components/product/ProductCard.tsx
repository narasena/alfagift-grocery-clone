import * as React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

export default function ProductCard() {
  return (
    <Card className="max-w-[16.67%] !py-3"> 
      <CardHeader>
        <div className="size-[144px] bg-blue-300">Image</div>
        <CardTitle className="font-normal">Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-red-600 font-bold">Rp 10.000  </p>
      </CardContent>
      <CardFooter className="border-t border-gray-200 !px-2 !pt-2">
        <Button className="bg-red-600 w-full">Beli</Button>
      </CardFooter>
    </Card>
  );
}
