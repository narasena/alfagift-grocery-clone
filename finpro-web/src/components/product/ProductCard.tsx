import * as React from "react";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { House, Timer } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

interface IProductCardProps {
  name: string;
  slug: string;
  imgUrl: string;
  isPromo: boolean;
  promoName?: string;
  stock: number;
  price: number;
}

export default function ProductCard(props: IProductCardProps) {
  return (
    <div className="product-item w-full !min-w-[160px] min-md:w-[190px] h-[400px] min-sm:px-[15px]">
      <Card className="px-0 py-0 flex flex-col gap-0 !mb-6 rounded-[8px] shadow-[0_.125rem_.25rem_rgba(0, 0, 0, .075)]">
        <CardHeader className="p-0 gap-0">
          <Link href={`/p/${props.slug}`} className="flex flex-col p-0 gap-0">
            <div className="self-center p-2 ">
              {props.imgUrl ? (
                <div className="overflow-hidden centered size-36">
                  <CldImage src={props.imgUrl} width={144} height={144} alt={props.name} />
                </div>
              ) : (
                <div className="!size-[144px] bg-gray-200 self-center flex items-center justify-center">
                  <span className="text-sm text-gray-500">No Image</span>
                </div>
              )}
              <div className="w-full h-[27px]"></div>
            </div>
            <CardTitle className="font-semibold text-sm px-2 leading-[22px] h-[46px] w-full line-clamp-2">
              {props.name}
            </CardTitle>
            <CardDescription className="px-2 w-full">
              {props.isPromo ? (
                <div className="h-[21px]">
                  <span className="text-[10px] text-[#999999] line-through">
                    {props.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ) : (
                <div className="h-[21px]"></div>
              )}
              <p className="text-red-600 font-bold h-6">
                <span className="text-base">
                  {props.price?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </p>
            </CardDescription>
            <CardAction className="p-2 text-xs *:h-3">
              <div className="flex items-center">
                <House className="size-[12px] text-red-700" />
                <p className="ml-1 italic">Produk Online</p>
              </div>
              <div className="flex items-center mt-1 text-red-700">
                <Timer className="size-[12px]" />
                <p className="ml-1 font-semibold">Pengiriman Online</p>
              </div>
            </CardAction>
          </Link>
        </CardHeader>
        <CardFooter className="border-t border-gray-200 !p-2">
          {props.stock ?? 0 > 0 ? (
            <Button className="bg-red-600 w-full">Beli</Button>
          ) : (
            <Button className="bg-[#e8e8e8] w-full text-gray-700" disabled>
              Stok Habis
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
