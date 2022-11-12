import { useState, useEffect } from "react";
import { records } from "../../db";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout/Layout";

export default function RecordId() {
  const router = useRouter();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [entities, setEntities] = useState(null);
  const [loading, setLoading] = useState(true);

  const [highlightedContent, setHighlightedContent] = useState(null);
  const [mappedIndices, setMappedIndices] = useState(null);

  useEffect(() => {
    const fetchEntities = async (content) => {
      setLoading(true);
      const response = await fetch(
        `https://densegaseousequation.jonathanchavezt.repl.co/api/entities?text=${content}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      } else {
        const data = await response.json();
        setEntities(data);
      }
      setLoading(false);
    };

    if (router.isReady) {
      const id = router.query.id;
      const record = records.find((record) => record.id === parseInt(id));
      fetchEntities(record.content);
      setCurrentRecord(record);
    }
  }, [router.isReady]);

  const entityClassName = (type) => {
    switch (type) {
      case "AGE":
        return "text-orange-500 bg-orange-100 ";
      case "NAME":
        return "text-orange-500 bg-orange-100 ";
      case "PROFESSION":
        return "text-red-500 bg-red-100 ";
      case "DATE":
        return "text-blue-500 bg-blue-100 ";
      case "ADDRESS":
        return "text-pink-500 bg-pink-100 ";
      case "PHONE_OR_FAX":
        return "text-pink-500 bg-pink-100 ";
      default:
        return "text-gray-500 bg-gray-100 ";
    }
  };

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
          <div className="col-span-2 p-6 bg-white rounded-md border ">
            <h1 className="text-lg font-semibold text-gray-700 mb-6">
              Entities
            </h1>
            <div className="">
              {entities &&
                entities
                  .filter(
                    (entity) =>
                      entity.Category === "PROTECTED_HEALTH_INFORMATION"
                  )
                  .map((entity) => (
                    <div className="p-3 mb-1 hover:bg-gray-50 rounded-md">
                      <div className="mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-1  rounded-full ${entityClassName(
                            entity.Type
                          )}`}
                        >
                          {entity.Type}
                        </span>
                      </div>
                      <div className="px-2">
                        <div className="mb-1">{entity.Text}</div>
                        <div className="mb-1 text-xs font-semibold text-gray-700">
                          Confidence:{" "}
                          {(parseFloat(entity.Score) * 100).toFixed(0) + "%"}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
