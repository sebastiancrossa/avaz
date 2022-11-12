import { useRouter } from "next/router";
import { Layout } from "../components/layout/Layout";
import { records } from "../db";

const ProcessedReports = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Processed</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all processed reports without PII sanitization.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Content
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {records
                    .filter((record) => record.status === "processed")
                    .map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/records/" + record.id);
                          console.log("click");
                        }}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {record.doctor}
                        </td>
                        <td className="pl-3 pr-9 w-[50%] py-4 text-sm text-gray-500 text-ellipsis ">
                          {record.content.length > 100
                            ? record.content.substring(0, 100) + "..."
                            : record.content}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="bg-orange-600 px-2 p-2 rounded-full font-gold text-orange-100 text-sm">
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProcessedReports;
