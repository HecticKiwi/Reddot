import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const SortTabs = ({ orderBy }: { orderBy: "new" | "top" }) => {
  return (
    <>
      <Tabs defaultValue={orderBy}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new" asChild>
            <Link href="?sort=new">New</Link>
          </TabsTrigger>
          <TabsTrigger value="top" asChild>
            <Link href="?sort=top">Top</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default SortTabs;
