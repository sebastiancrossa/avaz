import { useState } from "react";
import { useRouter } from "next/router";

import Modal from "../components/Modal";
import TextModal from "../components/TextModal";

import { Layout } from "../components/layout/Layout";

import { records } from "../db";

export default function Example() {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [textModalOpen, setTextModalOpen] = useState(false);

  return (
    <Layout>
      <Modal open={modalOpen} setOpen={setModalOpen} />
      <TextModal open={textModalOpen} setOpen={setTextModalOpen} />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Incoming</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all incoming reports without PII sanitization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            + Upload media
          </button>

          <button
            type="button"
            onClick={() => setTextModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-900 focus:ring-offset-2 sm:w-auto"
          >
            + Upload document
          </button>
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
                    .filter((record) => record.status === "pending")
                    .map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/records/" + record.id);
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
}
