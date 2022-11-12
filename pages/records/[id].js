import { useState, useEffect } from "react";
import { records } from "../../db";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout/Layout";

export default function RecordId() {
  const router = useRouter();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [contentResult, setContentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const [highlightedContent, setHighlightedContent] = useState(null);
  const [mappedIndices, setMappedIndices] = useState(null);

  useEffect(() => {
    const fetchContentResult = async (content) => {
      setLoading(true);

      const response = await fetch(
        `https://densegaseousequation.jonathanchavezt.repl.co/api/entities?text=${content}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      } else {
        const data = await response.json();

        setContentResult(data);

        setMappedIndices(
          data
            .filter(
              (entity) => entity.Category === "PROTECTED_HEALTH_INFORMATION"
            )
            .map((entity) => [entity.BeginOffset, entity.EndOffset])
        );
      }

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
      {loading && <h1>Loading ...</h1>}
      {currentRecord && !loading && (
        <div className="grid grid-cols-6 gap-5 w-[95%] p-4">
          <div className="col-span-4 space-y-3">
            {currentRecord.audio_url && (
              <iframe
                height="25"
                src={currentRecord.audio_url}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full rounded-md border"
              />
            )}

            <div className="p-3 bg-white rounded-md border ">
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
