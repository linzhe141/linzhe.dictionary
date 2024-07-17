<template>
  <div
    class="contrast-content flex h-screen items-center justify-center overflow-hidden bg-green-400 text-[#213547]"
  >
    <div className="flex flex-col items-center justify-center">
      <ULink to="/home">
        <div
          className="text-content relative flex flex-col items-center justify-center"
        >
          <div className="click-icon absolute -right-0 top-0">
            <svg
              width="64"
              height="64"
              fill="#213547"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M509.488762 407.210667l4.047238 1.462857 375.954286 146.968381a73.142857 73.142857 0 0 1-11.727238 139.727238l-4.242286 0.755809-130.852572 19.334096-13.458285 124.976762a73.142857 73.142857 0 0 1-136.728381 27.599238l-2.023619-3.974096-169.569524-355.815619a73.142857 73.142857 0 0 1 88.600381-101.034666z m-22.576762 69.583238l169.569524 355.815619 19.529143-181.248 186.831238-27.599238-375.954286-146.968381zM414.47619 170.666667c134.119619 0 242.95619 108.30019 243.809524 242.224762l-75.995428-29.720381a170.666667 170.666667 0 1 0-178.93181 201.630476l34.499048 72.387047c-7.704381 0.731429-15.481905 1.097143-23.381334 1.097143-134.656 0-243.809524-109.153524-243.809523-243.809524S279.82019 170.666667 414.47619 170.666667z"
                p-id="3348"
              ></path>
            </svg>
          </div>
          <h1 className="text-content mb-4 text-6xl">Dictionary</h1>
          <span className="text-content text-xl">好记性不如烂笔头</span>
        </div>
        <div class="gradient mt-2 h-2 w-[400px]"></div>
      </ULink>
    </div>
  </div>
</template>
