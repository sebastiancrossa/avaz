import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { records } from "../db";

const Modal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState();

  const transcribeAudio = async (url) => {
    const response = await fetch(
      `https://densegaseousequation.jonathanchavezt.repl.co/api/transcribe?mp3path=${url}`
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    } else {
      const data = await response.text();

      records.push({
        id: records.length + 1,
        doctor: "Channing Tatum",
        content: data,
        status: "pending",
        audio_url: url,
      });
    }

    setLoading(false);
    setOpen(false);
  };

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleOnSubmit(event) {
    setLoading(true);
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "avaz-audio");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/kisana/video/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    transcribeAudio(data.secure_url);
    setImageSrc(data.secure_url);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Upload media
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Choose a media file to upload. Media files will be
                        transcribed.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <form
                    method="post"
                    onChange={handleOnChange}
                    onSubmit={handleOnSubmit}
                  >
                    <p>
                      <input type="file" name="file" />
                    </p>

                    <button
                      disabled={!imageSrc || loading}
                      className="mt-5 disabled:cursor-not-allowed inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Upload mp3"}
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
