import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tables } from "@/database.types";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { CpuIcon, Server } from "lucide-react";
import Image from "next/image";
import ColorButton from "./_components/ColorButton";
import { PhoneCombobox } from "./_components/Combobox";
import ShareButton from "./_components/ShareButton";
import { Suspense } from "react";
import PhoneCardSkeleton from "./_components/PhoneCardSkeleton";
import { Metadata, ResolvingMetadata } from "next";

type PhoneWithColors = Tables<"phones"> & {
  phone_colors: Tables<"phone_colors">[];
};

// export const metadata: Metadata = {
//   title: "I-Phone 비교하기",
//   description: " I-Phone을 비교 해보세요",
// };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    primary?: string;
    secondary?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("phones").select("*, phone_colors(*)");
  if (!data) throw new Error("No data found");

  const primaryPhone =
    data.find((phone) => phone.name === searchParams.primary) || data[0];
  const secondaryPhone =
    data.find((phone) => phone.name === searchParams.secondary) || data[0];

  const primaryColor =
    searchParams.primaryColor || primaryPhone.phone_colors[0].name;
  const secondaryColor =
    searchParams.secondaryColor || secondaryPhone.phone_colors[0].name;

  return {
    title: `${primaryPhone.name} ${primaryColor} 모델과 ${secondaryPhone.name} ${secondaryColor} 모델 비교하기`,
    description: `${primaryPhone.name} ${primaryColor} 모델과 ${secondaryPhone.name} ${secondaryColor} 모델을 비교해보세요`,
  };
}

const PhoneCard = async ({
  order,
  phones,
  selectedPhoneName,
  selectedColor,
}: {
  order: "primary" | "secondary";
  phones: PhoneWithColors[];
  selectedPhoneName: string;
  selectedColor: string;
}) => {
  const options = phones.map((phone) => ({
    value: phone.name!,
    label: `${phone.name} Phone`,
  }));

  const selectedPhone = phones.find(
    (phone) => phone.name === selectedPhoneName
  );

  if (!selectedPhone) throw new Error("No selected phone found");

  console.log(selectedColor);

  return (
    <div className="flex flex-col items-center">
      <PhoneCombobox
        className="mb-4"
        order={order}
        options={options}
        selectedValue={selectedPhoneName}
      />
      <div className="relative aspect-[6/10] md:aspect-square w-full mb-4">
        <Image
          src={`/phones/${selectedPhone.name}-${selectedColor}.png`}
          alt="i14 beige"
          fill
          objectFit="contain"
          priority
          sizes={"(max-width: 768px) 50vw, 33vw"}
        />
      </div>
      <div className="flex gap-3 mb-2">
        {selectedPhone.phone_colors.map((color) => (
          <ColorButton
            key={color.id}
            colorName={color.name as string}
            order={order}
            className={cn(
              color.name === selectedColor && "border-2 border-blue-500"
            )}
          />
        ))}
      </div>
      <div className="text-xl font-semibold">{selectedColor}</div>
    </div>
  );
};

async function Page({
  searchParams,
}: {
  searchParams: {
    primary?: string;
    secondary?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}) {
  const supabase = await createClient();
  const { data } = await supabase.from("phones").select("*, phone_colors(*)");

  if (!data) throw new Error("No data found");

  const primaryPhone =
    data.find((phone) => phone.name === searchParams.primary) || data[0];
  const secondaryPhone =
    data.find((phone) => phone.name === searchParams.secondary) || data[0];

  const primaryColor =
    searchParams.primaryColor || primaryPhone.phone_colors[0].name;
  const secondaryColor =
    searchParams.secondaryColor || secondaryPhone.phone_colors[0].name;

  console.log(data);

  return (
    <div className="container flex flex-col md:items-center md:w-[720px]">
      <div className="grid grid-cols-2 w-full gap-4 md:gap-24 mt-4 mb-4">
        <Suspense fallback={<PhoneCardSkeleton />}>
          <PhoneCard
            order="primary"
            phones={data}
            selectedPhoneName={primaryPhone.name as string}
            selectedColor={primaryColor as string}
          />
        </Suspense>
        <Suspense fallback={<PhoneCardSkeleton />}>
          <PhoneCard
            order="secondary"
            phones={data}
            selectedPhoneName={secondaryPhone.name as string}
            selectedColor={secondaryColor as string}
          />
        </Suspense>
      </div>
      <ShareButton className="self-end mb-6">공유하기</ShareButton>
      <Accordion
        type="single"
        collapsible
        className="w-full md:w-[480px] mb-12"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>요약</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-center">{primaryPhone.summary}</p>
              <p className="text-center">{secondaryPhone.summary}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>저장 용량</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center items-center ">
                <Server className="h-5 w-5 mr-2" />
                <p>{primaryPhone.storage}</p>
              </div>
              <div className="flex justify-center items-center ">
                <Server className="h-5 w-5 mr-2" />
                <p>{secondaryPhone.storage}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>칩</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center items-center ">
                <CpuIcon className="h-5 w-5 mr-2" />
                <p>{primaryPhone.chip}</p>
              </div>
              <div className="flex justify-center items-center ">
                <CpuIcon className="h-5 w-5 mr-2" />
                <p>{secondaryPhone.chip}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Page;
