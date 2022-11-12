import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { records } from "../../db";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout/Layout";

const navigation = [
  {
    name: "Reports",
    icon: InboxIcon,
    current: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RecordId() {
  const router = useRouter();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [contentResult, setContentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedContent, setHighlightedContent] = useState(null);
  const [mappedIndices, setMappedIndices] = useState(null);

  useEffect(() => {
    let localData = null;

    const fetchContentResult = async (content) => {
      setLoading(true);

      const response = await fetch(
        `https://densegaseousequation.jonathanchavezt.repl.co/api/entities?text=${content}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      } else {
        const data = await response.json();

        console.log(
          "response from fetchContentData",
          data.filter(
            (entity) => entity.Category === "PROTECTED_HEALTH_INFORMATION"
          )
        );

        setContentResult(data);
        localData = data
          .filter(
            (entity) => entity.Category === "PROTECTED_HEALTH_INFORMATION"
          )
          .map((entity) => [entity.BeginOffset, entity.EndOffset]);
        setMappedIndices(
          data
            .filter(
              (entity) => entity.Category === "PROTECTED_HEALTH_INFORMATION"
            )
            .map((entity) => [entity.BeginOffset, entity.EndOffset])
        );
      }

      console.log(
        "localdata from fetchContentResult",
        localData,
        mappedIndices
      );
      setLoading(false);
    };

    if (router.isReady) {
      const id = router.query.id;
      const record = records.find((record) => record.id === parseInt(id));

      fetchContentResult(record.content);
      setCurrentRecord(record);
    }
  }, [router.isReady]);

  useEffect(() => {
    setHighlightedContent(
      mappedIndices?.length > 0
        ? mappedIndices
            ?.reduce((str, [start, end]) => {
              str[
                start
              ] = `<span class="bg-yellow-400 hover:bg-black">${str[start]}`;
              str[end - 1] = `${str[end - 1]}</span>`;
              return str;
            }, currentRecord?.content.split(""))
            .join("")
        : currentRecord?.content
    );
  }, [mappedIndices, currentRecord]);

  return (
    <Layout>
      {loading && <h1>loading...</h1>}
      {currentRecord && !loading && (
        <div className="grid grid-cols-6 gap-5 w-[95%] p-4">
          <div className="col-span-4 p-3 bg-white rounded-md border ">
            <h1 className="text-md text-gray-500">
              From: Dr. {currentRecord.doctor}
            </h1>

            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightedContent,
                }}
              />
            </div>
          </div>

          <div className="col-span-2 p-3 bg-white rounded-md border ">
            <h1 className=" text-gray-900">
              {contentResult
                .filter(
                  (entity) => entity.Category === "PROTECTED_HEALTH_INFORMATION"
                )
                .map((item) => (
                  <div className="flex space-x-2">
                    <div className="text-md">{item.Text}</div>
                    <div className="text-md">
                      {item.Score.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}
                    </div>
                  </div>
                ))}
            </h1>
          </div>
        </div>
      )}
    </Layout>
  );
}
